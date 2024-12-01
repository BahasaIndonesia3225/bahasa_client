import React from 'react'
import { Image, Watermark, ConfigProvider } from "antd";
import { useNavigate, useRouteProps, Outlet, connect } from 'umi';
import zhCN from 'antd/locale/zh_CN';
import "./index.less"

const theme= {
  components: {
    Alert: {
      withDescriptionPadding: [10, 12]
    },
  },
}

const Layout = (props) => {
  const routeProps = useRouteProps()
  const { name } = routeProps;

  return (
    <div className="layout">
      <ConfigProvider  locale={zhCN} theme={theme}>
        <Outlet/>
      </ConfigProvider>
    </div>
  );
}

export default connect((state) => {
  return { waterMarkContent: state.user.waterMarkContent }
})(Layout)
