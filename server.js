const express = require('express');
const net = require('net');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint to receive print jobs
app.post('/print', (req, res) => {
    const { printerIP, printData } = req.body;

    if (!printerIP || !printData) {
        return res.status(400).send('Printer IP and print data are required');
    }

    sendPrintJob(printerIP, printData)
        .then(() => res.send('Print job sent successfully'))
        .catch(err => {
            console.error('Error sending print job:', err);
            res.status(500).send('Failed to send print job');
        });
});

// Function to send print data to the printer
function sendPrintJob(printerIP, printData) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();

        client.connect(9100, printerIP, () => {
            console.log('Connected to printer');
            client.write(printData);
            client.end();
            resolve();
        });

        client.on('error', (error) => {
            console.error('Connection error:', error);
            reject(error);
        });

        client.on('close', () => {
            console.log('Connection closed');
        });
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});