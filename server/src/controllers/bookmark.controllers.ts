import bookmarkservice from '@/services/bookmarks.services'
import { BookmarkRequest, CustomRequest } from '@/types/request'
import { SuccessData, SuccessWithoutData } from '@/types/response'
import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'

export const createBookmarkController = async (
  req: CustomRequest,
  res: Response<SuccessWithoutData>,
  next: NextFunction
) => {
  const user_id = req.user_id
  const { tweet_id } = req.body as BookmarkRequest
  try {
    const message = (await bookmarkservice.createBookmark(new ObjectId(tweet_id), new ObjectId(user_id!))) as string
    res.json({
      success: true,
      message
    })
  } catch (err) {
    next(err)
  }
}

export const deleteBookmarkController = async (req: Request, res: Response<SuccessWithoutData>, next: NextFunction) => {
  const { tweet_id } = req.params
  try {
    const message = await bookmarkservice.deleteBookmark(new ObjectId(tweet_id))
    res.json({
      success: true,
      message
    })
  } catch (err) {
    next(err)
  }
}
