export const truncateStr = (str: string, max_len?: number) => {
  return str.length > (max_len || 40) ? str.slice(0, (max_len || 40) - 1) + '...' : str
}

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)

  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short', // "Jan"
    day: 'numeric',
    year: 'numeric'
  }).format(date)
  return formatted
}
