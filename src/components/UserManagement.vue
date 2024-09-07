<script setup>
import { ref, computed } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElInput, ElTag } from 'element-plus';

const searchQuery = ref('');
const users = ref([
  {
    studentId: '20210001',
    name: '张三',
    isWeChatBound: true,
    weChatPushId: 'wx123456',
    showWeChatId: false,
    isActive: true
  },
  {
    studentId: '20210002',
    name: '李四',
    isWeChatBound: false,
    weChatPushId: '',
    showWeChatId: false,
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

const unbindWeChat = (studentId) => {
  console.log('Unbind WeChat for user:', studentId);
  // Unbind WeChat logic here
};

const toggleWeChatIdVisibility = (user) => {
  user.showWeChatId = !user.showWeChatId;
};

const maskWeChatId = (id) => {
  if (!id) return '';
  const len = id.length;
  return id.substring(0, 2) + '*'.repeat(len - 4) + id.substring(len - 2);
};
</script>

<template>
  <div>
    <el-button type="primary" plain @click="addUser">添加用户</el-button>
    <el-button type="primary" plain @click="addUserbatch">批量添加用户</el-button>
    <el-table :data="filteredUsers" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="studentId" label="学号" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150"></el-table-column>
      <el-table-column prop="isWeChatBound" label="是否已绑定微信" width="150">
        <template #default="scope">
          <el-tag :type="scope.row.isWeChatBound ? 'success' : 'danger'">
            {{ scope.row.isWeChatBound ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="weChatPushId" label="微信推送ID" width="200">
        <template #default="scope">
          <span>
            {{ scope.row.showWeChatId ? scope.row.weChatPushId : maskWeChatId(scope.row.weChatPushId) }}
          </span>
          <el-button v-if="scope.row.isWeChatBound" type="text" @click="toggleWeChatIdVisibility(scope.row)">
            <svg v-if="!scope.row.showWeChatId" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path d="M512 298.666667c-162.133333 0-285.866667 68.266667-375.466667 213.333333 89.6 145.066667 213.333333 213.333333 375.466667 213.333333s285.866667-68.266667 375.466667-213.333333c-89.6-145.066667-213.333333-213.333333-375.466667-213.333333z m0 469.333333c-183.466667 0-328.533333-85.333333-426.666667-256 98.133333-170.666667 243.2-256 426.666667-256s328.533333 85.333333 426.666667 256c-98.133333 170.666667-243.2 256-426.666667 256z m0-170.666667c46.933333 0 85.333333-38.4 85.333333-85.333333s-38.4-85.333333-85.333333-85.333333-85.333333 38.4-85.333333 85.333333 38.4 85.333333 85.333333 85.333333z m0 42.666667c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#444444"></path>
            </svg>
            <svg v-else class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <path d="M332.8 729.6l34.133333-34.133333c42.666667 12.8 93.866667 21.333333 145.066667 21.333333 162.133333 0 285.866667-68.266667 375.466667-213.333333-46.933333-72.533333-102.4-128-166.4-162.133334l29.866666-29.866666c72.533333 42.666667 132.266667 106.666667 183.466667 192-98.133333 170.666667-243.2 256-426.666667 256-59.733333 4.266667-119.466667-8.533333-174.933333-29.866667z m-115.2-64c-51.2-38.4-93.866667-93.866667-132.266667-157.866667 98.133333-170.666667 243.2-256 426.666667-256 38.4 0 76.8 4.266667 110.933333 12.8l-34.133333 34.133334c-25.6-4.266667-46.933333-4.266667-76.8-4.266667-162.133333 0-285.866667 68.266667-375.466667 213.333333 34.133333 51.2 72.533333 93.866667 115.2 128l-34.133333 29.866667z m230.4-46.933333l29.866667-29.866667c8.533333 4.266667 21.333333 4.266667 29.866666 4.266667 46.933333 0 85.333333-38.4 85.333334-85.333334 0-12.8 0-21.333333-4.266667-29.866666l29.866667-29.866667c12.8 17.066667 17.066667 38.4 17.066666 64 0 72.533333-55.466667 128-128 128-17.066667-4.266667-38.4-12.8-59.733333-21.333333zM384 499.2c4.266667-68.266667 55.466667-119.466667 123.733333-123.733333 0 4.266667-123.733333 123.733333-123.733333 123.733333zM733.866667 213.333333l29.866666 29.866667-512 512-34.133333-29.866667L733.866667 213.333333z" fill="#444444"></path>
            </svg>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #header>
          <el-input v-model="searchQuery" size="small" placeholder="Type to search"></el-input>
        </template>
        <template #default="scope">
          <el-button :type="scope.row.isActive ? 'danger' : 'success'" plain size="small" @click="toggleUserStatus(scope.row)">
            {{ scope.row.isActive ? '禁用' : '启用' }}
          </el-button>
          <el-button type="danger" size="small" @click="deleteUser(scope.row.studentId)">删除账户</el-button>
          <el-button plain size="small" @click="unbindWeChat(scope.row.studentId)">解绑微信</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>