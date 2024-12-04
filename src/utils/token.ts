//封装本地存储中存储数据与读取数据的方法

//存储数据
export const SET_TOKEN = (token: string) => {
  sessionStorage.setItem('TOKEN', token)
}

//本地存储获取数据
export const GET_TOKEN = () => {
  return sessionStorage.getItem('TOKEN')
}

//本地存储删除数据的方法
export const REMOVE_TOKEN = () => {
  sessionStorage.removeItem('TOKEN')
}
