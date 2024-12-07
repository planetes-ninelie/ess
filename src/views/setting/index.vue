<template>
  <div>
    <header>
      <div>
        <el-radio-group v-model="type" style="margin-bottom: 20px">
          <el-radio-button value="dish">商品推荐</el-radio-button>
          <el-radio-button value="shop">商家推荐</el-radio-button>
        </el-radio-group>
      </div>
      <el-button type="success" icon="Search" style="margin-left: 15px" @click="search">
        刷新
      </el-button>
    </header>

    <el-dialog v-model="drawerUser" title="修改优先级" width="500" :before-close="cancelUserDrawer" destroy-on-close>
      <template #default>
        <el-form :model="addUserForm" label-width="auto">
          <el-form-item label="推荐类型">
            {{ addUserForm.type == 'dish' ? '商品' : '商家' }}
          </el-form-item>
          <el-form-item label="推荐商家/菜品id">
            {{ addUserForm.targetId }}
          </el-form-item>
          <el-form-item label="推荐商家/菜品名称">
            {{ addUserForm.shopName }} {{ addUserForm.dishName }}
          </el-form-item>
          <el-form-item label="推荐度" prop="displayOrder">
            <el-input v-model="addUserForm.displayOrder" placeholder="请输入推荐度"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelUserDrawer">取消</el-button>
          <el-button type="primary" @click="confirmUserAdd">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 表格数据 -->
    <el-table border :data="usersData" style="margin-bottom: 10px">
      <el-table-column label="推荐类型" align="center" width="150" show-overflow-tooltip>
        <template #="{ row }">
          {{ row.type == 'dish' ? '商品' : '商家' }}
        </template>
      </el-table-column>
      <el-table-column property="targetId" label="商家/菜品id" align="center" width="150" show-overflow-tooltip />
      <el-table-column label="名称" align="center" width="150" show-overflow-tooltip>
        <template #="{ row }">
          {{ row.shopName }} {{ row.dishName }}
        </template>
      </el-table-column>
      <el-table-column property="displayOrder" label="推荐优先级" align="center" width="150" show-overflow-tooltip />
      <el-table-column property="createdBy" label="推荐人" align="center" width="150" show-overflow-tooltip />
      <el-table-column property="shopDescription" label="描述" align="center" width="150" show-overflow-tooltip
        v-if="type == 'shop'" />
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="Edit" @click="editUser(row)" v-has="`btn.User.update`">
            修改推荐优先级
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { ElMessage, ElTable, ElMessageBox } from 'element-plus'
import { Sex, UserRole } from '@/utils/constant'
import type { UsersRow } from './type.ts'
import { getRecommendDish, getRecommendShops, updateRecommendation } from '@/api/setting/index'

//订单数据
let usersData = ref<[]>([])
//控制新增订单或更新订单的抽屉显示与隐藏
let drawerUser = ref<boolean>(false)
//行数据
let rowData = ref<UsersRow>({})
let type = ref<string>('dish')
let addUserForm = reactive({
  type: '',
  targetId: '',
  displayOrder: ''
})
//组件挂载初始化
onMounted(() => {
  getHasUser()
})

watch(
  () => drawerUser.value,
  () => {
    editInit()
  },
)
watch(
  () => type.value,
  () => {
    console.log(type.value);
    getHasUser()
  }
)
let status = ref<string[]>([])
//获取订单数据
const getHasUser = async () => {
  let res = {}
  if (type.value == 'dish') {
    res = await getRecommendDish()
  } else {
    res = await getRecommendShops()
  }
  usersData.value = res.data
}

//搜索订单
const search = async () => getHasUser()

// 添加/编辑按钮
const editUser = (row) => {
  rowData.value = row
  console.log(rowData.value);
  drawerUser.value = true
}

const editInit = () => {
  Object.assign(addUserForm, {
    type: rowData.value.type,
    targetId: rowData.value.targetId,
    shopName: rowData.value.shopName,
    dishName: rowData.value.dishName,
    displayOrder: rowData.value.displayOrder,
    id: rowData.value.id || rowData.value.recommendationId
  })
}

//提交新增或修改的订单信息
const confirmUserAdd = async () => {
  const data = {
    id: addUserForm.id,
    displayOrder: +addUserForm.displayOrder
  }
  let result: any = await updateRecommendation(data)
  if (result.code == 0) {
    ElMessage({
      type: 'success',
      message: `修改成功!`,
    })
    drawerUser.value = false
    getHasUser()
  } else {
    ElMessage({
      type: 'error',
      message:
        result.message ||
        `修改失败!`,
    })
  }
}

const cancelUserDrawer = (done: () => void) => {
  ElMessageBox.confirm('是否关闭当前对话框？').then(() => {
    drawerUser.value = false
  })
}
</script>

<style scoped lang="scss">
header {
  display: flex;
  // align-items: center;
}

.el-form-item__content {
  width: 150px;
  display: inline;
}
</style>