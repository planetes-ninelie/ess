<template>
  <div>
    <!-- 上部卡片内容 -->
    <header class="header">
      <el-radio-group v-model="userSearchDto.status" class="select-status">
        <el-radio-button :value="item.value" v-for="item in statusOptions" @click="search">
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
      <el-button type="default" icon="Search" style="margin-right: 5px" @click="openSearch" round>
        {{ !searchForm ? '展开搜索' : '收起搜索' }}
      </el-button>
      <el-button type="primary" icon="Refresh" @click="getHasUser">
        刷新
      </el-button>
    </header>

    <el-collapse-transition>
      <el-card class="search-form" v-show="searchForm">
        <el-button type="success" icon="Search" style="margin-right: 15px" @click="search">
          搜索
        </el-button>
        <el-button type="default" icon="Refresh" @click="reset()">
          重置
        </el-button>
        <el-form :inline="false" class="form-top">
          <el-form-item label="用户昵称：">
            <el-input type="text" placeholder="请输入用户昵称" v-model="userSearchDto.username"
              style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input type="text" placeholder="请输入用户邮箱" v-model="userSearchDto.email" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="电话：">
            <el-input type="text" placeholder="请输入用户电话" v-model="userSearchDto.phone" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="所属角色：">
            <el-select v-model="userSearchDto.role" placeholder="请选择用户所属角色" style="width: 240px">
              <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="删除状态：">
            <el-select v-model="userSearchDto.deleteStatus" placeholder="请输入用户状态" style="width: 240px">
              <el-option v-for="item in deleteStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
    </el-collapse-transition>

    <!-- 下部卡片内容 -->
    <el-card>
      <el-button type="primary" icon="Plus" @click="addUser()" v-has="`btn.User.add`">
        添加
      </el-button>
      <el-popconfirm :title="`确定删除所选的用户数据吗？`" @confirm="deleteUsers()" width="250">
        <template #reference>
          <el-button type="warning" icon="Delete" :disabled="!selectUsersId.length" v-has="`btn.User.remove`">
            批量删除
          </el-button>
        </template>
      </el-popconfirm>

      <!-- 新增用户或修改用户抽屉 -->
      <el-drawer v-model="drawerUser" direction="rtl">
        <template #header>
          <h4>{{ isUpdate ? '修改用户' : '添加用户' }}</h4>
        </template>
        <template #default>
          <el-form :model="addUserForm" :rules="rules" ref="formRef">
            <el-form-item label="用户名" prop="username">
              <el-input placeholder="请填写用户名" v-model="addUserForm.username"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="!isUpdate">
              <el-input placeholder="请填写用户密码" v-model="addUserForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="再次输入密码" prop="rawPassword" v-if="!isUpdate">
              <el-input placeholder="请再次填写用户密码" v-model="addUserForm.rawPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email" v-if="isUpdate">
              <el-input type="text" placeholder="请输入用户邮箱" v-model="addUserForm.email"></el-input>
            </el-form-item>
            <el-form-item label="用户电话" prop="phone" v-if="isUpdate">
              <el-input type="text" placeholder="请输入用户电话" v-model="addUserForm.phone"></el-input>
            </el-form-item>
            <!-- <el-form-item label="所属角色" v-if="isUpdate">
              <el-select v-model="addUserForm.role" placeholder="请选择用户所属角色" style="width: 240px">
                <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="账号状态" v-if="isUpdate">
              <el-select v-model="addUserForm.status" placeholder="请选择账号状态" style="width: 240px">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
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
      </el-drawer>

      <!-- 分配角色抽屉 -->
      <el-drawer v-model="drawerRole" direction="rtl">
        <template #header>
          <h4>分配角色</h4>
        </template>
        <template #default>
          <el-form :model="roleForm">
            <el-form-item label="用户姓名">
              <el-input placeholder="请填写用户名字" v-model="roleFormUserData.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="角色列表">
              <el-checkbox v-model="allSelect" size="large" :indeterminate="isIndeterminate"
                @change="handleCheckAllChange" style="width: 100%">
                全选
              </el-checkbox>
              <el-checkbox-group v-model="roleArr" @change="handleCheckedRolesChange">
                <el-checkbox v-for="item in roleForm" :key="item.id" v-model="item.remark" :value="item.roleName"
                  size="large">
                  {{ item.roleName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancelRoleDrawer">取消</el-button>
            <el-button type="primary" @click="confirmRole()">提交</el-button>
          </div>
        </template>
      </el-drawer>

      <!-- 表格数据 -->
      <el-table border :data="usersData" style="width: 100%; margin: 10px 0" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column type="index" align="center" width="75" label="#" />
        <el-table-column property="idStr" align="center" label="id" width="150" show-overflow-tooltip />
        <el-table-column property="username" label="用户名" align="center" width="150" show-overflow-tooltip />
        <el-table-column label="用户头像" align="center" width="120" show-overflow-tooltip>
          <template #="{ row }">
            <el-image style="width: 70px; height: 70px; border-radius: 50%" :src="row?.image || defaultImg"></el-image>
          </template>
        </el-table-column>
        <el-table-column property="roleDescription" label="所属角色" align="center" width="150" show-overflow-tooltip />
        <el-table-column property="phone" label="电话" align="center" width="150" show-overflow-tooltip />
        <el-table-column property="email" label="邮箱" align="center" width="150" show-overflow-tooltip />
        <el-table-column label="账号状态" align="center" width="100" show-overflow-tooltip>
          <template #="{ row }">
            <el-tag :type="row.statusColor" v-if="row.status">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="删除状态" align="center" width="100" show-overflow-tooltip>
          <template #="{ row }">
            <el-tag :type="row.deleteStatusColor" v-if="row.deleteStatus">{{ row.deleteStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="createTime" label="创建时间" align="center" width="180" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="300" fixed="right">
          <template #="{ row }">
            <el-button type="success" size="small" icon="User" @click="setRole(row)" v-has="`btn.User.assgin`">
              分配角色
            </el-button>
            <el-button type="primary" size="small" icon="Edit" @click="editUser(row)" v-has="`btn.User.update`">
              编辑
            </el-button>
            <el-popconfirm :title="`确定删除${row.username}吗？`" @confirm="deleteUser(row)" width="250">
              <template #reference>
                <el-button type="warning" size="small" icon="Delete" v-has="`btn.User.remove`">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="changeSize" @current-change="getHasUser()" :pager-count="9"
        v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]" :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total" :total="total" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue'
import {
  reqAddOrUpdateUserData,
  reqToAssign,
  reqUsersData,
  reqDeleteById,
  reqDeleteByIdArr,
} from '@/api/acl/user/index'
import { UsersData, record, records, usersListDto, usersListForm } from '@/api/acl/user/type'
import { ElMessage, ElTable } from 'element-plus'
import { GetRoleResponseData, RoleRecords } from '@/api/acl/role/type'
import { getRolesData } from '@/api/acl/role/index'
import { UserStatus, UserDeleteStatus } from '@/utils/constant'
import { formatDateTime } from '@/utils/time'
import BigNumber from "bignumber.js";

//当前页数
let pageNo = ref<number>(1)
//每页最大页数
let pageSize = ref<number>(5)
//数据总数
let total = ref<number>(0)
//用户数据
let usersData = ref<records>([])
//搜索用户
let userSearchDto = reactive<usersListForm>({
  username: '',
  email: '',
  phone: '',
  // role: '',
  status: 1,
  deleteStatus: '',
  currentPage: pageNo.value,
  pageSize: pageSize.value
})
// 角色列表
let roleOptions = ref<string[]>([])
// 状态列表
let statusOptions = ref<option[]>([])
type option = {
  label: string,
  value: number
}
let deleteStatusOptions = ref<option[]>([])
//下拉搜索表单开关
let searchForm = ref<boolean>(false)
//控制新增用户或更新用户的抽屉显示与隐藏
let drawerUser = ref<boolean>(false)
//控制抽屉表单是新增用户或更新用户
let isUpdate = ref<boolean>(false)
//新增用户表单数据
let addUserForm = reactive<record>({
  idStr: '',
  username: '',
  password: '',
  rawPassword: ''
})
//获取新增form组件实例
let formRef = ref<any>()
//控制分配角色的抽屉显示与隐藏
let drawerRole = ref<boolean>(false)
//分配角色表单
let roleForm = ref<RoleRecords>([])
//分配角色表单用户表单
let roleFormUserData = reactive<record>({ idStr: '' })
//用户分配到的角色数组
let roleArr = ref()
//分配角色是否为全选
let allSelect = ref(false)
//设置分配角色多选框不确定状态，仅负责样式控制
const isIndeterminate = ref(true)
//用户管理表单多选框选择数据
const multipleSelection = ref<records>([])
//所选的用户id列表
let selectUsersId = ref<number[]>([])
//默认头像
const defaultImg =
  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

//组件挂载初始化
onMounted(() => {
  getHasUser()
  getRoles()
  getStatus()
  getDeleteStatus()
})

//监视所选中用户id列表
watch(
  () => multipleSelection.value,
  () => {
    multipleSelection.value.forEach((item) => {
      selectUsersId.value.push(item.idStr)
    })
  },
)

//获取用户数据
const getHasUser = async () => {
  selectUsersId.value = []
  let result: UsersData = await reqUsersData(userSearchDto)
  if (result.code == "000000") {
    total.value = result.data.total
    usersData.value = getUsersData(result.data.records)
  }
}

//改变当前页数
const changeSize = () => {
  pageNo.value = 1
  getHasUser()
}

//搜索用户
const search = async () => {
  let dto = JSON.parse(JSON.stringify(userSearchDto))
  delete dto.role
  delete dto.status
  delete dto.deleteStatus
  let result: UsersData = await reqUsersData(dto)
  if (result.code == "000000") {
    let records: record[] = result.data.records
    if (userSearchDto.role) {
      records = records.filter(item => item.role == userSearchDto.role)
    }
    if (userSearchDto.status) {
      records = records.filter(item => item.status == userSearchDto.status)
    }
    if (userSearchDto.deleteStatus) {
      records = records.filter(item => item.deleteStatus == userSearchDto.deleteStatus)
    }
    usersData.value = getUsersData(records)
    total.value = result.data.total
  }
}

//获取角色列表
const getRoles = async () => {
  let res: GetRoleResponseData = await getRolesData(1, 9999, '')
  if (res.code == '000000') {
    roleOptions.value = res.data.records.map(record => ({
      label: record.description,
      value: record.id
    }))
    roleOptions.value.push({
      label: '未选择',
      value: ''
    })
  }
}

//获取用户状态
const getStatus = () => {
  for (const [key, value] of Object.entries(UserStatus)) {
    const label = value.split(' ')[0]
    const item = {
      label,
      value: key
    }
    statusOptions.value.push(item)
  }
}
//获取删除状态
const getDeleteStatus = () => {
  for (const [key, value] of Object.entries(UserDeleteStatus)) {
    const label = value.split(' ')[0]
    const item = {
      label,
      value: key
    }
    deleteStatusOptions.value.push(item)
  }
}

//获取表单数据
const getUsersData = (records: record[]) => {
  return records.map((record) => {
    let status = ''
    let statusColor = 'primary'
    let deleteStatus = ''
    let deleteStatusColor = 'primary'
    if (record.status !== null) {
      status = UserStatus[record.status].split(' ')[0]
      statusColor = UserStatus[record.status].split(' ')[1]
    }
    if (record.deleteStatus !== null) {
      deleteStatus = UserDeleteStatus[record.deleteStatus].split(' ')[0]
      deleteStatusColor = UserDeleteStatus[record.deleteStatus].split(' ')[1]
    }
    return {
      ...record,
      status,
      deleteStatus,
      createTime: formatDateTime(record.createTime),
      statusColor,
      deleteStatusColor
    }
  });
}

//下拉搜索开关
const openSearch = () => searchForm.value = !searchForm.value

//重置列表
const reset = () => {
  Object.assign(userSearchDto, {
    username: '',
    email: '',
    phone: '',
    role: '',
    deleteStatus: '',
    currentPage: pageNo.value,
    pageSize: pageSize.value
  })
}

//分配角色按钮
const setRole = async (row: record) => {
  drawerRole.value = true
  roleFormUserData = row
  let result2: GetRoleResponseData = await getRolesData(1, 9999, '')
  if (result2.code == "000000") {
    roleForm.value = result2.data.records
    //获取用户的角色
    roleArr.value = row.roleName?.split(' ')
    const allRoleNum = roleForm.value.length
    const selectRoleNum = roleArr.value.length
    const checkAllSelect =
      allRoleNum === selectRoleNum ||
      selectRoleNum === 0 ||
      (selectRoleNum === 1 && roleArr.value[0] === '')
    if (checkAllSelect) {
      isIndeterminate.value = false
    } else {
      isIndeterminate.value = true
    }
    if (allRoleNum === selectRoleNum) {
      allSelect.value = true
    }
    //标记角色列表中哪些是用户所拥有的角色
    roleForm.value.forEach((item) => {
      item.remark = roleArr.value.includes(item.roleName)
    })
  } else {
    ElMessage({
      type: 'error',
      message: '获取分配角色信息失败！',
    })
  }
}

//关闭分配角色抽屉
const cancelRoleDrawer = () => {
  drawerRole.value = false
}

//控制分配角色全选框
const handleCheckAllChange = (val: boolean) => {
  roleArr.value = val ? roleForm.value?.map((item) => item.roleName) : []
  isIndeterminate.value = false
  return undefined
}

//控制分配角色多选框
const handleCheckedRolesChange = (value: string[]) => {
  const checkedCount = value.length
  allSelect.value = checkedCount === roleForm.value?.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < roleForm.value?.length
  return undefined
}

//提交分配角色信息
const confirmRole = async () => {
  let data = reactive({
    userId: roleFormUserData.idStr,
    roleIdList: [] as number[],
  })
  roleForm.value.forEach((item) => {
    if (roleArr.value.includes(item.roleName)) data.roleIdList.push(item.id)
  })
  let result: any = await reqToAssign(data)

  if (result.code == "000000") {
    ElMessage({
      type: 'success',
      message: `已为${roleFormUserData.name}分配角色`,
    })
    drawerRole.value = false
    changeSize()
  } else {
    ElMessage({
      type: 'error',
      message: `为${roleFormUserData.name}分配角色失败`,
    })
    changeSize()
  }
}

//定义用户表行类型
type usersRow = {
  id: string | number
  idStr: string | number
  username: string
  phone: string
  rawPassword: string
  password: string
  phone: string,
  email: string,
  role: number,
  status: number
}

//编辑用户
const editUser = (row: usersRow) => {
  drawerUser.value = true
  isUpdate.value = true
  Object.assign(addUserForm, {
    // id: row.id,
    id: row.idStr,
    username: row.username,
    password: '',
    rawPassword: '',
    phone: row.phone,
    email: row.email,
    role: row.role,
    status: row.status
  })
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('phone')
  })
}

//删除用户
const deleteUser = async (row: any) => {
  let result: any = await reqDeleteById(row.idStr)
  if (result.code == "000000") {
    ElMessage({
      type: 'success',
      message: `删除用户昵称${row.username}成功!`,
    })
    getHasUser()
  } else {
    ElMessage({
      type: 'error',
      message: `删除用户昵称${row.username}失败!`,
    })
  }
}

//添加用户按钮
const addUser = () => {
  drawerUser.value = true
  isUpdate.value = false
  Object.assign(addUserForm, {
    // id: null,
    idStr: null,
    username: '',
    password: '',
    rawPassword: '',
    phone: '',
  })
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
    formRef.value.clearValidate('phone')
  })
}

