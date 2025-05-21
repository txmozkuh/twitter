export const deleteEmptyObject = (arr: any[]) => {
  return arr.filter((item) => Object.keys(item).length !== 0)
}
