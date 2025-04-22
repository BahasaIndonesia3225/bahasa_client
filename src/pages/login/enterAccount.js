import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, connect } from 'umi';
import { Form, Input, Button, Checkbox, Space, Radio, Image, Table, Modal, Alert, QRCode, Empty } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {setCookie, getCookie, clearCookie} from '@/utils/rememberPassword';
import { request } from '@/services';
import './index.less';

export default (props) => {
  const {username = "", tempPassword = "", isRemember = false} = getCookie();
  const [loading, setLoading] = useState(false);
  const { checkedList } = props;

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
        props.handleInputSuccess(content);
      }
      //登录设备超出限制
      if(code === 'A0100') props.handleDeviceError(content);
      //账号密码错误
      if(code === 'A0004') props.handleInputError();
    })
  }

  return (
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
  )
}
