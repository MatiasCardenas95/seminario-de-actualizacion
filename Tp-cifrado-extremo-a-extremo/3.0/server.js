const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Almacén de mensajes simulado
const messages = [];

app.use(bodyParser.json());

app.get('/', (req, res) => {
    // Servir la página HTML del cliente
    res.sendFile(__dirname + '/index.html');
});

app.get('/check-messages', (req, res) => {
    // Simulación de mensajes (deberás obtener mensajes reales de tu base de datos)
    res.json(messages);
});

app.post('/send-message', (req, res) => {
    const { message } = req.body;
    // Guardar el mensaje (deberás almacenarlo en tu base de datos)
    messages.push(message);
    res.status(204).end();
});

app.listen(3000, () => {
    console.log('Servidor en ejecución en el puerto 3000');
});
