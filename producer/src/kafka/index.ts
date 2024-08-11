import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
    clientId: "kakfa-logger",
    brokers: ['kafka1:29090']
})

export const producer = kafka.producer();