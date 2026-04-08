import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'test',
    component: () => import('@/views/test/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];
