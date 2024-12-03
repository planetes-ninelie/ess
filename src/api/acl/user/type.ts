import { ResponseData, pageData } from '@/api/page'

//获取单个用户的数据
export interface record {
  id: number | string
  idStr?: string
  createTime?: string
  updateTime?: string
  roleName?: string
  role?: number
  roleDescription?: string
  rolePermissions?: string
  username?: string
  password?: string
  name?: string
  phone?: string
  email?: string
  image?: string
  deleteStatus?: number
  status?: number
  rawPassword?: string
}

//获取用户表单数据
export interface UsersData extends pageData<record> {
  // data: {
  //   records: records
  //   total: number
  //   size: number
  //   current: number
  //   orders: []
  //   optimizeCountSql: boolean
  //   countId: null | number
  //   maxLimit: null | number
  //   searchCount: boolean
  //   pages: number
  // }
}

//用户分配角色提交表单数据
export interface toAssignData {
  roleIdList: number[]
  userId: number | string
}

export interface UserData extends ResponseData {
  data: record
}

// 分页查询用户提交的表单
export interface usersListDto {
  username: string
  email: string
  phone: string
  currentPage: number
  pageSize: number
}

export interface usersListForm extends usersListDto {
  role: number
  status: number
  deleteStatus: string
}
