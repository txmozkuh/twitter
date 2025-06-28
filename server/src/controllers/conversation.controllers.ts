import { env } from '@/config/env'
import { serverSocket } from '@/config/socket'
import Conversation from '@/models/schemas/conversation.schema'
import databaseService from '@/services/database.services'
import { CustomRequest, MessageRequest } from '@/types/request'
import { ChatListResponse, SuccessData, SuccessWithoutData } from '@/types/response'
import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'

//lấy danh sách người chat theo user_id
//Lấy tin nhắn mới nhất theo user_id và reciever_id (sort -1)

export const getChatListController = async (
  req: CustomRequest,
  res: Response<SuccessData<ChatListResponse[]>>,
  next: NextFunction
) => {
  const user_id = new ObjectId(req.user_id)

  const data = await (
    await databaseService.getCollection(env.CONVERSATIONS_COLLECTION)
  )
    .aggregate<ChatListResponse>([
      {
        $match: {
          $or: [
            {
              from: user_id
            },
            {
              to: user_id
            }
          ]
        }
      },
      {
        $project: {
          content: 1,
          timestamp: 1,
          otherUserId: {
            $cond: [
              {
                $eq: ['$from', user_id]
              },
              '$to',
              '$from'
            ]
          }
        }
      },
      {
        $sort: {
          timestamp: -1
        }
      },
      {
        $group: {
          _id: '$otherUserId',
          latestMessage: {
            $first: '$$ROOT'
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user_info'
        }
      },
      {
        $unwind: {
          path: '$user_info',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          latestMessage: {
            content: 1,
            timestamp: 1
          },
          user_info: {
            _id: 1,
            name: 1,
            username: 1,
            avatar: 1
          }
        }
      }
    ])
    .toArray()
  res.json({
    success: true,
    message: 'Lấy danh sách chat thành công',
    data
  })
}

export const getChatDetailController = async (
  req: CustomRequest,
  res: Response<SuccessData<any[]>>,
  next: NextFunction
) => {
  const user_id = new ObjectId(req.user_id)

  const reciever_id = new ObjectId(req.params.user_id)
  const { max } = !req.query ? { max: 5 } : req.query
  const data = await (
    await databaseService.getCollection(env.CONVERSATIONS_COLLECTION)
  )
    .aggregate([
      {
        $match: {
          $or: [
            {
              from: user_id,
              to: reciever_id
            },
            {
              from: reciever_id,
              to: user_id
            }
          ]
        }
      },
      {
        $limit: 20
      },
      {
        $sort: {
          timestamp: 1
        }
      }
    ])
    .toArray()

  res.json({ success: true, message: 'Lấy thông tin chat thành công', data })
}

export const sendMessageController = async (req: Request, res: Response<SuccessWithoutData>, next: NextFunction) => {
  try {
    const message = req.body as MessageRequest
    await (
      await databaseService.getCollection(env.CONVERSATIONS_COLLECTION)
    ).insertOne({
      from: new ObjectId(message.from),
      to: new ObjectId(message.to),
      content: message.content,
      timestamp: new Date()
    })
    res.json({
      success: true,
      message: 'Lưu tin nhắn thành công'
    })
  } catch (error) {
    next(error)
  }
}
