<template>
  <div class="admin-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
      <div class="logo-container">
        <h3 class="app-title" v-if="!isCollapsed">任务收集盒子</h3>
        <img src="../images/cloud.png" alt="Logo" class="app-icon" v-else />
      </div>
      
      <el-menu
        :default-active="activeIndex"
        class="sidebar-menu"
        :collapse="isCollapsed"
        :collapse-transition="true"
        router
        @select="handleSelect"
        background-color="#ffffff"
        text-color="#303133"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/admin/add-collection">
          <el-icon><Plus /></el-icon>
          <span>添加收集</span>
        </el-menu-item>
        <el-menu-item index="/admin/collection-management">
          <el-icon><Collection /></el-icon>
          <span>收集管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/user-management">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/system-settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
        <el-menu-item index="logout" @click="confirmLogout">
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </el-menu-item>
      </el-menu>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content" :class="{ 'is-expanded': isCollapsed }">
      <!-- 顶部导航条 -->
      <div class="top-navbar">
        <div class="toggle-sidebar" @click="toggleCollapse">
          <el-icon size="20px"><Fold v-if="!isCollapsed" /><Expand v-else /></el-icon>
        </div>
        <div class="page-title">
          管理控制台
        </div>
        <div class="user-info">
          <span>管理员</span>
        </div>
      </div>
      
      <!-- 路由视图 -->
      <div class="page-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessageBox, ElMenu, ElMenuItem, ElIcon } from 'element-plus';
import { DataBoard, Plus, Collection, User, Setting, SwitchButton, Expand, Fold } from '@element-plus/icons-vue';
import router from "@/router/index.js";
import Cookies from 'js-cookie';
import axios from "axios";

const route = useRoute();
const isCollapsed = ref(false);
const activeIndex = ref('');

onMounted(() => {
  activeIndex.value = route.path;
});

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleSelect = (key) => {
  if (key !== 'logout') {
    activeIndex.value = key;
  }
};

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
