import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, connect } from 'umi';
import { Checkbox, Space, Image, Table, Modal, Alert, Breadcrumb } from 'antd';
import { ExclamationCircleFilled, HomeOutlined } from '@ant-design/icons';
import { request } from '@/services';
import ScanCode from './scanCode.js';
import EnterAccount from './enterAccount.js';
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
  const [loginMode, setLoginMode] = useState('2');     //登录模式，1账号密码登录，2二维码登录
  const [checkedList, setCheckedList] = useState([]);  //是否同意登录准则

  //登陆成功提示模态框
  let navigate = useNavigate();
  const handleInputSuccess = async ({ token, name }) => {
    props.dispatch({
      type: "user/changeToken",
      payload: token
    })
    props.dispatch({
      type: "user/changeWaterMarkContent",
      payload: name
    })
    //判断是否开通网页登录权限(1无限制/2只能扫码登录PC/3无法登录)
    const userInfoResponse = await request.get('/business/web/member/getUser');
    const {content: userInfo} = userInfoResponse;
    const {loginType} = userInfo;
    if(loginType === 1) {
      navigate("/courseCatalog", { replace: true });
    }else if(loginType === 2) {
      if(loginMode === '1') Modal.error({ content: '根据国内有关法律要求，请使用东东印尼语App扫码登录，如果您的东东印尼语App没有扫码登录功能，请联系老师，我们将会尽快帮您处理。（老师在线时间早上9:00-晚上7:00）。' });
      if(loginMode === '2') navigate("/courseCatalog", { replace: true });
    }else if(loginType === 3) {
      Modal.error({ content: '请使用东东印尼语App观看。如有疑问，请联系老师，我们将会尽快帮您处理。（老师在线时间早上9:00-晚上7:00）。' });
    }
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
  const handleDeviceError = async ({token, id}) => {
    //设置token
    props.dispatch({
      type: "user/changeToken",
      payload: token
    })
    //设备列表、数量
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

  return (
    <div className="login">
      <Image
        rootClassName='top_logo'
        src='./image/login_home.png'
        preview={false}
        width={260}
      />
      <Breadcrumb
        style={{ position: 'absolute', left: 30, top: 80 }}
        routes={[
          { path: '/home', breadcrumbName:
            <>
              <HomeOutlined style={{ fontSize: '20px' }}/>
              <span style={{ fontSize: '20px' }}>回到主页</span>
            </> }
        ]}
      />
      <div className="loginContain">
        <div className="loginContainInner">
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
              loginMode === '1' ?
                <EnterAccount
                  checkedList={checkedList}
                  handleInputSuccess={handleInputSuccess}
                  handleDeviceError={handleDeviceError}
                  handleInputError={handleInputError}
                /> :
                <ScanCode
                  checkedList={checkedList}
                  handleInputSuccess={handleInputSuccess}
                  handleDeviceError={handleDeviceError}
                  handleInputError={handleInputError}
                />
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
    </div>
  )
}

export default connect((state) => ({}))(Login);
