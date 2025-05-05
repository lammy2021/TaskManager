<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElTable, ElTableColumn, ElInput, ElButton, ElMessage, ElPagination, ElTag, ElLoading, ElDialog, ElCard, ElProgress } from 'element-plus';
import axios from 'axios';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

const searchQuery = ref('');
const collections = ref([]);
const currentPage = ref(1);
const pageSize = ref(8);
const totalItems = ref(0);

let loadingInstance = null; // 用于存储加载实例

const fetchTaskList = async () => {
  try {
    loadingInstance = ElLoading.service({
      target: '.el-table', // 指定表格作为加载的目标
      text: '加载中...',
    });
    const response = await axios.get('/api/admin/task/list', {
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt_token')}`
      }
    });
    collections.value = response.data;
    totalItems.value = collections.value.length;
  } catch (error) {
    console.error('Failed to fetch task list:', error);
    ElMessage.error('Failed to fetch task list, please check your network or contact the administrator');
  } finally {
    if (loadingInstance) {
      loadingInstance.close(); // 关闭加载指示器
    }
  }
};

onMounted(() => {
  fetchTaskList();
});

const filteredCollections = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return collections.value
      .filter(data => !searchQuery.value || data.summary.toLowerCase().includes(searchQuery.value.toLowerCase()))
      .map(data => ({
        ...data,
        startTime: data.startTime.replace('T', ' '),
        endTime: data.endTime.replace('T', ' '),
        createdAt: dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        fileFormat: data.fileFormat.split(','),
        status: data.status === 'STOPPED' ? '已停止' : '收集中'
      }))
      .slice(start, end);
});

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

const exportData = async (taskId) => {
  try {
    const response = await axios.get(`/api/admin/task/export?taskid=${taskId}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt_token')}`
      }
    });
    if (response.data.status === 'success') {
      const downloadLink = `/api${response.data.downloadLink}`;
      window.location.href = downloadLink;
    } else {
      ElMessage.error('Failed to export data');
    }
  } catch (error) {
    console.error('Failed to export data:', error);
    ElMessage.error('Failed to export data, please check your network or contact the administrator');
  }
};

const stopCollection = async (taskId) => {
  try {
    const response = await axios.post('/api/admin/task/stopcollect', { taskId }, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt_token')}`
      }
    });
    if (response.data.status === 'success') {
      ElMessage.success('Collection stopped successfully');
      fetchTaskList(); // Refresh the task list
    } else {
      ElMessage.error('Failed to stop collection');
    }
  } catch (error) {
    console.error('Failed to stop collection:', error);
    ElMessage.error('Failed to stop collection, please check your network or contact the administrator');
  }
};

// 任务详情弹窗相关
const taskDetailDialogVisible = ref(false);
const currentTaskDetail = ref(null);
const taskDetailLoading = ref(false);

// 查看任务详情
const viewDetails = async (taskId) => {
  try {
    taskDetailDialogVisible.value = true;
    taskDetailLoading.value = true;
    
    const response = await axios.post('/api/admin/task/status', 
      { taskId },
      {
        headers: {
          'Authorization': `Bearer ${Cookies.get('jwt_token')}`
        }
      }
    );
    
    if (response.data.status === 'success') {
      currentTaskDetail.value = response.data;
    } else {
      ElMessage.error(response.data.message || '获取任务详情失败');
      taskDetailDialogVisible.value = false;
    }
  } catch (error) {
    console.error('获取任务详情失败:', error);
    ElMessage.error('获取任务详情失败，请检查网络连接或联系管理员');
    taskDetailDialogVisible.value = false;
  } finally {
    taskDetailLoading.value = false;
  }
};

// 格式化时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  return dateTimeStr.replace('T', ' ');
};

// 下载文件功能暂时移除
// const downloadFile = (filePath, fileName) => { ... }
</script>

