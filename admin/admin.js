const { Kafka } = require('kafkajs')
const { Client } = require('@elastic/elasticsearch');

// Rest of the code remains the same

const kafkaAdmin = new Kafka({
    clientId: "kakfa-logger",
    brokers: ['localhost:9092']
})
const client = new Client({ node: 'http://localhost:9200' });

// setup kafka
async function init() {
    const admin = kafkaAdmin.admin()
    console.log("🚀 Connecting Admin...")
    await admin.connect()
    console.log("✅ Admin Connection Successfull")

    console.log("Creating Topic [logger]...")
    await admin.createTopics({
        topics: [{
            topic: 'logger',
            numPartitions: 2,
        }]
    })
    console.log("✅ Topic Connection Successfull")
    console.log("Disconneting Admin...")
    await admin.disconnect()
    console.log("✅ Admin Disconnected Successfull")
}

// setup elastic
async function createIndexMapping() {
    try {
        await client.indices.create({
            index: "log-data",
            body:{
                mappings: {
                    properties: {
                        "name": {
                            type: "text",
                            index: true
                        },
                        "surname": {
                            type: "text",
                            index: true
                        }
                    }
                }
            },
            headers: { 'Content-Type': 'application/json' }
        })
        console.log('Index created with mapping:', body);
    } catch (error) {
        console.error('Error creating index:', error);
    } finally {
        // Close the Elasticsearch client
        await client.close();
    }
}

// Call the function to create index mapping
createIndexMapping();

// Call the function to create topic
init()