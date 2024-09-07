<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="任务开始时间">
      <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
    </el-form-item>
    <el-form-item label="任务结束时间">
      <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
    </el-form-item>
    <el-form-item label="简要">
      <el-input v-model="form.summary" placeholder="填写任务简要" type="textarea" :rows="5"></el-input>
    </el-form-item>
    <el-form-item label="选择文件类型">
      <el-select v-model="form.fileTypes" multiple placeholder="选择文件类型">
        <el-option v-for="fileType in fileTypeOptions" :key="fileType" :label="fileType" :value="fileType"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="发布者">
      <el-input v-model="form.publisher" disabled></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElDatePicker, ElSelect, ElOption } from 'element-plus';

const form = ref({
  startTime: '',
  endTime: '',
  summary: '',
  fileTypes: [],
  publisher: '当前管理员用户名' // Replace with actual admin username
});

const fileTypeOptions = [
  'docx', 'doc', 'xlsx', 'xls', 'ppt', 'pptx', 'zip', '7z', 'rar',
  'jpg', 'jpeg', 'png', 'mp3', 'mp4', 'wmv', 'wma', 'flac', 'txt'
];

const submitForm = () => {
  console.log('Form submitted:', form.value);
  // Add form submission logic here
};
</script>

<style scoped>
/* Add any custom styles here */
</style>