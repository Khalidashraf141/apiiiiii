const express = require('express');
const app = express();

// Middleware to handle different content types
app.use(express.json());  // For JSON data
app.use(express.urlencoded({ extended: true }));  // For form data
app.use(express.text());  // For plain text

let ledState = 'off';
let temperature = 25;  // Default temperature

// ESP32 Polls for LED Status
app.get('/', (req, res) => {
    const { deviceid, action } = req.query;

    if (deviceid === '1') {
        if (action === 'on' || action === 'off') {
            ledState = action;
        }
        res.send(ledState);
    } else if (deviceid === '2' && action === 'get') {
        res.json({ success: true, temperature: temperature });
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

// ESP32 Posts Temperature Data
app.post('/', (req, res) => {
    let deviceid, temp;

    // Handle plain text data
    if (typeof req.body === 'string') {
        const [id, tempData] = req.body.split('&').map(e => e.split('=')[1]);
        deviceid = id;
        temp = tempData;
    } else {
        deviceid = req.body.deviceid;
        temp = req.body.temperature;
    }

    if (deviceid === '2' && temp) {
        temperature = temp;
        console.log(`Temperature Updated: ${temperature}°C`);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid temperature data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
