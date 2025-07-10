import { getMessageDetail, getMessageList, sendMessage } from '@/services/message'
import { RootState } from '@/stores/store'
import { MessageRequest } from '@/types/request'
import { ChatListResponse } from '@/types/response'
import { formatDate, truncateStr } from '@/utils/other'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft, Loader2, SendHorizonal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { io, Socket } from 'socket.io-client'

export default function ChatBox() {
  const user = useSelector((state: RootState) => state.user)
  const [chatUser, setChatUser] = useState<{
    _id: string
    name: string
    username: string
    avatar: string
  } | null>(null)
  const { data: chatListData, isSuccess } = useQuery({
    queryKey: ['chatList'],
    queryFn: getMessageList
  })

  const socketRef = useRef<Socket>(null)
  useEffect(() => {
    const socket = io('http://localhost:3000', { withCredentials: true })

    socket.on('connect', () => {})
    socket.emit('register', user._id)

    socketRef.current = socket
    return () => {
      socket.disconnect()
    }
  }, [user._id])

  return (
    <div className='fixed right-8 bottom-0 z-100'>
      <Popover className='border-border-grey group w-96 rounded-lg rounded-br-none rounded-bl-none border border-b-0 bg-black'>
        <PopoverButton className='flex w-full p-2'>
          <div className='text-lg font-bold group-data-open:hidden'>Messages</div>
          {chatUser ? (
            <div className='hidden items-center gap-2 group-data-open:flex'>
              <div
                className='hover:bg-blue-sky/10 rounded-full p-1'
                onClick={(e) => {
                  e.preventDefault()
                  setChatUser(null)
                }}
              >
                <ArrowLeft />
              </div>
              <div className='size-9 overflow-hidden rounded-full'>
                <img src={chatUser!.avatar} alt='avatar' />
              </div>
              <div className='space-x-1'>
                <span className='font-semibold'>{truncateStr(chatUser!.name, 10)}</span>
                <span className='text-text-grey'>@{truncateStr(chatUser!.username, 10)}</span>
              </div>
            </div>
          ) : (
            <div className='hidden text-lg font-bold group-data-open:block'>Messages</div>
          )}
        </PopoverButton>

        <PopoverPanel
          transition
          className='border-border-grey h-[490px] w-full overflow-hidden border-t transition duration-300 ease-in-out'
        >
          {!chatUser ? (
            <ChatList list={isSuccess ? chatListData.data : []} setChatUser={setChatUser} />
          ) : (
            <ChatDetail socket={socketRef} from={user._id} to={chatUser._id} />
          )}
        </PopoverPanel>
      </Popover>
    </div>
  )
}
interface ChatListProps {
  list: ChatListResponse[]
  setChatUser: React.Dispatch<
    React.SetStateAction<{
      _id: string
      name: string
      username: string
      avatar: string
    } | null>
  >
}

const ChatList = ({ list, setChatUser }: ChatListProps) => {
  return (
    <div className='w-full'>
      {list.length === 0 ? (
        <>Bạn chưa có tin nhắn </>
      ) : (
        list.map((item) => (
          <div
            key={item.user_info.name}
            className='flex w-full items-center gap-4 p-4 transition hover:cursor-pointer hover:bg-white/10'
            onClick={() => setChatUser(item.user_info)}
          >
            <div className='size-11 overflow-hidden rounded-full'>
              <img src={item.user_info.avatar} alt='avatar' />
            </div>
            <div className='flex flex-1 flex-col justify-center'>
              <span className='flex items-center gap-2'>
                <p className='text-base font-medium'>{truncateStr(item.user_info.name, 10)}</p>
                <p className='text-text-grey text-sm'>@{truncateStr(item.user_info.username, 10)}</p>
                <p className='text-text-grey ml-auto text-base'>{formatDate(item.latestMessage.timestamp)}</p>
              </span>
              <p className='text-text-grey text-sm'>{item.latestMessage.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

interface ChatDetailProps {
  from: string
  to: string
  socket: React.RefObject<Socket | null>
}

const ChatDetail = ({ from, to, socket }: ChatDetailProps) => {
  const {
    data: chatDetailData,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ['chatDetail', to],
    queryFn: () => getMessageDetail(to)
    // 10 seconds
  })
  const { mutate, isPending: messIsPending } = useMutation({
    mutationFn: (message: MessageRequest) => sendMessage(message)
  })

  const [messageList, setMessageList] = useState<{ from: string; to: string; content: string; timestamp: string }[]>([])
  const [message, setMessage] = useState<string>('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (socket.current && message.trim() !== '') {
      const mess: MessageRequest = {
        from,
        to,
        content: message.trim(),
        timestamp: new Date().toISOString()
      }
      socket.current.emit('private message', mess)
      mutate(mess)
      setMessageList((prev) => [...prev, mess])
      setMessage('')
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messageList])

  useEffect(() => {
    setMessageList(chatDetailData?.data || [])
  }, [chatDetailData, isSuccess])

  useEffect(() => {
    if (socket.current) {
      socket.current.on('private message', (message) => {
        setMessageList((prev) => [...prev, message])
      })
    }
  }, [socket])
  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <Loader2 className='stroke-blue-sky animate-spin' />
      </div>
    )
  }
  return (
    <div className='relative size-full pb-10'>
      <div className='border-border-grey -z-10 flex size-full flex-col gap-2 overflow-scroll border-b p-2 text-sm'>
        {messageList?.map((item, index) => {
          if (item.from === from) {
            return (
              <div className='ml-auto flex max-w-[80%] flex-col last:[$>span]:block' key={index}>
                <div key={index} className='bg-blue-sky rounded-2xl rounded-br-sm p-3 text-left'>
                  {item.content}
                </div>
                <span
                  className={`${!(messageList.length - 1 === index) ? 'hidden' : ''} text-text-grey group mt-1 ml-auto text-xs`}
                >
                  {messIsPending ? 'Đang gửi' : 'Đã gửi'}
                </span>
              </div>
            )
          }
          return (
            <div key={index} className='bg-border-grey w-fit rounded-2xl rounded-bl-sm p-2'>
              {item.content}
            </div>
          )
        })}
        <div className='' ref={bottomRef} />
      </div>
      <div className='border-border-grey absolute bottom-0 z-10 w-full border-t bg-black px-3 py-2'>
        <form
          className='flex items-center gap-2 rounded-xl bg-white/15 px-2 py-1'
          onSubmit={(e) => handleSendMessage(e)}
        >
          <input
            type='text'
            className='w-auto flex-1 pl-1'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className='group hover:bg-blue-sky/20 rounded-full p-0.5'>
            <SendHorizonal className='stroke-blue-sky size-7 stroke-1 p-1 group-hover:scale-105' />
          </button>
        </form>
      </div>
    </div>
  )
}
