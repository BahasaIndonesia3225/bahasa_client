import { LoginForm, ProConfigProvider, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { request, useModel, useNavigate } from '@umijs/max';
import { Form, theme } from 'antd';
import {setCookie, getCookie, clearCookie} from '@/utils/rememberPassword';

export default () => {
  let navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { userInfo, setUserInfo } = useModel('userModel');
  const {username = "", tempPassword = "", isRemember = false} = getCookie();

  const handleInputError = () => {

  }

  const handleDeviceError = () => {

  }

  const onFinish = (values) => {
    const data = {
      ...values,
      deviceId: "695006e34e7eb40a277309bc37abed44",
      deviceType: 3
    }
    request('/business/web/member/signIn', { method: 'POST', data, }).then((res) => {
      const { success, content, message } = res;
      if (success) {
        //记住密码相关
        const { mobile, password, autoLogin } = values;
        if(autoLogin) {
          setCookie(mobile, password, 1)
        }else {
          clearCookie()
        }
        //全局保存token
        const { name, token } = content;
        localStorage.setItem('token', token);
        setUserInfo((preUserInfo) => ({ ...preUserInfo, token, waterMarkContent: name }));
        navigate('/course', { replace: true });
      }else {
        if(message === "手机号不存在或密码错误") handleInputError();
        if(message === "登陆设备以达到上限，请联系管理员清除不常用设备") handleDeviceError();
      }
    });
  };

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: token.colorBgContainer, height: '100%' }}>
        <LoginForm
          logo=""
          title="东东印尼语"
          subTitle="学习印尼语，就找东东印尼语"
          initialValues={{
            mobile: username,
            password: tempPassword,
            autoLogin: isRemember,
          }}
          form={form}
          onFinish={onFinish}
        >
          <>
            <ProFormText
              name="mobile"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'用户名 / ID：'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'密码 / Kadi：'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              记住密码
            </ProFormCheckbox>
            <a style={{ float: 'right'}}>
              忘记密码？请联系管理员。
            </a>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};
