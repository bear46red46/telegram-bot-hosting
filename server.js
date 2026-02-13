const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Papkalarni yaratish (agar mavjud bo'lmasa)
const dirs = ['uploads', 'bots'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log(`📁 ${dir} papkasi yaratildi`);
    }
});

// ============================================
//  HEALTH CHECK ENDPOINTS (24/7 UCHUN MUHIM)
// ============================================

// Health check - Render service ni jonli saqlash
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Ping endpoint - cron-job.org uchun
app.get('/ping', (req, res) => {
    res.status(200).json({
        status: 'alive',
        message: 'Bot 24/7 ishlayapti!',
        timestamp: new Date().toISOString()
    });
});

// ============================================
//  ASOSIY ENDPOINTS
// ============================================

// Bosh sahifa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Bot deploy qilish
app.post('/api/deploy', (req, res) => {
    // Bu yerda haqiqiy deploy logikasi bo'ladi
    res.json({
        success: true,
        message: 'Bot deploy qilindi',
        botId: Date.now().toString()
    });
});

// Bot holatini tekshirish
app.get('/api/bot/:id/status', (req, res) => {
    res.json({
        id: req.params.id,
        status: 'running',
        uptime: process.uptime()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Sahifa topilmadi');
});

// Serverni ishga tushirish
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server ishga tushdi!`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`💓 Health check: http://localhost:${PORT}/health`);
    console.log(`🏓 Ping: http://localhost:${PORT}/ping`);
    console.log('='.repeat(50));
});
