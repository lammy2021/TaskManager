<template>
  <div>
    <div class="card-container">
      <el-card class="card" v-for="(notice, index) in notices" :key="index" :class="{'full-width': notice.title === '将要实现的功能'}">
        <template v-slot:header>
          <div class="card-header">
            <span>{{ notice.title }}</span>
          </div>
        </template>
        <div>{{ notice.content }}</div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const notices = ref([
  { title: '注意事项', content: '请妥善保管你的用户名和密码，如有丢失，请立即找回密码，作为管理员，请认真负责地使用本系统，系统接入了微信公众号推送功能，如果因为管理员泄露Cookie或者将账户借用给他人使用导致法律责任，将由管理员承担。' },
  { title: '添加收集', content: '点击左侧的添加收集，然后填入必要的信息，然后点提交即可，提交之后将以公众号消息推送的方式推送给目标用户。' },
  { title: '收集管理', content: '你可以在收集管理页面进行对已经发布了的收集进行管理的操作，不是发布的收集你没有操作的权限。点击催收后会以微信公众号的形式向为提交的用户发送提交催收信息。点击导出将会打包目前收集到的所有附件为压缩文件导出。' },
  { title: '用户管理和系统管理', content: '在用户管理你可以对已经导入了的账户进行操作，在系统管理可以对系统的基础配置进行修改，如果你不是超级管理员将无法查看到这两个选项卡。' },
  { title: '将要实现的功能', content: '管理员后台适配移动端响应⭐⭐⭐' }

])
</script>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.card {
  min-width: 200px;
}

.full-width {
  grid-column: span 4;
}

.card-header {
  font-weight: bold;
}
</style>