require('dotenv').config();
const express = require('express');
const { createOrder } = require('./services/orderService');
const { publishOrderCreated } = require('./producers/orderProducer');
const startOrderConsumer = require('./consumers/orderConsumer');

const app = express();
app.use(express.json());

app.post('/orders', async (req, res) => {
  try {
    const { customer_name, total } = req.body;
    const order = await createOrder({ customer_name, total });

    await publishOrderCreated(order);

    res.status(201).json({ message: 'Pedido criado e publicado!', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

app.get('/', (req, res) => {
  res.send('E-commerce API online!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  startOrderConsumer();
});
