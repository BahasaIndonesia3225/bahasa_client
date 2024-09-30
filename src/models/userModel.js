// 全局共享数据示例
import {
  DEFAULT_COURSE_LIST,
  DEFAULT_DEVICE_NUM,
  DEFAULT_NAME,
  DEFAULT_TOKEN,
} from '@/constants';
import { useState } from 'react';

const useUser = () => {
  const [userInfo, setUserInfo] = useState({
    token: DEFAULT_TOKEN,
    waterMarkContent: DEFAULT_NAME,
    courseList: DEFAULT_COURSE_LIST,
    deviceContent: DEFAULT_DEVICE_NUM,
  });
  return {
    userInfo,
    setUserInfo,
  };
};

export default useUser;
