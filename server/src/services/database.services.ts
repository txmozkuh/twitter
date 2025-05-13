import User from '@/models/schemas/user.schema'
import { Db, MongoClient, Collection, Document } from 'mongodb'

import { env } from '@config/env'

class DatabaseService {
  private static instance: DatabaseService

  private client: MongoClient
  private database: Db | null = null

  private constructor() {
    this.client = new MongoClient(env.MONGO_URI)
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
      this.database = this.client.db(env.DB_NAME)
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
