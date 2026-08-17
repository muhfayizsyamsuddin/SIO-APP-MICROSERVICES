const amqp = require('amqplib');
require('dotenv').config();

const RABBITMQ_URL =
  process.env.RABBITMQ_URL ||
  'amqp://root:root@sio-rabbitmq:5672';

const EXCHANGE_NAME = 'sio.events';
const QUEUE_NAME = 'order.created.queue';
const ROUTING_KEY = 'order.created';

async function startConsumer() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(
    EXCHANGE_NAME,
    'topic',
    { durable: true }
  );

  await channel.assertQueue(
    QUEUE_NAME,
    { durable: true }
  );

  await channel.bindQueue(
    QUEUE_NAME,
    EXCHANGE_NAME,
    ROUTING_KEY
  );

  console.log('Subscribe Service connected to RabbitMQ');
  console.log(`Waiting for ${ROUTING_KEY} events...`);

  channel.consume(QUEUE_NAME, (message) => {
    if (!message) {
      return;
    }

    try {
      const event = JSON.parse(
        message.content.toString()
      );

      console.log('Received event:', event);

      channel.ack(message);
    } catch (error) {
      console.error(
        'Failed to process message:',
        error
      );

      channel.nack(
        message,
        false,
        false
      );
    }
  });
}

startConsumer().catch((error) => {
  console.error(
    'Subscribe Service failed to start:',
    error
  );

  process.exit(1);
});