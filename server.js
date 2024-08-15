const express = require('express');
const cors = require('cors');
const net = require('net');

const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

app.use(express.json());

app.post('/print', (req, res) => {
    const { printerIP, printData } = req.body;

    const client = new net.Socket();
    client.connect(9100, printerIP, () => {
        client.write(printData);
        client.end();
    });

    client.on('close', () => {
        res.send('Print job sent successfully');
    });

    client.on('error', (err) => {
        res.status(500).send('Failed to send print job: ' + err.message);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
