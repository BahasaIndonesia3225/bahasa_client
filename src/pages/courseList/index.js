import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, connect } from 'umi';
import { Space, Modal, Radio, List, Image, Empty, Skeleton, Breadcrumb, Watermark } from 'antd'
import { LockFilled, ExclamationCircleFilled, HomeOutlined } from '@ant-design/icons'
import { request } from "@/services";
import './index.less';

const { error, info } = Modal;

const courseList = (props) => {
  const stateParams = useLocation();
  const { id, name, iconArt } = stateParams.state;
  const [loading, setLoading] = useState(false)
  const [courseListData, setCourseListData] = useState([]);
  const [current, setCurrent] = useState(1);

  //观看课程
  const navigate = useNavigate();
  const dumpDetail = ({ id, title, vod, isPass }, index) => {
    if(index === 0) {
      //点击第一节课程
      navigate("/confidentiality", {
        replace: false,
        state: { id, title, vod }
      })
    }else {
      //点击非第一节课程
      if(isPass === 0) {
        //课程未通过
        info({
          title: '您没有观看本课的权限',
          content: '请先通过上节课的题目测试',
          icon: <ExclamationCircleFilled />,
          okText: '我知道了',
        })
      }else {
        //课程已通过
        info({
          title: '我们需要知道您的情况',
          content:
            <Radio.Group defaultValue='2' >
              <Space direction='vertical'>
                <Radio value='1'>
                  <span style={{color: 'blue'}}>我已经认真看完上节课的内容同时做好了笔记，背诵好了所有知识点，做好了学习下节课的准备。</span>
                </Radio>
                <Radio value='2'>
                  <span style={{color: 'red'}}>我没有看过上节课，或者我并没有认真背诵好上节课的单词，但是我仍然希望观看这节课，我愿意承担学到后面越来越学不懂的风险。</span>
                </Radio>
              </Space>
            </Radio.Group>,
          okText: '我知道了',
          onOk: () => {
            navigate("/confidentiality", {
              replace: false,
              state: { id, title, vod }
            })
          },
        })
      }
    }
  }

  const queryCourse = () => {
    setLoading(true)
    request.get('/business/web/course/find/TYAIILon')
      .then(res => {
        const { success, content } = res;
        setLoading(false)
        if(success) {
          let { sections } = content;
          let courseList = sections.filter(j => j.chapterId === id )
          courseList = courseList.sort((a, b) => a.sort - b.sort)
          setCourseListData(courseList);

          props.dispatch({
            type: "user/changeCourseList",
            payload: courseList
          })

        }
      })
  }
  useEffect(() => {
    queryCourse()
  }, [])

  return (
    <Watermark
      content={props.waterMarkContent}
      gap={[100, 100]}>
      <div className="courseList">
        <Image
          rootClassName='top_logo'
          src='./image/login_home.png'
          preview={false}
          width={260}
        />
        <Breadcrumb
          style={{ position: 'absolute', left: 30, top: 80 }}
          routes={[
            { path: '/courseCatalog', breadcrumbName:
                <>
                  <HomeOutlined style={{ fontSize: '20px' }}/>
                  <span style={{ fontSize: '20px' }}>回到课程分类</span>
                </> }
          ]}
        />
        <div className="courseListContainer">
          <div className="chapterAttention">
            <p>{name}</p>
            <div className="courseNum">
              <span>共{courseListData.length}节课程</span>
            </div>
            <div className="imgContian">
              <Image src={iconArt}/>
            </div>
          </div>
          <div className="chapterContain">
            {
              loading ? (
                <Skeleton
                  paragraph={{ rows: 8 }}
                  active
                />
              ) : (
                courseListData.length ? (
                  <List
                    size="small"
                    bordered
                    dataSource={courseListData}
                    current={current}
                    pagination={{
                      pageSize: 20,
                      showSizeChanger: false,
                      showTotal: (total, range) => {
                        return `第${range[0]}-${range[1]}条 / 共${total}条`
                      },
                      onChange: (page, pageSize) => setCurrent(page)
                    }}
                    renderItem={(item, index) => {
                      const {id, title, vod, isPass, questionNum} = item;
                      //判断上一节答题有没有通过，1 通过，0 未通过
                      let isPass_ = 0;
                      if (index > 0) isPass_ = courseListData[index - 1].isPass;
                      return (
                        <List.Item
                          key={vod}
                          onClick={() => dumpDetail({id, title, vod, isPass: isPass_}, index)}
                        >
                          <div className="courseItem">
                            <span>{current === 1 ? index + 1 : (current - 1) * 20 + index + 1}</span>
                            <span>{title.split('】')[1]}</span>
                            {(index > 0 && isPass_ === 0) ? <LockFilled fontSize={20}/> : <></>}
                          </div>
                        </List.Item>
                      )
                    }}
                  />
                ) : <Empty description='暂无数据' style={{marginTop: '50%'}}/>
              )
            }
          </div>
        </div>
      </div>
    </Watermark>
  )
}

export default connect((state) => ({
  waterMarkContent: state.user.waterMarkContent,
}))(courseList)
