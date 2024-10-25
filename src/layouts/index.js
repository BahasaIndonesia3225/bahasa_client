import React from 'react'
import { Image, Watermark } from "antd";
import { useNavigate, useRouteProps, Outlet, connect } from 'umi';
import "./index.less"

const Layout = (props) => {
  const routeProps = useRouteProps()
  const { name } = routeProps;

  return (
    <div className="layout">
      <div className="outletContent">
        <Image className="bgImage" src='./image/img_background.png'/>
        <Outlet />
        { (name && !['Selamat datang 欢迎', "附近的人"].includes(name)) ?
          <WaterMark
            content={props.waterMarkContent}
            gap={[12, 24]}
          /> :
          <></>
        }
      </div>
    </div>
  );
}

export default connect((state) => {
  return {
    waterMarkContent: state.user.waterMarkContent,
  }
})(Layout)
