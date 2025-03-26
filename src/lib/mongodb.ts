
import { MongoClient, ServerApiVersion } from 'mongodb';

// Use environment variables for connection string and database name
// Default values for development
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = import.meta.env.VITE_MONGODB_DB_NAME || 'church_database';

// Create a MongoClient with connection options
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connection pool
let clientPromise: Promise<MongoClient>;

// In development, use a global variable to maintain connection across hot-reloads
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  if (!global._mongoClientPromise) {
    // @ts-ignore
    global._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new connection for each request
  clientPromise = client.connect();
}

export const getMongoClient = async () => {
  return await clientPromise;
};

export const getDatabase = async () => {
  const client = await clientPromise;
  return client.db(DB_NAME);
};

export const getCollection = async (collectionName: string) => {
  const db = await getDatabase();
  return db.collection(collectionName);
};

// Example helper functions
export const findOne = async (collectionName: string, query: object) => {
  const collection = await getCollection(collectionName);
  return collection.findOne(query);
};

export const findMany = async (collectionName: string, query: object = {}, options: object = {}) => {
  const collection = await getCollection(collectionName);
  return collection.find(query, options).toArray();
};

export const insertOne = async (collectionName: string, document: object) => {
  const collection = await getCollection(collectionName);
  return collection.insertOne(document);
};

export const updateOne = async (collectionName: string, filter: object, update: object) => {
  const collection = await getCollection(collectionName);
  return collection.updateOne(filter, { $set: update });
};

export const deleteOne = async (collectionName: string, filter: object) => {
  const collection = await getCollection(collectionName);
  return collection.deleteOne(filter);
};

export default clientPromise;
