const connectRabbitMQ = require('../config/rabbitmq');

async function startOrderConsumer() {
  const { channel } = await connectRabbitMQ();
  const queue = 'order_created';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      console.log(`[CONSUMER] Processando pedido: ${JSON.stringify(order)}`);

      try {
        // Aqui simula envio de email ou outra ação
        console.log(`Email enviado para cliente: ${order.customer_name}`);

        // Confirma processamento
        channel.ack(msg);
      } catch (err) {
        console.error(`Erro ao processar pedido: ${err}`);
        // Recoloca na fila para retry
        channel.nack(msg, false, true);
      }
    }
  });

  console.log(`Consumidor ativo na fila: ${queue}`);
}

module.exports = startOrderConsumer;
