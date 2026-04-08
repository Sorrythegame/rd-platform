import type { ProxyOptions } from 'vite';
import { API_BASE_URL, BASE_TARGET_URL } from './constant';
type ProxyTargetList = Record<string, ProxyOptions>;

const init: ProxyTargetList = {
  [API_BASE_URL]: {
    target: BASE_TARGET_URL,
    changeOrigin: true,
  },
};

export default init;
