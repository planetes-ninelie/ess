<template>
  <div class="body">
    <el-card>
      <div ref="user" class="user"></div>
      <div ref="shop" class="user"></div>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref, watch, computed } from 'vue';
import { reqUsersData } from '@/api/order/index';

let data = ref([]);
let user = ref<HTMLElement | null>(null);
let userType = ref([]);
let userValue = ref([]);
let userTable = ref([])
// ECharts实例
let userCharts: echarts.ECharts | null = null;

let shop = ref<HTMLElement | null>(null);
let shopType = ref([]);
let shopValue = ref([]);
// ECharts实例
let shopCharts: echarts.ECharts | null = null;

// 获取数据
const getData = async () => {
  const dto = {
    orderStatus: '',
    page: 1,
    pageSize: 999
  };
  const res = await reqUsersData(dto);
  data.value = res.data.list;
};

// 处理用户数据
const userData = () => {
  let ids = [];
  data.value.forEach(item => {
    ids.push(item.userId);
  });
  userType.value = [...new Set(ids)];
  userValue.value = new Array(userType.value.length).fill(0);

  data.value.forEach(item => {
    userValue.value[userType.value.indexOf(item.userId)]++;
  });
  console.log(userType.value.length);
  for (let i = 0; i < userType.value.length; i++) {
    userTable.value.push({
      value: userValue.value[i],
      name: userType.value[i]
    })
  }
  // 更新图表
  updateChart();
};

const shopData = () => {
  let ids = [];
  data.value.forEach(item => {
    ids.push(item.businessId);
  });
  shopType.value = [...new Set(ids)];
  shopValue.value = new Array(shopType.value.length).fill(0);

  data.value.forEach(item => {
    shopValue.value[shopType.value.indexOf(item.businessId)]++;
  });

  // 更新图表
  updateChart();
};

// 初始化ECharts
const initChart = () => {
  if (user.value) {
    userCharts = echarts.init(user.value);
    userCharts.setOption(getChartOptions.value);
    shopCharts = echarts.init(shop.value);
    shopCharts.setOption(getChartOptions1.value);
  }
};

// 获取图表选项
const getChartOptions = computed(() => ({
  title: {
    text: '购买者的订单次数占比',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '购买者id/次数',
      type: 'pie',
      radius: '50%',
      data: userTable.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
  // xAxis: {
  //   type: 'category',
  //   data: userType.value
  // },
  // yAxis: {
  //   type: 'value'
  // },
  // series: [
  //   {
  //     data: userValue.value,
  //     type: 'bar'
  //   }
  // ],
  // title: {
  //   text: '购买者创建订单统计',
  // },
}));
const getChartOptions1 = computed(() => ({
  xAxis: {
    type: 'category',
    data: shopType.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: shopValue.value,
      type: 'bar'
    }
  ],
  title: {
    text: '菜品购买热销榜',
  },
}));

// 更新图表
const updateChart = () => {
  if (userCharts) {
    userCharts.setOption(getChartOptions.value);
    shopCharts.setOption(getChartOptions1.value);
  }
};

// 监听数据变化并更新图表
watch([userType, userValue], () => {
  updateChart();
});

// 生命周期钩子
onMounted(async () => {
  await getData();
  userData();
  shopData();
  initChart();
});
</script>

<style lang="scss" scoped>
.body {
  .user {
    height: 300px;
  }
}
</style>