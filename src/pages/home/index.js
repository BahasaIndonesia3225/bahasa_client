import React, { useState, useEffect } from 'react'
import { Space, Divider, Image, Spin, Alert } from 'antd'
import { useNavigate } from 'umi';
import { extend } from "umi-request";
import './index.less';

const request = extend({ timeout: 10000 })

export default () => {
  let navigate = useNavigate();
  const [spinning, setSpinning] = React.useState(true);
  const [appLink, setAppLink] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => { setSpinning(false) }, 500);
    request.get('http://taioassets.oss-cn-beijing.aliyuncs.com/appConfig.json').then(res => {
      const { appLink } = res;
      setAppLink(appLink)
    });
  }, [])

  const dumpLink = (type) => {
    const link = type === "youtube" ? "https://www.youtube.com/channel/UCNz0CuIKBXpizEmn8akC42w" : "https://v.douyin.com/iNNrghAv/ 8@5.com";
    window.open(link, "_blank")
  }

  const downLoadApp = (type) => {
    let url = type === "android" ? appLink : 'https://apps.apple.com/cn/app/bahasadong/id6502833636';
    window.open(url, "_blank")
  }

  return (
    <div className="home">
      <Spin spinning={spinning} fullscreen>加载中...</Spin>
      <Alert
        message={<b style={{color: 'red'}}>东东印尼语从未与任何学习机构合作，任何非东东印尼语官方途径购买的账号均无效。东东印尼语将继续和两地司法部门紧密合作，打击盗版课程。</b>}
        banner
        closable
      />
      <Image
        className="logoCard"
        src='./image/login_home.png'
      />
      <Image src='./image/WechatIMG4809.jpg'/>
      <Image
        style={{marginBottom: 16, marginTop: 16}}
        src='./image/loginBtn.png'
        onClick={() => navigate("/login", { replace: false })}
      />
      <Image
        style={{marginBottom: 60}}
        src='./image/loginProtocol.png'
        onClick={() => window.open("https://taioassets.oss-cn-beijing.aliyuncs.com/Pdfs/%E4%B8%9C%E4%B8%9C%E5%8D%B0%E5%B0%BC%E8%AF%AD%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.pdf", "_blank")}
      />
      <Divider>下载东东印尼语App</Divider>
      <Space className="downLoadBtn" size={8} justify="center" block={true}>
        <Image
          className="androidDownload"
          src='./image/Android.png'
          onClick={() => downLoadApp('android')} />
        <Image
          className="iosDownload"
          src='./image/ios.png'
          onClick={() => downLoadApp('ios')} />
      </Space>
      <div className="bahasaindoFooter">
        <div className="friendLink">
          <span onClick={() => dumpLink('youtube')}>东东印尼语YouTube</span>
          <span onClick={() => dumpLink('tiktok')}>东东印尼语抖音</span>
        </div>
        <p>
          D 2019-2024 PT BahasaDona All rights reserved
        </p>
      </div>
    </div>
  )
}
