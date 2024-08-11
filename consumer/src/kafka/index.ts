import { Consumer, ConsumerSubscribeTopics, Kafka, EachMessagePayload } from 'kafkajs'
import { insertDataToElasticsearch } from "../elastic/index.js"

const kafka = new Kafka({
    clientId: "kakfa-logger",
    brokers: ['kafka1:29090']
})

const consumer:Consumer = kafka.consumer({ groupId: "logs" });
export async function startBatchConsumer(): Promise<void> {

    const topic: ConsumerSubscribeTopics = {
      topics: ['logger'],
      fromBeginning: false
    }
    try {
      await consumer.connect()
      console.log("✅ Consumer Connected successfully")
      await consumer.subscribe(topic)
      console.log("✅ Subsrcibe the topic successfully")
      await consumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, partition, message } = messagePayload
          await insertDataToElasticsearch(message)
          const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
          console.log(`💻${prefix} ${message.key}#${message.value}`)
        }
      })
    } catch (error) {
      console.log('Error: ', error)
    }
}