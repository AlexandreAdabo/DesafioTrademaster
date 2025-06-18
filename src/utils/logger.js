const winston = require('winston');
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(), // Adiciona timestamp automático
    json() // Saída em JSON
  ),
  transports: [
    new winston.transports.Console(), // Log no console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log de erros em arquivo
    new winston.transports.File({ filename: 'logs/combined.log' }), // Log geral em arquivo
  ],
});

// Exemplo de uso:
// logger.info('Mensagem informativa', { metadata: { orderId: 123 } });
// logger.error('Erro crítico', { error: error.stack });

module.exports = logger;