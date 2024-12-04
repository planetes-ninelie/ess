<template>
  <div>
    <el-card body-class="card">
      <div class="right">
        <h1 class="title">{{ getTime() }}好！{{ useUserStore().username }}</h1>
        <p>{{ setting.title }}</p>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue'
//引用设置标题与logo配置文件
import setting from '@/setting'
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'

</script>

<style lang="scss">
.card {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: left;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      width: 110px;
      height: 110px;
    }
  }

  .right {
    padding: 20px;

    .title {
      font-size: 20pt;
      font-weight: bolder;
      margin-bottom: 15px;
    }
  }
}
</style>
