import mongoose from 'mongoose'

declare global {
  var mongoose: any // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  try {
    if (cached.conn) {
      console.log('Using cached database connection')
      return cached.conn
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      }

      console.log('Connecting to MongoDB...')
      console.log('Database:', MONGODB_DB)
      console.log('URI:', MONGODB_URI?.substring(0, MONGODB_URI.indexOf('@')) + '...') // Log URI safely
      
      cached.promise = mongoose.connect(MONGODB_URI!, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully!')
          return mongoose
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error)
          cached.promise = null // Reset the promise on error
          throw error
        })
    }
    
    try {
      cached.conn = await cached.promise
    } catch (e) {
      cached.promise = null // Reset the promise on error
      throw e
    }

    return cached.conn
  } catch (error) {
    console.error('Database connection error:', error)
    throw new Error('Failed to connect to database. Please check your connection string and try again.')
  }
}

export default dbConnect
