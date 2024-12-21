const express = require('express');
const app = express();

let ledState = 'off';  // Default LED state

// ESP32 Polls This Route (GET request)
app.get('/', (req, res) => {
    const action = req.query.action;  // Get action from URL params

    if (action === 'on' || action === 'off') {
        ledState = action;  // Update LED state
        console.log(`LED set to: ${action}`);
        res.json({ success: true, state: ledState });
    } else {
        res.send(ledState);  // Just show current state if no action is sent
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
