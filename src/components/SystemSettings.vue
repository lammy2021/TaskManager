<script setup>
import { ref, onMounted } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';

const settings = ref({
  weChatPushKey: '',
  appId: ''
});

const loadSettings = async () => {
  // Simulate an API call to fetch existing settings
  const response = await fetch('/api/settings');
  const data = await response.json();
  settings.value = data;
};

const saveSettings = async () => {
  // Simulate an API call to save the updated settings
  const response = await fetch('/api/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings.value)
  });

  if (response.ok) {
    ElMessage.success('Settings updated successfully');
  } else {
    ElMessage.error('Failed to update settings');
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<template>
  <el-form :model="settings" label-width="180px" class="left-aligned-form">
    <el-form-item label="微信消息推送接口KEY">
      <el-input v-model="settings.weChatPushKey"></el-input>
    </el-form-item>
    <el-form-item label="APPID">
      <el-input v-model="settings.appId"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="saveSettings">保存设置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.left-aligned-form {
  max-width: 600px;
  margin: 0;
}
</style>