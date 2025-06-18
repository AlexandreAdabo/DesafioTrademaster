const { consumeStockEvents } = require('../src/consumers/stockConsumer');
const orderService = require('../src/services/orderService');
const { createChannel } = require('../src/config/rabbitmq');
const logger = require('../src/utils/logger');

// Mocks
jest.mock('../src/config/rabbitmq');
jest.mock('../src/services/orderService');
jest.mock('../src/utils/logger');

describe('Stock Consumer', () => {
  let mockChannel;

  beforeEach(() => {
    mockChannel = {
      assertExchange: jest.fn(),
      assertQueue: jest.fn().mockResolvedValue({ queue: 'test_queue' }),
      bindQueue: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn(),
      nack: jest.fn(),
    };
    createChannel.mockResolvedValue(mockChannel);
  });

  it('deve processar uma mensagem com sucesso e confirmar (ack)', async () => {
    const mockOrder = { id: 1, productId: 101, quantity: 2 };
    orderService.updateStock.mockResolvedValue(true);

    await consumeStockEvents();
    
    const consumeCallback = mockChannel.consume.mock.calls[0][1];
    await consumeCallback({ content: Buffer.from(JSON.stringify(mockOrder)) });

    expect(orderService.updateStock).toHaveBeenCalledWith(mockOrder);
    expect(mockChannel.ack).toHaveBeenCalled();
  });

  it('deve descartar a mensagem (nack) após falhas repetidas', async () => {
    const mockOrder = { id: 2, productId: 102, quantity: 5 };
    orderService.updateStock.mockRejectedValue(new Error('Falha no banco de dados'));

    await consumeStockEvents();
    const consumeCallback = mockChannel.consume.mock.calls[0][1];
    await consumeCallback({ content: Buffer.from(JSON.stringify(mockOrder)) });

    expect(logger.error).toHaveBeenCalled();
    expect(mockChannel.nack).toHaveBeenCalledWith(expect.anything(), false, false);
  });
});