//关闭新增用户抽屉
const cancelUserDrawer = () => {
  drawerUser.value = false
}

//提交新增或修改的用户信息
const confirmUserAdd = async () => {
  await formRef.value.validate()
  addUserForm.status = +addUserForm.status
  delete addUserForm.idStr
  let result: any = await reqAddOrUpdateUserData(addUserForm)
  if (result.code == "000000") {
    ElMessage({
      type: 'success',
      message: `${addUserForm.id ? '修改' : '添加'}用户昵称${addUserForm.username}成功!`,
    })
    drawerUser.value = false
    getHasUser()
  } else {
    ElMessage({
      type: 'error',
      message:
        result.message ||
        `${addUserForm.id ? '修改' : '添加'}用户昵称${addUserForm.username}失败!`,
    })
  }
}

//校验用户昵称回调函数
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 1) callBack()
  else callBack(new Error('用户昵称至少为一位'))
}

//校验用户姓名回调函数
const validatorName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) callBack()
  else callBack(new Error('用户姓名至少为两位'))
}

//校验用户密码回调函数
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) callBack()
  else callBack(new Error('用户密码至少为六位'))
}

//校验用户电话回调函数
const validatorPhone = (_rule: any, value: any, callBack: any) => {
  if (!value) callBack()
  const reg = /^1[3-9]\d{9}$/
  if (reg.test(value)) callBack()
  else callBack(new Error('请输入有效的手机号'))
}

//新增用户表单校验
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
  rawPassword: [{ required: true, trigger: 'blur', validator: validatorPassword }]
  // phone: [{ required: true, trigger: 'blur', validator: validatorPhone }],
}

//批量删除用户
const deleteUsers = async () => {
  let result: any = await reqDeleteByIdArr(selectUsersId.value)
  let usernameList: any = multipleSelection.value
    .map((item) => item.username)
    .toString()
  if (result.code == "000000") {
    ElMessage({
      type: 'success',
      message: `删除${usernameList}成功！`,
    })
    getHasUser()
  } else {
    ElMessage({
      type: 'error',
      message: `删除${usernameList}失败！`,
    })
  }
}

//用户列表多选框选项变化
const handleSelectionChange = (val: records) => {
  multipleSelection.value = val
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  .select-status {
    margin-right: 40px;
  }

  .open-search {
    display: inline-block;
    margin-right: 20px;
    padding: 5px 20px;
    border: 1px solid rgb(210, 214, 229);
    border-radius: 20px;
  }
}

.search-form {
  margin-bottom: 10px;

  .form-top {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 10px;
  }
}
</style>
