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
          <router-link to="/admin_dashboard/overview" active-class="active">总览</router-link>
        </li>
        <li>
          <router-link to="/admin_dashboard/user-management" active-class="active">用户管理</router-link>
        </li>
        <li>
          <router-link to="/admin_dashboard/collection-management" active-class="active">收集管理</router-link>
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
import { ElMessageBox, ElRow, ElCol } from 'element-plus'
import { useStore } from 'vuex'
import router from "@/router/index.js";

const store = useStore()

const logout = () => {
  store.dispatch('logout')
  router.push({ name: 'LoginAdmin' })
  window.location.reload()
}

const confirmLogout = () => {
  ElMessageBox.confirm('你确定要退出登录吗？', '退出登录', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    logout()
  }).catch(() => {
    // 用户取消了操作
  })
}
</script>

<style scoped>
@import '../styles/AdminDashboard.css';
</style>
