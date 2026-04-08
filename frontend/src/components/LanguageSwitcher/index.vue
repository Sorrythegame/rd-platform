<template>
  <a-dropdown>
    <a-button type="text" @click.prevent>
      <template #icon>
        <GlobalOutlined />
      </template>
      {{ currentLanguageLabel }}
    </a-button>
    <template #overlay>
      <a-menu @click="handleLanguageChange">
        <a-menu-item key="zh-CN" :class="{ active: locale === 'zh-CN' }">
          <span>🇨🇳 中文</span>
        </a-menu-item>
        <a-menu-item key="en-US" :class="{ active: locale === 'en-US' }">
          <span>🇺🇸 English</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { GlobalOutlined } from '@ant-design/icons-vue';
import { setLocale, type Language } from '@/i18n';

const { locale } = useI18n();

// 当前语言标签
const currentLanguageLabel = computed(() => {
  return locale.value === 'zh-CN' ? '中文' : 'English';
});

// 语言切换处理
const handleLanguageChange = (info: any) => {
  const newLocale = info.key as Language;
  setLocale(newLocale);
};
</script>

<style scoped>
.active {
  background-color: #e6f7ff;
  color: #1890ff;
}
</style>
