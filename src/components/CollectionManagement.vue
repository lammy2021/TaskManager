<script setup>
import { ref, computed } from 'vue';
import { ElTable, ElTableColumn, ElInput, ElButton } from 'element-plus';

const searchQuery = ref('');
const collections = ref([
  {
    taskId: '1',
    startTime: '2024-01-01 08:00',
    endTime: '2024-01-01 17:00',
    summary: '测试任务',
    fileTypes: 'PDF, DOCX',
    submitted: 10,
    notSubmitted: 5,
    publisher: '管理员'
  },
  // Add more collection data here
]);

const filteredCollections = computed(() =>
  collections.value.filter(
    (data) =>
      !searchQuery.value ||
      data.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const remind = (taskId) => {
  console.log('Remind task:', taskId);
  // Add remind logic here
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
  <el-table :data="filteredCollections" border style="width: 100%; margin-top: 20px;">
    <el-table-column prop="taskId" label="任务ID" width="80"></el-table-column>
    <el-table-column prop="startTime" label="开始时间" width="150"></el-table-column>
    <el-table-column prop="endTime" label="结束时间" width="150"></el-table-column>
    <el-table-column prop="summary" label="简要" width="200"></el-table-column>
    <el-table-column prop="fileTypes" label="文件类型" width="150"></el-table-column>
    <el-table-column prop="submitted" label="已提交" width="80"></el-table-column>
    <el-table-column prop="notSubmitted" label="未提交" width="80"></el-table-column>
    <el-table-column prop="publisher" label="发布者" width="100"></el-table-column>
    <el-table-column align="right" label="操作" width="300" fixed="right">
      <template #header>
        <el-input v-model="searchQuery" size="small" placeholder="Type to search"></el-input>
      </template>
      <template #default="scope">
        <el-button type="primary" size="small" @click="remind(scope.row.taskId)">催收</el-button>
        <el-button type="success" size="small" @click="exportData(scope.row.taskId)">导出</el-button>
        <el-button type="danger" size="small" @click="stopCollection(scope.row.taskId)">停收</el-button>
        <el-button size="small" @click="viewDetails(scope.row.taskId)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
</style>