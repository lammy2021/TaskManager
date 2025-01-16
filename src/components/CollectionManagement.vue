<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElTable, ElTableColumn, ElInput, ElButton, ElMessage, ElPagination, ElTag } from 'element-plus';
import axios from 'axios';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

const searchQuery = ref('');
const collections = ref([]);
const currentPage = ref(1);
const pageSize = ref(8);
const totalItems = ref(0);

const fetchTaskList = async () => {
  try {
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

const viewDetails = (taskId) => {
  console.log('View details for task:', taskId);
  // Add view details logic here
};
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
</template>

<style scoped>
</style>