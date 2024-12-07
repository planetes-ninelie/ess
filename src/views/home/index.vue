<template>
  <div>
    <el-card class="card">
      <div class="right">
        <h1 class="title">{{ getTime() }}好！{{ useUserStore().username }}</h1>
      </div>
    </el-card>
    <h2>推荐菜品</h2>
    <div class="card-menu">
      <div v-for="item in data" :key="item.id" class="item">
        <img src="@/assets/icons/food.svg" alt="item.name" />
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span>￥{{ item.price }}</span>
          <el-button type="primary" icon="Plus" @click="dialogTableVisible = true">购买</el-button>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogTableVisible" title="是否购买" width="500">
      <el-form :model="gridData" rules="" ref="" label-width="auto">
        <el-form-item label="购买人id">
          <el-input v-model="gridData.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="商家id">
          <el-input v-model="gridData.businessId" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="购买总数">
          <el-input v-model="gridData.totalAmount"></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-input v-model="gridData.paymentStatus"></el-input>
        </el-form-item>
        <el-form-item label="配送地址">
          <el-input v-model="gridData.deliveryAddress"></el-input>
        </el-form-item>
        <el-form-item label="配送费">
          <el-input v-model="gridData.deliveryFee" disabled=""></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary" @click="buy">
            确认订单
          </el-button>
        </div>
      </template>
    </el-dialog>
    <h2>推荐商家</h2>
    <div class="card-menu">
      <div v-for="item in data" :key="item.id" class="item" @click="">
        <img src="@/assets/icons/food.svg" alt="" />
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span>￥{{ item.price }}</span>
        </div>
      </div>
    </div>
    <h2>所有菜品</h2>
    <div class="card-menu">
      <div v-for="item in data" :key="item.id" class="item" @click="">
        <img src="@/assets/icons/food.svg" alt="" />
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span>￥{{ item.price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue'
//引用设置标题与logo配置文件
import setting from '@/setting'
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
import { reactive, ref } from 'vue'
import { record } from '@/api/order/type'
import { reqAddOrUpdateUserData } from '@/api/order/index'

const data = [
  { id: 1, name: '好吃的', price: '50.00' },
  { id: 2, name: '好吃的', price: '50.00' },
  { id: 3, name: '好吃的', price: '50.00' },
  { id: 4, name: '好吃的', price: '50.00' },
  { id: 5, name: '好吃的', price: '50.00' },
  { id: 6, name: '好吃的', price: '50.00' },
  { id: 7, name: '好吃的', price: '50.00' },
  { id: 8, name: '好吃的', price: '50.00' },
  { id: 9, name: '好吃的', price: '50.00' },
]
let gridData = reactive<record>({
  userId: '',
  businessId: '',
  totalAmount: '',
  paymentStatus: '',
  deliveryAddress: '',
  deliveryFee: ''
})

let dialogTableVisible = ref(false)

const buy = async () => {
  const res = await reqAddOrUpdateUserData(gridData)
  if (res.code == 0) {
    dialogTableVisible = true
  }

}
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: left;
  margin-bottom: 25px;

  .right {
    padding: 20px;

    .title {
      font-size: 20pt;
      font-weight: bolder;
    }
  }
}

.card-menu {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 200px;
    margin: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .info {
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      text-align: center;

      .name {
        font-size: 25px;
        line-height: 30px;
      }
    }
  }
}

.el-card__body {
  width: 100%;
}

h2 {
  margin: 15px;
  font-size: 25px;
  font-weight: bold;
}
</style>
