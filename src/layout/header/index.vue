<template>
  <div class="container">
    <el-icon>
      <Fold />
    </el-icon>
    <h2>{{ setting.title }}</h2>

    <el-dropdown>
      <span class="el-dropdown-link right">
        欢迎：超级管理员
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>修改密码</el-dropdown-item>
          <el-dropdown-item>修改信息</el-dropdown-item>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting';
import { useRouter, useRoute } from 'vue-router'
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
//获取路由器对象
let $router = useRouter()
//获取路由对象
let $route = useRoute()

const logout = async () => {
  await userStore.userLogout()
  $router.push({
    path: '/login',
    query: { redirect: $route.path },
  })
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  color: white;
  font-size: 1.5em;
  font-weight: bold;
}

.right {
  background-color: white;
  color: #6b717f;
  height: 25px;
  line-height: 25px;
  padding: 0 15px;
  border-radius: 12.5px;
}
</style>