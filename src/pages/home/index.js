import React from 'react'
import { Space, Image } from 'antd'
import { useNavigate } from 'umi';
import './index.less';

export default () => {
  let navigate = useNavigate();

  const dumpLink = (type) => {
    const link = type === "youtube" ? "https://www.youtube.com/channel/UCNz0CuIKBXpizEmn8akC42w" : "https://v.douyin.com/iNNrghAv/ 8@5.com";
    window.open(link, "_blank")
  }

  return (
    <div className="home">
      <div className="homeContainer">
        <Image
          src='./image/login_home.png'
          preview={false}
          width={300}
          style={{ marginBottom: 40 }}
        />
        <Space direction='vertical' align='center' size={10}>
          <Image
            src='./image/loginBtn.png'
            preview={false}
            height={60}
            onClick={() => navigate("/login", { replace: false })}
          />
          <Image
            src='./image/loginProtocol.png'
            height={60}
            preview={false}
            onClick={() => window.open("https://taioassets.oss-cn-beijing.aliyuncs.com/Pdfs/%E4%B8%9C%E4%B8%9C%E5%8D%B0%E5%B0%BC%E8%AF%AD%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.pdf", "_blank")}
          />
        </Space>
      </div>
      <div
        className="bahasaindoLink"
        onClick={() => window.open("http://bahasaindo.cn/", "_blank", 'width=375,height=667')}>
        <div className="icon">
          <Image
            src="./image/icon_card.png"
            preview={false}
          />
        </div>
        <span>单词卡</span>
      </div>
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
