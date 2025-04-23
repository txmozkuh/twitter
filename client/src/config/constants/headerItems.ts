import { PATH } from '@/types/path'
import { Bookmark, Home, Search, UserRound } from 'lucide-react'

export const headerItems = [
  {
    url: PATH.HOME,
    icon: Home,
    title: 'Home'
  },
  {
    url: PATH.EXPLORE,
    icon: Search,
    title: 'Explore'
  },
  {
    url: PATH.PROFILE,
    icon: UserRound,
    title: 'Profile'
  },
  {
    url: PATH.BOOKMARK,
    icon: Bookmark,
    title: 'Bookmarks'
  }
] as const
