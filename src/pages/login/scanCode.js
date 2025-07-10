import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, connect } from 'umi';
import { Form, Input, Button, Checkbox, Space, Radio, Image, Table, Modal, Alert, QRCode, Empty } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { request } from '@/services';
import './index.less';

export default (props) => {
  const { checkedList } = props;

  //获取二维码
  const [qrCode, setQrCode] = useState('-');
  const getQrCode = async () => {
    const { content } = await request.get('/business/web/member/getCode');
    setQrCode(content);
  }

  const latestQrCode = useRef(qrCode);
  useEffect(() => { latestQrCode.current = qrCode }, [qrCode]);

  //查询二维码是否生成token
  const [status, setStatus] = useState('active');
  const getTokenByQrCode = async () => {
    const result = await request.get('/business/web/member/getToken?code=' + latestQrCode.current);
    const { code, content, success } = result;
    if(success) {
      setStatus('loading');
      const t1 = setTimeout(() => {
        if(code === '00000') props.handleInputSuccess(content);  //登录成功
        if(code === 'A0100') props.handleDeviceError(content);   //登录设备超出限制
        if(code === 'A0004') props.handleInputError();           //账号密码错误
      }, 3000)
    }
  }

  useEffect(() => {
    getQrCode()
    const t1 = setInterval(getQrCode, 1000 * 60 * 2);   //每2分钟刷新二维码
    const t2 = setInterval(getTokenByQrCode, 1000 * 2)  //每2秒，查询二维码状态
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, [])

  return (
    <Space direction='vertical' align='center' size={10} style={{ width: '100%' }}>
      <Alert
        description={<div style={{ color: 'red' }}>点击右上角小电脑图标可使用用户名和密码登陆</div>}
        type="info"
        showIcon
        closable={false}
      />
      <div className='qrCodeBox'>
        <div className='attentionTxt' style={{ opacity: checkedList.length < 2 ? 1 : 0 }}>
          <span>请使用东东印尼语App扫码，如果您的东东印尼语App没有扫码登录功能，请联系老师，我们将会尽快帮您处理。</span>
        </div>
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
