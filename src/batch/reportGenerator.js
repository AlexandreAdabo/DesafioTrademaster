const { createChannel } = require('../config/rabbitmq');
const db = require('../services/database');
const logger = require('../utils/logger');

async function generateDailyReport() {
  try {
    // Consulta os pedidos das últimas 24 horas
    const query = `
      SELECT 
        COUNT(id) as total_orders, 
        SUM(total) as revenue 
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '1 DAY'
    `;
    const { rows: [report] } = await db.query(query);

    const reportData = {
      date: new Date().toISOString(),
      totalOrders: report.total_orders || 0,
      revenue: report.revenue || 0,
    };

    const channel = await createChannel();
    await channel.assertQueue('report_queue', { durable: true });
    channel.sendToQueue(
      'report_queue',
      Buffer.from(JSON.stringify(reportData)),
      { persistent: true }
    );

    logger.info(`Relatório diário gerado: ${JSON.stringify(reportData)}`);
  } catch (error) {
    logger.error(`Falha ao gerar relatório: ${error.message}`);
    throw error;
  }
}

module.exports = { generateDailyReport };