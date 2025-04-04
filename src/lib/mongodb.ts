
/**
 * Browser-compatible MongoDB client utility
 * 
 * IMPORTANT: This file provides a mock implementation for browser environment
 * In production, you should use a backend API to interact with MongoDB
 */

import { toast } from "sonner";

// Define types for our data models
export interface ChurchConfig {
  configType: string;
  sermonAudioId: string;
  sermonCount: number;
}

export interface HouseChurchGroup {
  id: string;
  name: string;
  day: string;
  time: string;
  location: string;
  description: string;
  leaders: string;
  image: string;
}

// Mock data for development
const mockData = {
  church_config: [
    {
      _id: "config1",
      configType: "sermon_audio",
      sermonAudioId: "gategaborone",
      sermonCount: 5
    }
  ],
  leadership: [
    {
      _id: "1",
      name: "Pastor Kobus Bezuidenhout",
      role: "Senior Pastor",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      bio: "Pastor Kobus Bezuidenhout has been leading our congregation with wisdom and compassion.",
      email: "pastor@gategaborone.org",
      isSeniorPastor: true
    },
    {
      _id: "2",
      name: "Sarah Johnson",
      role: "Worship Director",
      image: "https://images.unsplash.com/photo-1573497491765-55a968388b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      bio: "Sarah has been leading our worship team for 8 years."
    }
  ],
  house_church_groups: [
    {
      _id: "1",
      name: "Faith & Family",
      day: "Wednesday",
      time: "6:30 PM",
      location: "North Gaborone",
      description: "A group focused on strengthening families through Bible study and prayer, with activities for children and teens.",
      leaders: "James & Mary Wilson",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
    },
    {
      _id: "2",
      name: "Young Adults",
      day: "Wednesday",
      time: "6:30 PM",
      location: "CBD",
      description: "For college students and young professionals seeking community and spiritual growth in a relaxed atmosphere.",
      leaders: "Michael & Sarah Thompson",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1784&q=80"
    },
    {
      _id: "3",
      name: "Deeper Walk",
      day: "Wednesday",
      time: "6:30 PM",
      location: "East Gaborone",
      description: "An in-depth Bible study group focused on theological understanding and practical application.",
      leaders: "Pastor Robert Chen",
      image: "https://images.unsplash.com/photo-1577896851698-52dd2060e3b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    },
    {
      _id: "4",
      name: "Senior Fellowship",
      day: "Wednesday",
      time: "6:30 PM",
      location: "Church Campus",
      description: "A group for seniors focusing on fellowship, prayer, and mutual support.",
      leaders: "Harold & Betty Johnson",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      _id: "5",
      name: "Women of Grace",
      day: "Wednesday",
      time: "6:30 PM",
      location: "West Gaborone",
      description: "A women's Bible study group with childcare provided, focusing on growing in faith amid life's many seasons.",
      leaders: "Jennifer Adams",
      image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
    },
    {
      _id: "6",
      name: "International Fellowship",
      day: "Wednesday",
      time: "6:30 PM",
      location: "South Gaborone",
      description: "A multicultural group celebrating diverse backgrounds while studying God's Word together. Several languages spoken.",
      leaders: "Gabriel & Sophia Rodriguez",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    }
  ]
};

/**
 * Helper function to find a single document in the mock database
 */
export const findOne = async (collectionName: string, query: Record<string, any>) => {
  console.log(`Finding one document in ${collectionName} with query:`, query);
  
  // Check if collection exists
  if (!mockData[collectionName as keyof typeof mockData]) {
    console.warn(`Collection "${collectionName}" not found in mock data`);
    return null;
  }
  
  // Simple query matching (only supports exact matches on fields)
  const collection = mockData[collectionName as keyof typeof mockData];
  const result = (collection as any[]).find(item => {
    return Object.entries(query).every(([key, value]) => item[key] === value);
  });
  
  // Log the result for debugging
  console.log(`Result from findOne in ${collectionName}:`, result);
  
  return result || null;
};

/**
 * Helper function to find multiple documents in the mock database
 */
export const findMany = async (collectionName: string, query: Record<string, any> = {}, options: Record<string, any> = {}) => {
  console.log(`Finding documents in ${collectionName} with query:`, query);
  
  // Check if collection exists
  if (!mockData[collectionName as keyof typeof mockData]) {
    console.warn(`Collection "${collectionName}" not found in mock data`);
    return [];
  }
  
  const collection = mockData[collectionName as keyof typeof mockData];
  
  // If query is empty, return all documents
  if (Object.keys(query).length === 0) {
    return [...(collection as any[])];
  }
  
  // Simple query matching (only supports exact matches on fields)
  const results = (collection as any[]).filter(item => {
    return Object.entries(query).every(([key, value]) => item[key] === value);
  });
  
  // Log the results for debugging
  console.log(`Found ${results.length} documents in ${collectionName}`);
  
  return results;
};

/**
 * Helper function to insert a document in the mock database (just for API compatibility)
 */
export const insertOne = async (collectionName: string, document: Record<string, any>) => {
  console.log(`Mock insertOne operation on ${collectionName}:`, document);
  toast("This is a mock database. Data will not be persisted.");
  return { acknowledged: true, insertedId: "mock-id-" + Date.now() };
};

/**
 * Helper function to update a document in the mock database (just for API compatibility)
 */
export const updateOne = async (collectionName: string, filter: Record<string, any>, update: Record<string, any>) => {
  console.log(`Mock updateOne operation on ${collectionName}:`, { filter, update });
  toast("This is a mock database. Data will not be persisted.");
  return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
};

/**
 * Helper function to delete a document in the mock database (just for API compatibility)
 */
export const deleteOne = async (collectionName: string, filter: Record<string, any>) => {
  console.log(`Mock deleteOne operation on ${collectionName}:`, filter);
  toast("This is a mock database. Data will not be persisted.");
  return { acknowledged: true, deletedCount: 1 };
};

// Export other functions for API compatibility (they don't actually do anything in the browser)
export const getMongoClient = async () => {
  console.warn("getMongoClient is not supported in browser environment");
  return null;
};

export const getDatabase = async () => {
  console.warn("getDatabase is not supported in browser environment");
  return null;
};

export const getCollection = async (collectionName: string) => {
  console.warn("getCollection is not supported in browser environment");
  return null;
};

// Export a mock client promise for API compatibility
const clientPromise = Promise.resolve(null);
export default clientPromise;
