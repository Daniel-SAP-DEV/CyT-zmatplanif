const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Serve static files from webapp directory
app.use(express.static(path.join(__dirname, 'webapp')));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'webapp', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Open your browser and navigate to http://localhost:8080');
});
