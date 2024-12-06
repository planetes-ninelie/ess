<template>
  <div>
    <!-- 搜索框 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="分类名称">
        <el-input v-model="categoryName" placeholder="分类名称" clearable />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getCategoryPage()">搜索</el-button>
        <el-button @click="toAdd">添加分类</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <!-- table表格 -->
    <el-table :data="categoryList" stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="categoryName" label="分类名称" />

      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="toEdit(scope.row)">
            修改
          </el-button>
          <el-button size="small" type="danger" @click="del(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-divider />

    <!-- 分页组件 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[2, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新增/修改对话框 -->
    <el-dialog v-model="dialogFormVisible" :title="title" width="500">
      <el-form :model="category">
        <el-form-item label="分类名称">
          <el-input v-model="category.categoryName" autocomplete="off" />
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOrEditCategory">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import categoryAPI from '@/api/category.js'
import { ElMessage } from 'element-plus'
export default {
  data() {
    return {
      categoryName: "",
      categoryList: [],
      currentPage: 1,
      pageSize: 2,
      total: 0,
      category: {},
      title: '新增分类',
      dialogFormVisible: false,
      businessId: ''
    }
  },
  methods: {
    del(row) {
      ElMessageBox.confirm(
        '您确定要删除该分类吗?',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          // 发起异步请求，删除分类
          categoryAPI.deleteCategory(row.categoryId).then(res => {
            ElMessage.success(res.msg);
            // 重新查询
            this.getCategoryPage();
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消改变删除分类的操作',
          })
        })
    },

    toEdit(row) {
      // 修改标题
      this.title = '修改分类';
      this.dialogFormVisible = true;
      // 深拷贝,实现数据回显
      this.category = JSON.parse(JSON.stringify(row));
    },
    toAdd() {
      // 修改标题
      this.title = '新增分类';
      this.dialogFormVisible = true;
      // 清除数据
      this.category = {}
    },
    // 新增或修改菜品分类信息
    saveOrEditCategory() {
      if (this.title == '新增分类') {
        // 新增员工
        this.category.businessId = this.businessId;
        categoryAPI.addCategory(this.category).then(res => {
          ElMessage.success(res.msg);
          // 关闭对话框
          this.dialogFormVisible = false;
          // 重新查询
          this.getCategoryPage();
        })
      } else {
        // 修改员工
        categoryAPI.updateCategory(this.category).then(res => {

          ElMessage.success(res.msg);
          // 关闭对话框
          this.dialogFormVisible = false;
          // 重新查询
          this.getCategoryPage();

        })
      }


    },
    handleSizeChange(val) {
      this.pageSize = val;
      //重新发起分页查询
      this.getCategoryPage();
    },
    handleCurrentChange(val) {
      this.page = val;
      //重新发起分页查询
      this.getCategoryPage();
    },
    getCategoryPage() {
      // 分页带条件查询
      const data = {
        page: this.currentPage,
        pageSize: this.pageSize,
        categoryName: this.categoryName,
        businessId: this.businessId
      };
      // qs.Stringify(data)  转成  page=1&pageSize=5&account=&nickname=&telephone=
      categoryAPI.getCategoryList(data).then(res => {
        // res 等价于后台返回的result={code,data,msg}

        this.categoryList = res.data.list;
        this.total = res.data.total;

      })
    }

  },
  created() {
    // todo 商家登陆后,赋值商家id
    this.businessId = 10001;
    // 调用分页带条件查询方法
    this.getCategoryPage();
  }
}
</script>

<style scoped></style>