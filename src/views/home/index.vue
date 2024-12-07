<template>
  <div>
    <el-card class="card">
      <div class="right">
        <h1 class="title">{{ getTime() }}好！{{ useUserStore().username }}</h1>
      </div>
    </el-card>
    <h2>订单统计</h2>
    <Statistics></Statistics>
    <h2>推荐菜品</h2>
    <div class="card-menu">
      <div v-for="item in recommendData" :key="item.id" class="item">
        <img src="@/assets/icons/food.svg" alt="item.dishName" />
        <div class="info">
          <span class="name">{{ item.dishName }}</span>
          <span>￥{{ item.dishPrice }}</span>
          <el-button type="primary" icon="Plus" @click="open(item)">购买</el-button>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogTableVisible" title="是否购买" width="500">
      <el-form :model="gridData" label-width="auto">
        <el-form-item label="购买名称">
          <el-input v-model="selectInfo.dishName" disabled></el-input>
        </el-form-item>
        <el-form-item label="购买单价">
          <el-input v-model="selectInfo.dishPrice" disabled></el-input>
        </el-form-item>
        <el-form-item label="购买人id">
          <el-input v-model="gridData.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜品id">
          <el-input v-model="selectInfo.businessId" disabled></el-input>
        </el-form-item>
        <el-form-item label="购买数量">
          <el-input v-model="number"></el-input>
        </el-form-item>
        <el-form-item label="配送地址">
          <el-input v-model="gridData.deliveryAddress"></el-input>
        </el-form-item>
        <el-form-item label="配送费">
          ￥ {{ gridData.deliveryFee }}
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="gridData.remarks"></el-input>
        </el-form-item>
        <el-form-item label="购买总价">
          ￥ {{ totalAmount }}
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
      <div v-for="item in data" :key="item.id" class="item">
        <img src="@/assets/icons/shop.svg" alt="item.dishName" />
        <div class="info">
          <span class="shop">{{ item.shopName }}</span>
          <span class="desc">{{ item.shopDescription }} </span>
          <span class="desc">优先级：{{ item.displayOrder }}</span>
        </div>
      </div>
    </div>
    <!-- <h2>所有菜品</h2>
    <div class="card-menu">
      <div v-for="item in recommendData" :key="item.id" class="item">
        <img src="@/assets/icons/foods.svg" alt="item.dishName" />
        <div class="info">
          <span class="name">{{ item.dishName }}</span>
          <span>￥{{ item.dishPrice }}</span>
          <el-button type="primary" icon="Plus" @click="open(item)">购买</el-button>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue'
//引用设置标题与logo配置文件
import setting from '@/setting'
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
import { onMounted, reactive, ref, watch } from 'vue'
import { record } from '@/api/order/type'
import { reqAddOrUpdateUserData } from '@/api/order/index'
import { ElMessage } from 'element-plus'
import { getRecommendDish, getRecommendShops, updateRecommendation } from '@/api/setting/index'
import { GET_INFO } from '@/utils/token'
import Statistics from '@/views/home/statistics.vue'

const recommendData = ref()
const data = ref()
let gridData = reactive<record>({
  userId: GET_INFO(),
  deliveryAddress: '',
  deliveryFee: 1,
  remarks: ''
})
let number = ref<number>(1)
let totalAmount = ref<number>(0)
watch(
  () => number.value,
  () => {
    totalAmount.value = selectInfo.value.dishPrice * number.value + gridData.deliveryFee
  }
)

let selectInfo = ref({
  dishName: '',
  dishPrice: 0,
  businessId: ''
})
onMounted(() => {
  getDish()
  getShops()
})

let dialogTableVisible = ref(false)
const open = (row) => {
  dialogTableVisible.value = true
  selectInfo.value.dishName = row.dishName
  selectInfo.value.dishPrice = row.dishPrice
  selectInfo.value.businessId = row.dishId
  totalAmount.value = selectInfo.value.dishPrice * number.value + gridData.deliveryFee
}

const buy = async () => {
  const data = {
    userId: gridData.userId,
    businessId: selectInfo.value.businessId,
    totalAmount: totalAmount.value,
    deliveryAddress: gridData.deliveryAddress,
    deliveryFee: gridData.deliveryFee,
    remarks: gridData.remarks
  }
  const res = await reqAddOrUpdateUserData(data)
  if (res.code == 0) {
    ElMessage({
      type: 'success',
      message: `购买${selectInfo.value.dishName}成功!`,
    })
    dialogTableVisible.value = false
  } else {
    ElMessage({
      type: 'error',
      message: `购买${selectInfo.value.dishName}失败!`,
    })
  }
}

const getDish = async () => {
  const res = await getRecommendDish()
  if (res.code == 0) {
    recommendData.value = res.data
  }
}

const getShops = async () => {
  const res = await getRecommendShops()
  if (res.code == 0) {
    data.value = res.data
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

      .shop {
        font-size: 23px;
      }

      .desc {
        font-size: 15px;
        font-weight: 300;
        color: rgb(114, 118, 122);
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
