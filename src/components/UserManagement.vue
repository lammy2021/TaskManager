<script setup>
import { ref, computed } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElInput } from 'element-plus';

const searchQuery = ref('');
const users = ref([
  {
    studentId: '20210001',
    name: '张三',
    isActive: true
  },
  {
    studentId: '20210002',
    name: '李四',
    isActive: false
  },
  // Add more user data here
]);

const filteredUsers = computed(() =>
    users.value.filter(
        (user) =>
            !searchQuery.value ||
            user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

const addUser = () => {
  console.log('Add user');
  // Add user logic here
};

const toggleUserStatus = (user) => {
  user.isActive = !user.isActive;
  console.log('Toggle user status:', user.studentId);
  // Toggle user status logic here
};

const deleteUser = (studentId) => {
  console.log('Delete user:', studentId);
  // Delete user logic here
};
</script>

<template>
  <div>
    <el-button type="primary" plain @click="addUser">添加用户</el-button>
    <el-button type="primary" plain @click="addUserbatch">批量添加用户</el-button>
    <el-table :data="filteredUsers" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="studentId" label="学号" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150"></el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #header>
          <el-input v-model="searchQuery" size="small" placeholder="Type to search"></el-input>
        </template>
        <template #default="scope">
          <el-button :type="scope.row.isActive ? 'danger' : 'success'" plain size="small" @click="toggleUserStatus(scope.row)">
            {{ scope.row.isActive ? '禁用' : '启用' }}
          </el-button>
          <el-button type="danger" size="small" @click="deleteUser(scope.row.studentId)">删除账户</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>