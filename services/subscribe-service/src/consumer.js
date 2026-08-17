const emailjs = require('@emailjs/nodejs');
const amqp = require('amqplib');
require('dotenv').config();

const RABBITMQ_URL =
  process.env.RABBITMQ_URL ||
  'amqp://root:root@sio-rabbitmq:5672';

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL ||
  'http://sio-user-service:3001';

const INTERNAL_SERVICE_KEY =
  process.env.INTERNAL_SERVICE_KEY;

const EMAILJS_SERVICE_ID =
  process.env.EMAILJS_SERVICE_ID;

const EMAILJS_TEMPLATE_ID =
  process.env.EMAILJS_TEMPLATE_ID;

const EMAILJS_PUBLIC_KEY =
  process.env.EMAILJS_PUBLIC_KEY;

emailjs.init({
  publicKey: EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY
});

const EXCHANGE_NAME = 'sio.events';
const QUEUE_NAME = 'order.created.queue';
const ROUTING_KEY = 'order.created';

async function getUserEmail(userId) {
  const response = await fetch(
    `${USER_SERVICE_URL}/users/internal/${userId}/email`,
    {
      headers: {
        'X-Internal-Key': INTERNAL_SERVICE_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get user email: ${response.status}`
    );
  }

  const data = await response.json();

  return data.email;
}

async function sendEmail({
  toEmail,
  orderId,
  status,
  total
}) {
  const response = await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email: toEmail,
      order_id: orderId,
      status,
      total
    }
  );

  console.log(
    `Email sent successfully to ${toEmail}`,
    response.status,
    response.text
  );
}

async function processOrderCreated(event) {
  const {
    orderId,
    userId,
    statusOrder,
    items = []
  } = event;

  const email = await getUserEmail(userId);

  const total = items.reduce(
    (sum, item) => {
      return (
        sum +
        Number(item.quantity) *
        Number(item.priceAtOrder)
      );
    },
    0
  );

  await sendEmail({
    toEmail: email,
    orderId,
    status: statusOrder,
    total
  });
}

async function startConsumer() {
  const connection = await amqp.connect(
    RABBITMQ_URL
  );

  const channel =
    await connection.createChannel();

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

  console.log(
    'Subscribe Service connected to RabbitMQ'
  );

  console.log(
    `Waiting for ${ROUTING_KEY} events...`
  );

  channel.consume(
    QUEUE_NAME,
    async (message) => {
      if (!message) {
        return;
      }

      try {
        const event = JSON.parse(
          message.content.toString()
        );

        console.log(
          'Received event:',
          event
        );

        await processOrderCreated(event);

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
    }
  );
}

startConsumer().catch((error) => {
  console.error(
    'Subscribe Service failed to start:',
    error
  );

  process.exit(1);
});