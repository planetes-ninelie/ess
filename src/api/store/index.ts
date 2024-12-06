//统一管理项目用户相关的接口

import request from '@/utils/request'
import type {
  loginFormData,
  loginResponseData,
  record,
  toAssignData,
  usersListDto,
} from './type'

//项目用户相关的请求地址
enum API {
  //用户登录url
  LOGIN_URL = '',
  //获取用户表单数据url
  USERSDATA_URL = '/users/list',
  //新增用户数据url
  ADDUSERDATA_URL = '/user/register',
  //更新用户数据url
  UPDATEUSERDATA_URL = '/common/edit/info',
  //用户分配角色url
  TOASSIGN_URL = '/users/edit/roles',
  //根据id删除用户数据url
  DELETEBYID_URL = '/common/delete/',
}

//登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

//获取用户表单数据接口
export const reqUsersData = (dto: usersListDto) =>
  request.post<any, any>(API.USERSDATA_URL, dto)

//新增用户数据接口与更新用户数据接口
export const reqAddOrUpdateUserData = (data: record) => {
  if (data.phone !== null || data.phone !== '')
    return request.put<any, any>(API.UPDATEUSERDATA_URL, data)
  else return request.post<any, any>(API.ADDUSERDATA_URL, data)
}

//用户分配角色接口
export const reqToAssign = (data: toAssignData) =>
  request.post<any, any>(API.TOASSIGN_URL, data)

//根据id删除用户信息接口
export const reqDeleteById = (id: number | string) =>
  request.delete<any, any>(API.DELETEBYID_URL + id)
