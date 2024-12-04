import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import type { UserState } from './types/type'
//引入操作本地储存的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入常量路由
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
//引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'
import pinia from '..'
import { ElMessage } from 'element-plus'

//过滤异步路由的方法
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

//创建用户小仓库
const useUserStore = defineStore('User', {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户唯一标识token
      menuRoutes: constantRoute, //仓库储存生成菜单需要数组
      username: '',
      userId: 0,
      buttons: [],
    }
  },
  //异步 | 逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginFormData) {
      // const result: loginResponseData = await reqLogin(data)
      const result = { code: '000000' }
      if (result.code == '000000') {
        // this.token = result.data as string
        // SET_TOKEN(result.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //获取用户信息方法
    async userInfo() {
      //获取用户信息进行存储仓库当中
      // const result: userInfoResponseData = await reqUserInfo()
      const result = { code: '000000' }
      //如果获取用户信息成功，存储一下用户信息
      if (result.code == '000000') {
        // this.username = result.data.username
        // const buttons = result.data.rolePermissions.split(',')
        // this.buttons = buttons
        // this.userId = result.data.id

        const routesTest = [
          'Acl',
          'Product',
          'Users',
          'Project',
          'Requirement',
          'Fault',
          'Task',
          'Statistic',
          'Coordination',
          '',
        ]
        const routesEss = [
          'User',
          'Store',
          'Dish',
          'Order',
          'Setting'
        ]
        const userAsyncRoutes = filterAsyncRoute(
          cloneDeep(asyncRoute),
          // [...(result.data.routes), ...routesTest],
          [...routesEss, ...routesTest]
        )
        // const userAsyncRoutes = [...routesTest]
        this.menuRoutes = [...constantRoute, ...userAsyncRoutes, ...anyRoute]
          ;[...userAsyncRoutes, ...anyRoute].forEach((route: any) => {
            router.addRoute(route)
          })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      // const result: any = await reqLogout()
      const result = { code: '000000' }
      if (result.code == '000000') {
        this.token = ''
        this.username = ''
        this.menuRoutes = []
        this.userId = 0
        REMOVE_TOKEN()
        return 'ok'
      } else {
        ElMessage({
          type: 'error',
          message: result.message,
        })
        REMOVE_TOKEN()
        return result.message
      }
    },
  },
  getters: {},
})

export default useUserStore
