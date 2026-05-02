<template>
  <div style="padding: 50px;">
    <!-- 极简测试页面 -->
    <h1>人事运营管理系统</h1>
    <a-button type="primary" @click="handleClick">测试按钮</a-button>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';

// 按钮点击事件处理
const handleClick = () => {
  message.success('Ant Design Vue 引入成功！');
};
</script>
