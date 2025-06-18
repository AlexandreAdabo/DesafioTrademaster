const connectRabbitMQ = require('../config/rabbitmq');

async function publishOrderCreated(order) {
  const { channel } = await connectRabbitMQ();
  const queue = 'order_created';

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)), {
    persistent: true,
  });

  console.log(`Pedido publicado na fila: ${queue}`);
}

module.exports = { publishOrderCreated };
