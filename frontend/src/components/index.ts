import type { App } from 'vue';

//引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue';
//全局对象
const allGlobalComponents = { SvgIcon };
//对外暴露插件对象
export default {
  //务必叫做install方法
  install(app: App) {
    //注册项目全部的全局组件
    Object.keys(allGlobalComponents).forEach(key => {
      //注册为全局组件
      app.component(key, allGlobalComponents[key as keyof typeof allGlobalComponents]);
    });
  },
};
