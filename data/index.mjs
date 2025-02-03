import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'default';

export async function dbTEST() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection('t_locations');

        const insertResult = await collection.insertOne({ name: "John Doe test", age: 30, email: "john.doe@example.com" });
        console.log('Inserted document:', insertResult);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}
