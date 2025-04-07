<template>
  <div class="system-settings">
    <h2>系统设置</h2>
    <el-form :model="settings" label-width="120px">
      <el-form-item label="设置项1">
        <el-input v-model="settings.setting1"></el-input>
      </el-form-item>
      <el-form-item label="设置项2">
        <el-input v-model="settings.setting2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const settings = ref({
  setting1: '',
  setting2: ''
});

// 保存设置
// eslint-disable-next-line no-unused-vars
const saveSettings = (section) => {
  // 这里处理实际的保存逻辑
  ElMessage({
    message: '设置已保存',
    type: 'success'
  });
};
</script>

<style scoped>
.system-settings {
  padding: 20px;
}

.system-settings h2 {
  margin-bottom: 20px;
}
</style>