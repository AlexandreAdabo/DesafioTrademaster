
const { publishOrderEvent } = require('../src/producers/orderProducer');
const mockChannel = {
  assertExchange: jest.fn(),
  publish: jest.fn()
};

jest.mock('../config/rabbitmq', () => ({
  createChannel: jest.fn(() => mockChannel)
}));

describe('Order Producer', () => {
  it('deve publicar um evento de pedido', async () => {
    await publishOrderEvent({ id: 1, total: 100 });
    expect(mockChannel.publish).toHaveBeenCalled();
  });
});