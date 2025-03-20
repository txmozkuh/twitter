import dotenv from 'dotenv'
dotenv.config()
import User from '@/models/schemas/user.schema'
import { Db, MongoClient, Collection, Document } from 'mongodb'

class DatabaseService {
  private static instance: DatabaseService

  private client: MongoClient
  private database: Db | null = null

  private constructor() {
    this.client = new MongoClient(process.env.MONGO_URI as string)
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  async connect(): Promise<Db> {
    if (!this.database) {
      await this.client.connect()
      this.database = this.client.db(process.env.DB_NAME)
    }
    return this.database
  }
  async getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
    if (!this.database) {
      throw new Error('Database is not connected')
    }
    return this.database.collection<T>(collectionName)
  }
}

const databaseService = DatabaseService.getInstance()
export default databaseService
