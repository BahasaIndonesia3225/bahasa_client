import { isMobileOnly, isTablet, isMobile, isDesktop } from 'react-device-detect';

console.log(isMobileOnly, isTablet, isMobile, isDesktop);
if (isMobileOnly) {
  // 手机
  window.location.href = 'http://study.bahasaindo.cn/';
}
