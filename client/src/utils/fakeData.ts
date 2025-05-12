interface Post {
  user_avatar: string
  username: string
  name: string
  date: string
  content: string
  images: string[]
}

export const posts: Post[] = [
  {
    user_avatar: 'https://pbs.twimg.com/profile_images/1669981396872613888/hBV28eu2_400x400.jpg',
    username: 'nambitdefi',
    name: 'Nambit.zk| Builder Berachain/zkSync| Buy/sell USDT',
    date: 'Apr 28',
    content: 'TCBS đã đấu giá coin vào bảng điện.\nThời tiền ảo chứng khoán về 1 nhà đây r\n \nNguồn: HC Capita',
    images: [
      'https://pbs.twimg.com/media/GpnRQk_b0AANmrw?format=jpg&name=large',
      'https://pbs.twimg.com/media/GprJe5IbEAceTtR?format=jpg&name=medium'
    ]
  },
  {
    user_avatar: 'https://pbs.twimg.com/profile_images/1637449423600111617/0nIYO0TD_400x400.jpg',
    username: 'LeonNg2023',
    name: 'Leon Crypto',
    date: 'Apr 28',

    content: 'Ủng hộ thì tương tác post này, sau đó mình sẽ chia sẻ vài hidden gem ',
    images: [
      'https://pbs.twimg.com/media/Gpq_pWcbYAAiSki?format=png&name=900x900',
      'https://pbs.twimg.com/media/GevyKapbsAAWou4?format=png&name=medium',
      'https://pbs.twimg.com/media/Gevyl3DbAAAHE6F?format=png&name=medium'
    ]
  },
  {
    user_avatar: 'https://pbs.twimg.com/profile_images/1560222855282847744/W13s8ZER_400x400.jpg',
    username: 'LuckyStudent02',
    name: 'LuckyStudent02',
    date: 'Apr 28',
    content: 'AI Agent to the moon',
    images: ['https://pbs.twimg.com/media/GprCUx1acAA5tHj?format=jpg&name=large']
  },
  {
    user_avatar: 'https://pbs.twimg.com/profile_images/1637449423600111617/0nIYO0TD_400x400.jpg',
    username: 'LeonNg2023',
    name: 'Leon Crypto',
    date: 'Apr 28',

    content: 'Ủng hộ thì tương tác post này, sau đó mình sẽ chia sẻ vài hidden gem ',
    images: [
      'https://pbs.twimg.com/media/Gpq_pWcbYAAiSki?format=png&name=900x900',
      'https://pbs.twimg.com/media/GevyKapbsAAWou4?format=png&name=medium',
      'https://pbs.twimg.com/media/Gevyl3DbAAAHE6F?format=png&name=medium',
      'https://pbs.twimg.com/media/GprCUx1acAA5tHj?format=jpg&name=large'
    ]
  },
  {
    user_avatar: 'https://pbs.twimg.com/profile_images/1637449423600111617/0nIYO0TD_400x400.jpg',
    username: 'LeonNg2023',
    name: 'Leon Crypto',
    date: 'Apr 28',
    content: 'Ủng hộ thì tương tác post này, sau đó mình sẽ chia sẻ vài hidden gem ',
    images: [
      'https://pbs.twimg.com/media/Gpq_pWcbYAAiSki?format=png&name=900x900',
      'https://pbs.twimg.com/media/GevyKapbsAAWou4?format=png&name=medium',
      'https://pbs.twimg.com/media/Gevyl3DbAAAHE6F?format=png&name=medium',
      'https://pbs.twimg.com/media/GprCUx1acAA5tHj?format=jpg&name=large',
      'https://pbs.twimg.com/media/GprCUx1acAA5tHj?format=jpg&name=large',
      'https://pbs.twimg.com/media/GprCUx1acAA5tHj?format=jpg&name=large'
    ]
  }
] as const
