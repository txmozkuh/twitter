export const truncateStr = (str: string, max_len?: number) => {
  return str.length > (max_len || 40) ? str.slice(0, (max_len || 40) - 1) + '...' : str
}
