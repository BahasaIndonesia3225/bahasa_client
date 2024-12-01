import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, connect } from 'umi';
import { Image, Modal, Button, message, Card, Flex, Alert, Col, Row } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { request } from '@/services';
import "./index.less"

const { error, info } = Modal;

const courseDetail = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const stateParams = useLocation();
  const { id, title, vod } = stateParams.state;
  const [currentId, setCurrentId] = useState(id);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentVod, setCurrentVod] = useState(vod);
  const [player, setPlayer] = useState(null);

  let navigate = useNavigate();
  const courseList = props.courseList;
  const { questionNum } = courseList.filter(item => item.vod === currentVod)[0];
  const [questionNumber, setQuestionNumber] = useState(questionNum);

  if(player) {
    player.on('ended', function() {
      switchCourse('next')
    })
  }

  const doExercises = () => {
    navigate("/doExercises", {
      replace: false,
      state: {
        id: currentId,
        title: currentTitle,
        vod: currentVod,
        nextTitle: "",
        nextVod: "",
      }
    })
  }
  const switchCourse = async (type) => {
    const index = courseList.findIndex(item => item.vod === currentVod);
    let newId = "";
    let newTitle = "";
    let newVod = "";
    if(type === 'next') {
      //查看下一课程
      if(index === courseList.length - 1) {
        messageApi.open({
          type: 'warning',
          content: '当前课程已是最后一个！',
        });
        return;
      }else {
        const {id, title, vod} = courseList[index + 1];
        const isPass = courseList[index].isPass;
        newId = id;
        newTitle = title;
        newVod = vod;
        if(isPass === 0) {
          error({
            title: '需要通过本节课测试才能进入下一课，你做好准备了吗？',
            icon: <ExclamationCircleFilled />,
            okText: '做好准备了',
            onOk: () => {
              navigate("/doExercises", {
                replace: false,
                state: {
                  id: currentId,
                  title: currentTitle,
                  vod: currentVod,
                  nextId: newId,
                  nextTitle: newTitle,
                  nextVod: newVod,
                }
              })
            },
          })
          return;
        }
      }
    }else {
      //查看上一课程
      if(index === 0) {
        messageApi.open({
          type: 'warning',
          content: '当前课程已是第一个！',
        });
        return;
      }
      newId = courseList[index - 1].id;
      newTitle = courseList[index - 1].title;
      newVod = courseList[index - 1].vod;
    }
    setCurrentId(newId)
    setCurrentTitle(newTitle);
    setCurrentVod(newVod);
  }

  useEffect(() => {
    if(player) {
      request.get('/file/web/get-auth/' + currentVod).then(res => {
        const { success, content } = res;
        player.replayByVidAndPlayAuth(currentVod,content);
      })
    }else {
      request.get('/file/web/get-auth/' + currentVod).then(res => {
        const { success, content } = res;
        if(success) {
          new Aliplayer({
            id: "player-con",
            vid: currentVod,
            playauth: content,
            height: "488px",
            cover: './image/cover.jpg',
            "autoplay": true,
            "isLive": false, //是否为直播播放
            "rePlay": false,
            "playsinline": true,
            "preload": true,
            "language": "zh-cn",
            "controlBarVisibility": "click",
            "showBarTime": 5000,
            "useH5Prism": true,
            "components": [{
              name: 'BulletScreenComponent',
              type: AliPlayerComponent.BulletScreenComponent,
              args: [
                props.waterMarkContent + "，加油学习！",
                {
                  fontSize: '16px',
                  color: 'rgba(136, 0, 174, 0.1)'
                },
                'random'
              ]
            }]
          }, function (player) {
            setPlayer(player);
          });
        }
      })
    }
  }, [ currentVod ])

  return (
    <div className="courseDetail">
      {contextHolder}
      <Image
        rootClassName='top_logo'
        src='./image/login_home.png'
        preview={false}
        width={260}
      />
      <div className="container">
        <Card
          title={currentTitle}
          extra={<a>随堂练习(共{questionNumber}道题目)</a>}
          bordered={true}
          hoverable
          style={{ width: '100%', borderRadius: 27 }}
          styles={{
            body: {
              padding: 20,
              overflow: 'hidden',
            },
          }}
        >
          <Flex justify="space-between">
            <div style={{ width: '650px' }} id="player-con"/>
            <Flex
              vertical
              align="flex-end"
              justify="space-between"
              flex="1"
              style={{
                paddingLeft: 20,
              }}
            >
              <Alert
                style={{ border: 0, borderRadius: 27 }}
                message="温馨提示"
                description={
                  <div className="chapterAttention">
                    <ul>
                      <li>
                        <span>学习过程中请勿开启录屏软件或第三方下载软件，否则您的帐号可能会受到限制。</span>
                      </li>
                      <li>
                        <span>如果您的网络不佳，视频加载可能需要10-20秒，期间若</span>
                        <span style={{color: '#ff0000'}}>出现转圈、黑屏、有声音没画面等情况，</span>
                        <span> 请耐心等待。如果长时问无法加载，请切换网络重新登陆。</span>
                      </li>
                    </ul>
                    <div className="chapterAttentionImg">
                      <Image src='./image/img_intro.png' preview={false}/>
                    </div>
                  </div>
                }
                type="info"
              />
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Image
                    src='./image/prveCourse.png'
                    preview={false}
                    onClick={() => switchCourse('prve')}
                  />
                </Col>
                <Col className="gutter-row" span={8}>
                  <Image
                    src='./image/nextCourse.png'
                    preview={false}
                    onClick={() => switchCourse('next')}
                  />
                </Col>
                <Col className="gutter-row" span={8}>
                  {
                    questionNumber > 0 && (
                      <Image
                        src='./image/doExecuse.png'
                        preview={false}
                        onClick={doExercises}
                      />
                    )
                  }
                </Col>
              </Row>
            </Flex>
          </Flex>
        </Card>
      </div>
    </div>
  )
}

export default connect((state) => {
  return {
    waterMarkContent: state.user.waterMarkContent,
    courseList: state.user.courseList,
  }
})(courseDetail)
