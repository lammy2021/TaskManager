<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElInput, ElMessage } from 'element-plus';
import axios from 'axios';
import Cookies from 'js-cookie';

const searchQuery = ref('');
const users = ref([]);
const newUser = ref({ studentNumber: '', name: '' });

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/admin/user/list', {
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt_token')}`
      }
    });
    if (response.data.status === 'success') {
      users.value = response.data.users;
    } else {
      ElMessage.error('Failed to fetch user list');
    }
  } catch (error) {
    console.error('Failed to fetch user list:', error);
    ElMessage.error('Failed to fetch user list, please check your network or contact the administrator');
  }
};

onMounted(() => {
  fetchUsers();
});

const filteredUsers = computed(() =>
  users.value.filter(
    (user) =>
      !searchQuery.value ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const addUser = async () => {
  try {
    const response = await axios.post('/api/admin/user/add', newUser.value, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt_token')}`
      }
    });
    if (response.data.status === 'success') {
      ElMessage.success('User added successfully');
      fetchUsers(); // Refresh the user list
      newUser.value = { studentNumber: '', name: '' }; // Clear input fields
    } else {
      ElMessage.error('Failed to add user');
    }
  } catch (error) {
    console.error('Failed to add user:', error);
    ElMessage.error('Failed to add user, please check your network or contact the administrator');
  }
};

const toggleUserStatus = async (user) => {
  const endpoint = user.status === 'ACTIVE' ? '/api/admin/user/ban' : '/api/admin/user/activate';
  try {
    const response = await axios.post(endpoint, { studentNumber: user.studentNumber }, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt_token')}`
      }
    });
    if (response.data.status === 'success') {
      ElMessage.success(`User ${user.status === 'ACTIVE' ? 'banned' : 'activated'} successfully`);
      fetchUsers(); // Refresh the user list
    } else {
      ElMessage.error(`Failed to ${user.status === 'ACTIVE' ? 'ban' : 'activate'} user`);
    }
  } catch (error) {
    console.error(`Failed to ${user.status === 'ACTIVE' ? 'ban' : 'activate'} user:`, error);
    ElMessage.error(`Failed to ${user.status === 'ACTIVE' ? 'ban' : 'activate'} user, please check your network or contact the administrator`);
  }
};

const deleteUser = async (studentNumber) => {
  try {
    const response = await axios.post('/api/admin/user/delete', { studentNumber }, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt_token')}`
      }
    });
    if (response.data.status === 'success') {
      ElMessage.success('User deleted successfully');
      fetchUsers(); // Refresh the user list
    } else {
      ElMessage.error('Failed to delete user');
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    ElMessage.error('Failed to delete user, please check your network or contact the administrator');
  }
};
</script>

<template>
  <div>
    <el-input v-model="newUser.studentNumber" placeholder="学号" style="width: 200px; margin-right: 10px;"></el-input>
    <el-input v-model="newUser.name" placeholder="姓名" style="width: 200px; margin-right: 10px;"></el-input>
    <el-button type="primary" plain @click="addUser">添加用户</el-button>
    <el-table :data="filteredUsers" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="studentNumber" label="学号" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150"></el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #header>
          <el-input v-model="searchQuery" size="small" placeholder="Type to search"></el-input>
        </template>
        <template #default="scope">
          <el-button :type="scope.row.status === 'ACTIVE' ? 'danger' : 'success'" plain size="small" @click="toggleUserStatus(scope.row)">
            {{ scope.row.status === 'ACTIVE' ? '禁用' : '启用' }}
          </el-button>
          <el-button type="danger" plain size="small" @click="deleteUser(scope.row.studentNumber)">删除账户</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>