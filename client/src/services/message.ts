import httpService from '@/config/http'
import { SuccessData } from '@/types/api'
import { MessageRequest } from '@/types/request'
import { ChatListResponse } from '@/types/response'

export const getMessageList = async (): Promise<SuccessData<ChatListResponse[]>> => {
  return await httpService.get('/conversations/message')
}

export const getMessageDetail = async (
  user_id: string
): Promise<SuccessData<{ from: string; to: string; content: string; timestamp: string }[]>> => {
  return await httpService.get(`/conversations/message/detail/${user_id}`)
}

export const sendMessage = async (message: MessageRequest) => {
  return await httpService.post('/conversations/send-message', message)
}
