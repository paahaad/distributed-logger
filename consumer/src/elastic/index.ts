import { Client } from '@elastic/elasticsearch';
import { KafkaMessage } from 'kafkajs';
// Elasticsearch connection configuration
const client = new Client({ node: 'elasticsearch:9200' }); // Replace with your Elasticsearch instance URL

export async function insertDataToElasticsearch(message: KafkaMessage) {

  console.log("[MESSAGE]", message.value)
  // Data to be inserted
  const logData = {
    level: "error",
    message: "Failed to connect to DB",
    resourceId: "server-1234",
    timestamp: "2023-09-15T08:00:00Z",
    traceId: "abc-xyz-123",
    spanId: "span-456",
    commit: "5e5342f",
    metadata: {
      parentResourceId: "server-0987"
    }
  };

  // Index name
  const indexName = 'log-data';

  try {
    // Index the document
    await client.index({
      index: indexName,
      body: logData,
    });

    console.log('Document indexed:');
  } catch (error) {
    console.error('Error indexing document:', error);
  } finally {
    // Close the Elasticsearch client
    await client.close();
  }
}