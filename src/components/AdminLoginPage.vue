<template>
  <div class="login-page">
    <h1>管理员登录</h1>
    <form @submit.prevent="submitForm">
      <label for="username">用户名:</label>
      <el-input id="username" v-model="username" required></el-input>
      <label for="password">密码:</label>
      <el-input id="password" type="password" v-model="password" required></el-input>
      <el-button type="primary" plain native-type="submit">登录</el-button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';

const router = useRouter();
const username = ref('');
const password = ref('');

const submitForm = async () => {
  try {
    const loginData = {
      username: username.value,
      password: password.value,
    };

    const response = await axios.post('/api/admin/login', loginData);

    if (response.status === 200 && response.data.status === 'succeed') {
      const token = response.data.token;
      Cookies.set('jwt_token', token, { expires: 1 }); // Set cookie to expire in 1 day
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      ElMessage.success('登录成功');
      await router.push({ path: '/admin/dashboard' });
    } else {
      ElMessage.error('登录失败');
    }
  } catch (error) {
    console.error('登录请求失败:', error);
    ElMessage.error('登录请求失败，请检查网络或联系管理员');
  }
};
</script>

<style scoped>
@import '../styles/AdminLoginPage.css';
</style>