const logger = require('./logger');

async function retryHandler(operation, maxRetries, delayMs = 1000) {
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      return await operation(); // Executa a operação
    } catch (error) {
      if (attempt === maxRetries) {
        logger.error(`Falha após ${maxRetries} tentativas: ${error.message}`);
        throw error; // Repropaga o erro se todas as tentativas falharem
      }

      const waitTime = delayMs * Math.pow(2, attempt - 1); // Backoff exponencial
      logger.warn(`Tentativa ${attempt} falhou. Nova tentativa em ${waitTime}ms...`);

      await new Promise(resolve => setTimeout(resolve, waitTime)); // Aguarda antes de retentar
      attempt++;
    }
  }
}

// Exemplo de uso:
// await retryHandler(() => orderService.updateStock(order), 3, 1000);

module.exports = retryHandler;