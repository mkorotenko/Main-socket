import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'default';
const locationsName = 't_locations';

export async function dbTEST() {
    let client;
    try {
        client = new MongoClient(url);
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(locationsName);

        const insertResult = await collection.insertOne({ name: "John Doe test", age: 30, email: "john.doe@example.com" });
        console.log('Inserted document:', insertResult);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

export class DataConnector {

    __client;
    __connection;
    __db;

    constructor() {
        this.__client = new MongoClient(url);
    }

    async __connectDB() {
        if (this.__db) {
            return this.__db;
        }
        this.__connection = await this.__client.connect();
        console.log('Connected successfully to DATA server');
        return this.__db = this.__connection.db(dbName);
    }

    async __closeDB() {
        if (this.__connection) {
            await this.__connection.close();
            this.__connection = null;
            this.__db = null;
        }
    }

    async __collectionRequest(collectionName, selection = {}) {
        let result = [];
        // try {
            const db = await this.__connectDB();
            const collection = db.collection(collectionName);

            result = await collection.find(selection).toArray();
        // } catch (error) {
            console.error('Error:', error);
        // } finally {
            // await client.close();
        // }

        return result;
    }

    async getTowerLocations(towers) {
        return await this.__collectionRequest(locationsName, towers);
    }
}
