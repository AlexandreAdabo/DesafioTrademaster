const amqp = require('amqplib');

let connection;
let channel;

async function connectRabbitMQ() {
  if (connection && channel) {
    return { connection, channel };
  }

  connection = await amqp.connect(process.env.RABBITMQ_URL, {
  // Configurações de retry
  reconnect: process.env.RABBITMQ_CONFIG_RECONNECT,
  reconnectBackoffStrategy: process.env.RABBITMQ_CONFIG_BACKOFF_STRATEGY,
  reconnectBackoffTime: Number(process.env.RABBITMQ_CONFIG_BACKOFF_TIME), // ms
  reconnectExponentialLimit: Number(process.env.RABBITMQ_CONFIG_EXPONENTIAL_LIMIT), // ms
  reconnectAttempts: Number(process.env.RABBITMQ_CONFIG_RECONNECT_ATTEMPTS)
});
  channel = await connection.createChannel();

  console.log('Conectado ao RabbitMQ');
  return { connection, channel };
}

module.exports = connectRabbitMQ;
