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

const exportData = (taskId) => {
  console.log('Export data for task:', taskId);
  // Add export logic here
};

const stopCollection = (taskId) => {
  console.log('Stop collection for task:', taskId);
  // Add stop collection logic here
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
        <el-button type="success" size="small" @click="exportData(scope.row.taskId)">导出</el-button>
        <el-button type="danger" size="small" @click="stopCollection(scope.row.taskId)">停收</el-button>
        <el-button size="small" @click="viewDetails(scope.row.taskId)">查看</el-button>
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