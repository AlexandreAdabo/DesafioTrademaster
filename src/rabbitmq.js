const amqp = require('amqplib');

let channel, connection;

async function connect() {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('RabbitMQ conectado');
  } catch (error) {
    console.error('Erro ao conectar no RabbitMQ:', error);
  }
}

async function sendToQueue(queueName, message) {
  try {
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Mensagem enviada para ${queueName}: ${message}`);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
}

async function consume(queueName, callback) {
  try {
    await channel.assertQueue(queueName);
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        callback(msg.content.toString());
        channel.ack(msg);
      }
    });
    console.log(`Consumindo mensagens de ${queueName}`);
  } catch (error) {
    console.error('Erro ao consumir mensagens:', error);
  }
}

module.exports = {
  connect,
  sendToQueue,
  consume
};
