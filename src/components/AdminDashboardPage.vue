<template>
  <div class="container">
    <div class="header">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="24" class="header-title">
          <h1>任务收集盒子</h1>
        </el-col>
      </el-row>
    </div>
    <div class="sidebar">
      <ul>
        <li>
          <router-link to="/admin/dashboard" active-class="active">仪表盘</router-link>
        </li>
        <li>
          <router-link to="/admin/add-collection" active-class="active">添加收集</router-link>
        </li>
        <li>
          <router-link to="/admin/collection-management" active-class="active">收集管理</router-link>
        </li>
        <li>
          <router-link to="/admin/user-management" active-class="active">用户管理</router-link>
        </li>
        <li>
          <router-link to="/admin/system-settings" active-class="active">系统设置</router-link>
        </li>
        <!-- 退出登录选项 -->
        <li @click="confirmLogout" class="sidebar-logout">
          退出登录
        </li>
      </ul>
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox, ElRow, ElCol } from 'element-plus';
import router from "@/router/index.js";
import Cookies from 'js-cookie';
import axios from "axios";

const logout = () => {
  Cookies.remove('jwt_token'); // Remove the JWT token from cookies
  delete axios.defaults.headers.common['Authorization']; // Remove the token from axios headers
  router.push({ path: '/login' }); // Redirect to the login page
  window.location.reload(); // Reload the page
};

const confirmLogout = () => {
  ElMessageBox.confirm('你确定要退出登录吗？', '退出登录', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    logout();
  }).catch(() => {
    // User canceled the operation
  });
};
</script>

<style scoped>
@import '../styles/AdminDashboard.css';
</style>
