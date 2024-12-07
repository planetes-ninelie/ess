<template>
  <el-dialog v-model="props.drawerUser" title="修改状态" width="500" :before-close="cancelUserDrawer" destroy-on-close>
    <template #default>
      <el-form :model="addUserForm" label-width="auto">
        <el-form-item label="订单号" prop="orderId">
          {{ addUserForm.orderId }}
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="addUserForm.orderStatus" placeholder="请输入订单状态" style="width: 240px">
            <el-option v-for="item in props.status" :key="item" :label="item" :value="item"></el-option>
          </el-select>
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
</template>

<script setup lang="ts">
import { reqAddOrUpdateUserData } from '@/api/order/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { record } from '@/api/order/type'
import { GET_INFO } from '@/utils/token'
const props = defineProps({
  drawerUser: {
    type: Boolean,
    require: true,
  },
  isUpdate: {
    type: Boolean,
    require: true,
  },
  rowData: {
    type: Object,
    require: false,
  },
  status: {
    type: Array,
    require: false,
  },
})
const emits = defineEmits<{ (e: string, value: boolean): void }>()

onMounted(() => { })
watch(
  () => props.drawerUser,
  () => {
    editInit()
  },
)
let formRef = ref<any>()
let addUserForm = reactive({
  orderId: '',
  orderStatus: ''
})
//初始化表单
const editInit = () => {
  if (props.isUpdate) {
    Object.assign(addUserForm, {
      orderId: props.rowData.orderId,
      orderStatus: props.rowData.orderStatus,
    })
  }
}

//提交新增或修改的订单信息
const confirmUserAdd = async () => {
  let result: any = await reqAddOrUpdateUserData(addUserForm)
  if (result.code == 0) {
    ElMessage({
      type: 'success',
      message: `${addUserForm.orderId ? '修改' : '添加'}订单${addUserForm.orderId}成功!`,
    })
    emits('update:drawerUser', false)
  } else {
    ElMessage({
      type: 'error',
      message:
        result.message ||
        `${addUserForm.orderId ? '修改' : '添加'}订单${addUserForm.orderId}失败!`,
    })
  }
}

const cancelUserDrawer = (done: () => void) => {
  ElMessageBox.confirm('是否关闭当前对话框？').then(() => {
    emits('update:drawerUser', false)
  })
}
</script>

<style lang="scss" scoped></style>
