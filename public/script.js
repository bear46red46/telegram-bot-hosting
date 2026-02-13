// DOM elementlari
const botFile = document.getElementById('botFile');
const reqFile = document.getElementById('requirementsFile');
const fileList = document.getElementById('fileList');
const deployBtn = document.getElementById('deployBtn');
const consoleOutput = document.getElementById('consoleOutput');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const pingSection = document.getElementById('pingSection');
const pingUrl = document.getElementById('pingUrl');

// Yuklangan fayllar obyekti
const uploadedFiles = {};

// Username va email (o'zgartirishingiz mumkin)
document.getElementById('username').textContent = 'Sulaymon Bekpulotov';
document.getElementById('email').textContent = 'sulaymonbekpulatov@gmail.com';

// bot.js fayli yuklanganda
botFile.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.name === 'bot.py') {
        uploadedFiles.bot = file;
        updateFileList();
    } else {
        alert('❌ Faqat bot.py fayli qabul qilinadi!');
        this.value = '';
    }
});

// requirements.txt yuklanganda
reqFile.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.name === 'requirements.txt') {
        uploadedFiles.requirements = file;
        updateFileList();
    } else {
        alert('❌ Faqat requirements.txt fayli qabul qilinadi!');
        this.value = '';
    }
});

// Fayllar ro'yxatini yangilash
function updateFileList() {
    fileList.innerHTML = '';
    
    if (uploadedFiles.bot) {
        fileList.appendChild(createFileElement('bot', uploadedFiles.bot));
    }
    
    if (uploadedFiles.requirements) {
        fileList.appendChild(createFileElement('requirements', uploadedFiles.requirements));
    }
    
    // Deploy tugmasi holati
    deployBtn.disabled = !(uploadedFiles.bot && uploadedFiles.requirements);
}

// Fayl elementi yaratish
function createFileElement(type, file) {
    const div = document.createElement('div');
    div.className = 'file-item';
    
    const icon = type === 'bot' ? '🐍' : '📦';
    const size = (file.size / 1024).toFixed(2);
    
    div.innerHTML = `
        <div class="file-info">
            <div class="file-icon">${icon}</div>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${size} KB</div>
            </div>
        </div>
        <button class="delete-btn" onclick="deleteFile('${type}')">🗑️</button>
    `;
    
    return div;
}

// Faylni o'chirish
window.deleteFile = function(type) {
    delete uploadedFiles[type];
    if (type === 'bot') botFile.value = '';
    else reqFile.value = '';
    updateFileList();
};

// Deploy tugmasi bosilganda
deployBtn.addEventListener('click', async function() {
    if (!uploadedFiles.bot || !uploadedFiles.requirements) {
        alert('Iltimos, barcha fayllarni yuklang!');
        return;
    }
    
    // Deploy boshlanishi
    deployBtn.disabled = true;
    deployBtn.textContent = '⏳ Deploy qilinmoqda...';
    consoleOutput.innerHTML = '';
    
    // Deploy jarayonini simulyatsiya qilish
    await deployBot();
});

// Botni deploy qilish
async function deployBot() {
    const steps = [
        { msg: '📁 Bot papkasi yaratilmoqda...', delay: 1000 },
        { msg: '✅ Bot papkasi yaratildi', delay: 500 },
        { msg: '🐍 Virtual environment yaratilmoqda...', delay: 1500 },
        { msg: '✅ Virtual environment tayyor', delay: 500 },
        { msg: '📦 Kutubxonalar o\'rnatilmoqda...', delay: 2000 },
        { msg: '✅ Kutubxonalar o\'rnatildi', delay: 500 },
        { msg: '🤖 Bot ishga tushirilmoqda...', delay: 1500 },
        { msg: '✅ Bot muvaffaqiyatli ishga tushdi!', delay: 500 },
        { msg: '📡 Bot ishlamoqda... Telegram serverlariga ulanyapti', delay: 0 }
    ];
    
    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        addToConsole(step.msg);
    }
    
    // Deploy tugadi
    deployBtn.textContent = '✅ Deploy qilindi';
    statusDot.classList.add('running');
    statusText.textContent = 'Ishlayapti';
    
    // Ping URL ni ko'rsatish
    const baseUrl = window.location.origin;
    pingUrl.textContent = baseUrl + '/ping';
    pingSection.style.display = 'block';
    
    // 24/7 ishlashi uchun ping yuborish
    startPinging();
}

// Konsolga yozish
function addToConsole(text) {
    consoleOutput.innerHTML += text + '\n';
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// 24/7 ping yuborish
function startPinging() {
    setInterval(async () => {
        try {
            const response = await fetch('/ping');
            if (response.ok) {
                console.log('✅ Ping yuborildi');
            }
        } catch (error) {
            console.error('❌ Ping xatosi:', error);
        }
    }, 5 * 60 * 1000); // Har 5 daqiqada
}

// Health check
setInterval(async () => {
    try {
        const response = await fetch('/health');
        if (response.ok) {
            statusDot.classList.add('running');
            statusText.textContent = 'Ishlayapti';
        }
    } catch (error) {
        statusDot.classList.remove('running');
        statusText.textContent = 'To\'xtatilgan';
    }
}, 30000); // Har 30 sekundda
