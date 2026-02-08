const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const config = require('./config.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 Bot activo - Biblioteca de Programación');
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', qr => {
  console.log('📱 ESCANEA ESTE QR:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot conectado');
});

client.on('message', async message => {
  const texto = message.body.trim();
  
  if (/^[1-5]$/.test(texto)) {
    const opcion = parseInt(texto);
    if (opcion === 1) {
      await message.reply('📚 *LISTA COMPLETA DE LIBROS*');
      await client.sendMessage(message.from, config.fotos.lista_libros);
    } else if (opcion === 2) {
      await message.reply('✅ *COMPROBANTES REALES*');
      await client.sendMessage(message.from, config.fotos.comprobantes);
    } else if (opcion === 3) {
      await message.reply('☁️ *ACCESO A GOOGLE DRIVE*');
      await client.sendMessage(message.from, config.fotos.drive);
    } else if (opcion === 4) {
      await message.reply(`💵 *PRECIO:* ${config.precio}`);
      await client.sendMessage(message.from, config.fotos.qr_pago);
    } else if (opcion === 5) {
      await message.reply('📥 *¿CÓMO RECIBIR?*\\n1. Paga 35 Bs\\n2. Envía comprobante\\n3. Recibes Drive en minutos');
    }
    return;
  }
  
  if (texto.toLowerCase().includes('hola')) {
    message.reply(config.mensajes.bienvenida);
  }
});

client.initialize();