<template>
  <el-input v-model="searchQuery" size="small" placeholder="Type to search" style="margin-bottom: 20px;"></el-input>
  <el-table :data="filteredCollections" border style="width: 100%; margin-top: 20px;">
    <el-table-column prop="taskId" label="任务ID" width="80"></el-table-column>
    <el-table-column prop="startTime" label="开始时间" width="150"></el-table-column>
    <el-table-column prop="endTime" label="结束时间" width="150"></el-table-column>
    <el-table-column prop="summary" label="简要" width="220"></el-table-column>
    <el-table-column label="文件类型" width="150">
      <template #default="scope">
        <el-tag v-for="fileType in scope.row.fileFormat" :key="fileType" type="primary" style="margin-right: 4px;">
          {{ fileType }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100">
      <template #default="scope">
        <el-tag :type="scope.row.status === '已停止' ? 'danger' : 'success'">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="createdAt" label="创建时间" width="150"></el-table-column>
    <el-table-column prop="publisher.username" label="发布者" width="100"></el-table-column>
    <el-table-column align="right" label="操作" width="200" fixed="right">
      <template #default="scope">
        <el-button type="success" plain size="small" @click="exportData(scope.row.taskId)">导出</el-button>
        <el-button type="danger" plain size="small" @click="stopCollection(scope.row.taskId)">停收</el-button>
        <el-button size="small" plain @click="viewDetails(scope.row.taskId)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems"
      style="margin-top: 20px; text-align: right;">
  </el-pagination>

  <!-- 任务详情弹窗 -->
  <el-dialog
    v-model="taskDetailDialogVisible"
    title="任务收集详情"
    width="80%"
    :close-on-click-modal="false"
    v-loading="taskDetailLoading"
  >
    <template v-if="currentTaskDetail">
      <!-- 基本信息 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <div class="task-info">
          <div class="info-item">
            <span class="label">任务ID:</span>
            <span>{{ currentTaskDetail.task.taskId }}</span>
          </div>
          <div class="info-item">
            <span class="label">收集摘要:</span>
            <span>{{ currentTaskDetail.task.summary }}</span>
          </div>
          <div class="info-item">
            <span class="label">开始时间:</span>
            <span>{{ formatDateTime(currentTaskDetail.task.startTime) }}</span>
          </div>
          <div class="info-item">
            <span class="label">结束时间:</span>
            <span>{{ formatDateTime(currentTaskDetail.task.endTime) }}</span>
          </div>
          <div class="info-item">
            <span class="label">文件格式:</span>
            <el-tag v-for="format in currentTaskDetail.task.fileFormat.split(',')" 
                  :key="format" 
                  type="info" 
                  style="margin-right: 5px;">
              {{ format }}
            </el-tag>
          </div>
          <div class="info-item">
            <span class="label">状态:</span>
            <el-tag :type="currentTaskDetail.task.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ currentTaskDetail.task.status === 'ACTIVE' ? '收集中' : '已停止' }}
            </el-tag>
          </div>
          <div class="info-item">
            <span class="label">创建时间:</span>
            <span>{{ formatDateTime(currentTaskDetail.task.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="label">发布者:</span>
            <span>{{ currentTaskDetail.task.publisher.username }}</span>
          </div>
        </div>
      </el-card>
      
      <!-- 收集统计 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>收集统计</span>
          </div>
        </template>
        <div class="stats-container">
          <div class="stats-blocks">
            <div class="stats-block">
              <div class="stats-value">{{ currentTaskDetail.collectionStats.totalUsers }}</div>
              <div class="stats-label">总人数</div>
            </div>
            <div class="stats-block">
              <div class="stats-value">{{ currentTaskDetail.collectionStats.submittedUsers }}</div>
              <div class="stats-label">已提交</div>
            </div>
            <div class="stats-block">
              <div class="stats-value">{{ currentTaskDetail.collectionStats.unsubmittedUsers }}</div>
              <div class="stats-label">未提交</div>
            </div>
          </div>
          <div class="progress-container">
            <el-progress 
              :percentage="currentTaskDetail.collectionStats.submitRate" 
              :format="percent => `${percent}%`"
              :stroke-width="18"
              status="success">
            </el-progress>
            <div class="progress-label">提交率</div>
          </div>
        </div>
      </el-card>
      
      <!-- 已提交名单 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>已提交名单 ({{ currentTaskDetail.submittedList.length }}人)</span>
          </div>
        </template>
        <el-table :data="currentTaskDetail.submittedList" style="width: 100%" max-height="300">
          <el-table-column prop="studentNumber" label="学号" width="120"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="fileName" label="文件名" min-width="200"></el-table-column>
          <el-table-column label="上传时间" width="180">
            <template #default="scope">
              {{ formatDateTime(scope.row.uploadTime) }}
            </template>
          </el-table-column>
          <!-- 操作栏已移除 -->
        </el-table>
      </el-card>
      
      <!-- 未提交名单 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>未提交名单 ({{ currentTaskDetail.unsubmittedList.length }}人)</span>
          </div>
        </template>
        <el-table :data="currentTaskDetail.unsubmittedList" style="width: 100%" max-height="300">
          <el-table-column prop="studentNumber" label="学号" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        </el-table>
      </el-card>
    </template>
  </el-dialog>
</template>

<style scoped>
.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
}

@media (max-width: 768px) {
  .task-info {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  font-weight: 500;
  margin-right: 10px;
  min-width: 80px;
  display: inline-block;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-blocks {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stats-block {
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #f5f7fa;
}

.stats-value {
  font-size: 24px;
  font-weight: 600;
  color: #409EFF;
}

.stats-label {
  margin-top: 5px;
  font-size: 14px;
  color: #606266;
}

.progress-container {
  padding: 10px 20px;
}

.progress-label {
  text-align: center;
  margin-top: 5px;
  color: #606266;
}
</style>