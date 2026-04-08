<template>
  <!-- svg:图标外层容器节点,内部需要与use标签结合使用 -->
  <svg :style="{ width, height }" :class="disabled ? 'audio-disable' : ''">
    <!-- xlink:href执行用哪一个图标,属性值务必#icon-图标名字 -->
    <!-- use标签fill属性可以设置图标的颜色 -->
    <use :xlink:href="iconPath" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
//接受父组件传递过来的参数
const props = defineProps({
  //xlink:href属性值前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  //图标所在的目录
  dir: {
    type: String,
    default: '',
  },
  //提供使用的图标名字
  name: {
    type: String,
    required: true,
  },
  //接受父组件传递颜色
  color: {
    type: String,
    default: '',
  },
  //接受父组件传递过来的图标的宽度
  width: {
    type: String,
    default: '16px',
  },
  //接受父组件传递过来的图标的高度
  height: {
    type: String,
    default: '16px',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// 计算图标路径
const iconPath = computed(() => {
  if (props.dir) {
    // 如果指定了目录，使用 #icon-[dir]-[name] 格式
    return `${props.prefix}${props.dir}-${props.name}`;
  } else {
    // 如果没有指定目录，使用 #icon-[name] 格式
    return `${props.prefix}${props.name}`;
  }
});
</script>

<style scoped>
.audio-disable {
  cursor: no-drop !important;
  filter: opacity(0.5) !important;
}
</style>
