import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, connect } from 'umi';
import { Form, Input, Button, Checkbox, Space, Radio, Image, Table, Modal, Alert, QRCode, Empty } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {setCookie, getCookie, clearCookie} from '@/utils/rememberPassword';
import { request } from '@/services';
import './index.less';

const { error, info } = Modal;
const deviceTypeOption = {
  "1": 'android',
  "2": 'ios',
  "3": 'windows',
  "4": 'h5',
}
const columns = [
  {
    width: 80,
    title: '设备类型',
    dataIndex: 'deviceType',
    key: 'deviceType',
    render: (text) => deviceTypeOption[text] || '未知',
  },
  {
    width: 160,
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
  },
  {
    title: '设备ID',
    dataIndex: 'deviceId',
    key: 'deviceId',
  },
];

const Login = (props) => {
  //默认登录模式，1账号密码登录，2二维码登录
  const [loginMode, setLoginMode] = useState('1');
  //是否同意登录准则
  const [checkedList, setCheckedList] = useState([]);
  //获取cookie中的账号、密码、是否记住密码
  const {username = "", tempPassword = "", isRemember = false} = getCookie();
  //loading状态
  const [loading, setLoading] = useState(false);

  //登陆成功提示模态框
  let navigate = useNavigate();
  const handleInputSuccess = () => {
    navigate("/courseCatalog", { replace: true });
  }
  //登陆失败提示模态框（账户密码错误）
  const handleInputError = () => {
    error({
      title: '用户名或密码错误',
      icon: <ExclamationCircleFilled />,
      content: '如您遗忘用户名或密码，请联系老师',
      okText: '我知道了',
    });
  }
  //登陆失败提示模态框（设备过限）
  const handleDeviceError = async (id) => {
    //查询设备列表、数量
    const deviceNumRes = await request.get('/business/web/member/device-count/' + id);
    const deviceListRes = await request.get('/business/web/member/device-list/' + id);
    const deviceNum = deviceNumRes.content;
    const deviceList = deviceListRes.content;
    props.dispatch({
      type: "user/changeDeviceNum",
      payload: deviceNum
    })
    props.dispatch({
      type: "user/changeDeviceList",
      payload: deviceList
    })
    info({
      width: 700,
      title: '登陆设备已达到上限',
      icon: <ExclamationCircleFilled />,
      content: (
        <Table
          title={() => '请在常用设备登陆或联系老师'}
          bordered
          size='small'
          dataSource={deviceList}
          columns={columns}
          pagination={false}
        />
      ),
      okText: '我知道了',
    });
  }
  //表单信息
  const [form] = Form.useForm()
  const onFinish = () => {
    setLoading(true)
    const values = form.getFieldsValue();
    request.post('/business/web/member/signIn', {
      data: values
    }).then(res => {
      setLoading(false);
      const { code, content } = res;
      //登录成功
      if(code === '00000') {
        //记住密码控制逻辑
        const { mobile, password, autoLogin } = values;
        if(autoLogin === '1') {
          setCookie(mobile, password, 7)
        }else {
          clearCookie()
        }
        //设置token、水印名称
        const { name, token, id } = content;
        props.dispatch({
          type: "user/changeToken",
          payload: token
        })
        props.dispatch({
          type: "user/changeWaterMarkContent",
          payload: name
        })
        handleInputSuccess();
      }
      //登录设备超出限制
      if(code === 'A0100') {
        const { token, id } = content;
        props.dispatch({
          type: "user/changeToken",
          payload: token
        })
        handleDeviceError(id);
      }
      //账号密码错误
      if(code === 'A0004') {
        handleInputError();
      }
    })
  }

  //获取二维码
  const [qrCode, setQrCode] = useState('-');
  const [status, setStatus] = useState('active');
  const latestQrCode = useRef(qrCode);
  useEffect(() => { latestQrCode.current = qrCode }, [qrCode]);
  const getQrCode = async () => {
    const result = await request.get('/business/web/member/getCode');
    const { content } = result;
    setQrCode(content);
  }

  //查询二维码是否生成token
  const getTokenByQrCode = async () => {
    const result = await request.get('/business/web/member/getToken?code=' + latestQrCode.current);
    const { code, content, message, success } = result;
    if(success) {
      setStatus('loading');
      const t1 = setTimeout(() => {
        //登录成功
        if(code === '00000') {
          //设置token、水印名称
          const { name, token, id } = content;
          props.dispatch({
            type: "user/changeToken",
            payload: token
          })
          props.dispatch({
            type: "user/changeWaterMarkContent",
            payload: name
          })
          handleInputSuccess();
        }
        //登录设备超出限制
        if(code === 'A0100') {
          const { token, id } = content;
          props.dispatch({
            type: "user/changeToken",
            payload: token
          })
          handleDeviceError(id);
        }
        //账号密码错误
        if(code === 'A0004') {
          handleInputError();
        }
      }, 3000)
    }
  }

  useEffect(() => {
    getQrCode()
    const t1 = setInterval(getQrCode, 1000 * 60 * 2);
    const t2 = setInterval(getTokenByQrCode, 1000 * 2)
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, [])

  return (
    <div className="login">
      <Image
        rootClassName='top_logo'
        src='./image/login_home.png'
        preview={false}
        width={260}
      />
      <div className="loginContain">
        <Image
          preview={false}
          width={400}
          src='./image/img_login.png'
        />
        <div className="loginBox">
          {
            loginMode === '1' ? (
              <Image
                rootClassName='tabMode'
                preview={false}
                width={64}
                height={64}
                src='./image/qrcode.png'
                onClick={() => setLoginMode('2')}
              />
            ) : (
              <Image
                rootClassName='tabMode'
                preview={false}
                width={64}
                height={64}
                src='./image/accountcode.png'
                onClick={() => setLoginMode('1')}
              />
            )
          }
          <p className="loginHeader">
            <span>登录</span>
            <span>/ Masuk / Entrar / </span>
            <span><i>Login</i></span>
          </p>
          {
            loginMode === '1' ? (
              <Form
                layout='vertical'
                form={form}
                initialValues={{
                  mobile: username,
                  password: tempPassword,
                  autoLogin: isRemember ? "1" : '0',
                }}
                onFinish={onFinish}
              >
                <Form.Item
                  name='mobile'
                  label='用户名'
                  rules={[{required: true, message: '用户名不能为空'}]}>
                  <Input placeholder='请输入用户名'/>
                </Form.Item>
                <Form.Item
                  name='password'
                  label='密码'
                  rules={[{required: true, message: '密码不能为空'}]}>
                  <Input placeholder='请输入密码'/>
                </Form.Item>
                <Form.Item
                  name='autoLogin'
                  label='记住密码：'>
                  <Radio.Group>
                    <Radio value='1'>是</Radio>
                    <Radio value='0'>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item>
                  <Button
                    className='loginBtn'
                    block
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={checkedList.length < 2}>
                    <div className="loginBtnCon">
                      <Space>
                        <Image
                          preview={false}
                          height={80}
                          src='./image/icon_LogIn.png'/>
                        <span>登录系统</span>
                      </Space>
                      <Space direction='vertical' align='start' size={0}>
                        <p>Masuk sistem</p>
                        <p>Entrar no sistema</p>
                        <p><i>User login</i></p>
                      </Space>
                    </div>
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Space direction='vertical' align='center' size={10} style={{ width: '100%' }}>
                <Alert
                  description="请同意下方条款，才能使用二维码登录。"
                  type="info"
                  closable={false}
                />
                <div className='qrCodeBox'>
                  <span
                    style={{ opacity: checkedList.length < 2 ? 1 : 0 }}
                    className='attention'>
                    请选阅读并同意《课程保密协议》
                  </span>
                  <QRCode
                    rootClassName='qrCode'
                    style={{filter: checkedList.length < 2 ? 'blur(10px)' : 'unset'}}
                    value={qrCode}
                    status={status}
                    onRefresh={() => getQrCode()}
                    size={260}
                    bordered
                  />
                </div>
              </Space>
            )
          }
          <Space direction='vertical'>
            <Checkbox.Group
              value={checkedList}
              onChange={val => setCheckedList(val)}>
              <Space direction='vertical'>
                <Checkbox value='one'>我是本帐号持有人</Checkbox>
                <Checkbox value='two'>我同意并遵守《课程保密协议》</Checkbox>
              </Space>
            </Checkbox.Group>
            <Alert
              style={{ border: 0 }}
              description="请您注意，课程仅供您个人使用。若您将账号共享至他人使用，您的账号会在无警告的前提下永久禁用。"
              type="warning"
              showIcon
              closable={false}
            />
          </Space>
        </div>
      </div>
    </div>
  )
}

export default connect((state) => ({}))(Login)
