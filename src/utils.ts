import mongoose, { Connection, Mongoose } from "mongoose";

export interface DBUtil {
  getCollections: () => void;
}

class DBImplementation implements DBUtil {
  private readonly mongoUri: string;
  private db: Connection | null = null;
  private static instance: DBImplementation | null = null;

  private constructor() {
    this.mongoUri = process.env.MONGO_URI as string;
    if (!this.mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
  }

  public static getInstance(): DBImplementation {
    if (!DBImplementation.instance) {
      DBImplementation.instance = new DBImplementation();
    }
    return DBImplementation.instance;
  }

  private async connect(): Promise<Connection> {
    if (this.db) {
      return this.db;
    }

    try {
      const mongooseInstance: Mongoose = await mongoose.connect(this.mongoUri);
      this.db = mongooseInstance.connection;
      return this.db;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  public async getDBConection() {
    await this.connect();
  }
  public async getCollections(): Promise<any> {
    const db = await this.connect();
    return db.listCollections();
  }
}

const dataSource = DBImplementation.getInstance();
export default dataSource;
