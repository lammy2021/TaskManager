<template>
  <div>
    <div v-if="loading" class="loading-container">
      <el-loading :fullscreen="true" text="加载数据中..." />
    </div>
    <div v-else>
      <div class="dashboard-stats">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>任务总数</span>
            </div>
          </template>
          <div class="stat-value">{{ taskStats.total }}</div>
        </el-card>
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>收集中任务</span>
            </div>
          </template>
          <div class="stat-value">{{ taskStats.active }}</div>
        </el-card>
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>已结束任务</span>
            </div>
          </template>
          <div class="stat-value">{{ taskStats.stopped }}</div>
        </el-card>
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>今日创建任务</span>
            </div>
          </template>
          <div class="stat-value">{{ taskStats.todayCreated }}</div>
        </el-card>
      </div>

      <div class="chart-container">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>任务状态分布</span>
            </div>
          </template>
          <div class="chart" ref="statusChart"></div>
        </el-card>

        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>文件类型分布</span>
            </div>
          </template>
          <div class="chart" ref="fileTypeChart"></div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElCard, ElLoading } from 'element-plus';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const tasks = ref([]);
const loading = ref(false);
const statusChart = ref(null);
const fileTypeChart = ref(null);
let loadingInstance = null;

const fetchTaskList = async () => {
  loading.value = true;
  loadingInstance = ElLoading.service({
    target: 'body',
    text: '加载中...',
  });
  
  try {
    const response = await axios.get('/api/admin/task/list', {
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt_token')}`
      }
    });
    tasks.value = response.data;
    renderCharts();
  } catch (error) {
    console.error('Failed to fetch task list:', error);
  } finally {
    loading.value = false;
    if (loadingInstance) {
      loadingInstance.close();
    }
  }
};

onMounted(() => {
  fetchTaskList();
});

const taskStats = computed(() => {
  const today = dayjs().format('YYYY-MM-DD');
  return {
    total: tasks.value.length,
    active: tasks.value.filter(task => task.status !== 'STOPPED').length,
    stopped: tasks.value.filter(task => task.status === 'STOPPED').length,
    todayCreated: tasks.value.filter(task => dayjs(task.createdAt).format('YYYY-MM-DD') === today).length
  };
});

const renderCharts = () => {
  setTimeout(() => {
    renderStatusChart();
    renderFileTypeChart();
  }, 0);
};

const renderStatusChart = () => {
  if (!statusChart.value) return;

  const activeCount = tasks.value.filter(task => task.status !== 'STOPPED').length;
  const stoppedCount = tasks.value.filter(task => task.status === 'STOPPED').length;

  const chart = echarts.init(statusChart.value);
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: ['收集中', '已停止']
    },
    series: [
      {
        name: '任务状态',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: activeCount, name: '收集中' },
          { value: stoppedCount, name: '已停止' }
        ]
      }
    ]
  };
  chart.setOption(option);
  window.addEventListener('resize', () => {
    chart.resize();
  });
};

const renderFileTypeChart = () => {
  if (!fileTypeChart.value) return;

  // 统计所有文件类型
  const fileTypesMap = {};
  tasks.value.forEach(task => {
    const fileTypes = task.fileFormat.split(',');
    fileTypes.forEach(type => {
      const cleanType = type.trim();
      fileTypesMap[cleanType] = (fileTypesMap[cleanType] || 0) + 1;
    });
  });

  const fileTypeData = Object.entries(fileTypesMap).map(([name, value]) => ({ name, value }));

  const chart = echarts.init(fileTypeChart.value);
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: fileTypeData.map(item => item.name)
    },
    series: [
      {
        name: '文件类型',
        type: 'pie',
        radius: '50%',
        data: fileTypeData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  chart.setOption(option);
  window.addEventListener('resize', () => {
    chart.resize();
  });
};
</script>

<style scoped>
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.chart-card {
  height: 400px;
}

.chart {
  height: 350px;
}

.card-header {
  font-weight: bold;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
</style>
