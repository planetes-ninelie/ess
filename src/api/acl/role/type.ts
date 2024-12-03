import { pageData } from '@/api/page'

//单个角色数据
export interface RoleRecord {
  id: number
  createTime?: string
  updateTime?: string
  name?: string
  // remark?: boolean
  description?: string
  deleteStatus: number
}

//获取角色返回的数据
export interface GetRoleResponseData extends pageData<RoleRecord> {}
