const express = require('express');
const app = express();

app.use(express.json());

let ledState = 'off';
let temperature = 25;  // Default temperature

// ESP32 Polls for LED Status
app.get('/', (req, res) => {
    const { deviceid, action } = req.query;

    if (deviceid === '1') {
        // LED Control Device
        if (action === 'on' || action === 'off') {
            ledState = action;
        }
        res.send(ledState);  // Return LED state
    } else if (deviceid === '2' && action === 'get') {
        // Return temperature when requested
        res.json({ success: true, temperature: temperature });
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

// ESP32 Posts Temperature Data
app.post('/', (req, res) => {
    const { deviceid, temperature: temp } = req.body;

    if (deviceid === '2' && temp) {
        temperature = temp;  // Update temperature from ESP32
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
