//统一管理项目用户相关的接口

import request from '@/utils/request'
import type { loginFormData, loginResponseData, updateAvatar } from './type'

//项目用户相关的请求地址
enum API {
  //用户登录url
  LOGIN_URL = '/common/login',
  //用户个人信息url
  USERINFO_URL = '/common/info',
  //用户退出url
  LOGOUT_URL = '/common/logout',
  //修改用户头像url
  UPDATEAVATAR_URL = '/admin/acl/user/updateAvatar',
}

//登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息
export const reqUserInfo = () => request.get<any, any>(API.USERINFO_URL)
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
//修改用户头像
export const reqUpdateAvatar = (data: updateAvatar) =>
  request.put<any, any>(API.UPDATEAVATAR_URL, data)
