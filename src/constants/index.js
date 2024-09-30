//随机水印
const generatesRandomNumber = () => {
  let res = '';
  for (let i = 0; i < 12; i++) {
    res += Math.floor(Math.random() * 10);
  }
  return (
    res.slice(0, 3) +
    '.' +
    res.slice(3, 6) +
    '.' +
    res.slice(6, 9) +
    '.' +
    res.slice(9, 12)
  );
};

export const DEFAULT_NAME = generatesRandomNumber();
export const DEFAULT_TOKEN = '';
export const DEFAULT_COURSE_LIST = [];
export const DEFAULT_DEVICE_NUM = 0;
