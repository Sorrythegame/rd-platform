/**
 * @name  AutoRegistryComponents
 * @description  自动按需引入组件
 */
import Components from 'unplugin-vue-components/vite';
import { VueUseComponentsResolver, AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
// import AntdvResolver from 'antdv-component-resolver';

export const AutoRegistryComponents = () => {
  return Components({
    dirs: ['src/components'],
    extensions: ['vue'],
    deep: true,
    dts: 'types/components.d.ts',
    directoryAsNamespace: false,
    globalNamespaces: [],
    directives: true,
    importPathTransform: v => v,
    allowOverrides: false,
    include: [/\.vue$/, /\.vue\?vue/],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    resolvers: [
      VueUseComponentsResolver(),
      AntDesignVueResolver({
        importStyle: false, // css in js
      }),
    ],
  });
};
