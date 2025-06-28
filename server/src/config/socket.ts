import { Server, Socket } from 'socket.io'
import { Server as HTTPServer } from 'http'
import databaseService from '@/services/database.services'
import { env } from './env'

const userSockets = new Map<string, string>()

export const serverSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:4000',
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  })
  io.on('connect', (socket: Socket) => {
    console.log('Client connected:', socket.id)

    socket.on('register', (userId: string) => {
      userSockets.set(userId, socket.id)
      console.log(`User ${userId} registered with socket ${socket.id}`)
    })

    socket.on('private message', async ({ from, to, content }) => {
      const message = {
        from,
        to,
        content,
        timestamp: new Date()
      }
      // Optional: Save message to MongoDB here
      // await saveMessageToDB(message);

      const targetSocketId = userSockets.get(to)
      if (targetSocketId) {
        io.to(targetSocketId).emit('private message', message)
      }
    })

    socket.on('disconnect', () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId)
          break
        }
      }
      console.log(`Socket ${socket.id} disconnected`)
    })
  })

  return io
}
