const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from 'frontend/public'
app.use(express.static(path.join(__dirname, 'frontend/public')));

// For any route, serve index.html (for Single Page Application behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Infinity Mutual Funds app running at:`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(`🌐 http://localhost:${PORT}/login.html`);
    console.log(`🌐 http://localhost:${PORT}/register.html`);
});