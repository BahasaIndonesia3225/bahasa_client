import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, connect } from 'umi';
import { Radio, Button, Empty, Form, Space, Modal, Image, Row, Col, Card } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { request } from "@/services";
import  "./index.less"

const { error, info } = Modal;

const doExercises = (props) => {
  const stateParams = useLocation();
  const { id, title, nextId, nextTitle, nextVod } = stateParams.state;
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  let navigate = useNavigate();
  const [form] = Form.useForm();
  const submitExercises = () => {
    setLoading(true)
    const values = form.getFieldsValue()
    request.post('/business/web/section/exam/submit', {
      data: {
        sectionId: id,
        answer: values
      }
    })
      .then(res => {
        const {success, content} = res;
        if(success) {
          setLoading(false);
          if(!nextVod) {
            //随堂练习场景
            info({
              title: content ? "恭喜，您已通过本次测验！" : "很遗憾，您未通过本次测试。",
              content: '',
              icon: <ExclamationCircleFilled />,
              okText: '重新出卷',
              cancelText: '返回',
              onOk: () => {
                form.resetFields();
                queryExercises();
              },
              onCancel: () => {
                navigate(-1)
              }
            })
          }else {
            //查看下一节课程
            let txt = content ? "本次测验通过，是否继续观看下一课？" : "很遗憾，您未通过本次测试。为了保证每名同学的学习效果，您的作答需要全对才能解锁下一课。";
            let config = {
              content: txt,
              icon: <ExclamationCircleFilled />,
            };
            if(content) {
              config = {
                ...config,
                okText: '观看',
                onOk: () => {
                  navigate("/courseDetail", {
                    replace: false,
                    state: { id: nextId, title: nextTitle, vod: nextVod }
                  })
                },
              }
            }else {
              config = {
                ...config,
                okText: '重新出卷',
                cancelText: '回到课程',
                onOk: () => {
                  form.resetFields();
                  queryExercises();
                },
                onCancel: () => {

                }
              }
            }
            info(config)
          }
        }
      })
  }

  const queryExercises = () => {
    request.get('/business/web/section/exam/list?sectionId=' + id)
      .then(res => {
        const {success, content} = res;
        if(success) {
          setExercises(content);
          //设置表单默认值
          const initialValues_ = {}
          content.forEach(item => {
            const {id} = item;
            initialValues_[id] = ""
          })
          setInitialValues(initialValues_)
        }
      })
  }

  useEffect(() => {
    queryExercises()
  }, [])

  return (
    <div className="doExercises">
      <Image
        rootClassName='top_logo'
        src='./image/login_home.png'
        preview={false}
        width={260}
      />
      <div className="container">
        <div className="formHeader">
          <span>{title.split("】")[1]}</span>
        </div>
        {
          !exercises.length ? <Empty description='暂无数据' style={{padding: '64px 0'}}/> :
            <Form
              layout='vertical'
              form={form}
              initialValues={initialValues}
              onFinish={submitExercises}
            >
              <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                {
                  exercises.map((item, index) => {
                    let {id, content, questionOptions} = item;
                    //临时去重
                    const ids = [...new Set(questionOptions.map(item => item.id))];
                    questionOptions = ids.map(id => questionOptions.find(item => item.id === id))
                    return (
                      <Card
                        title={index + 1 + ". " + content + "?"}
                        bordered={true}
                        hoverable
                        style={{ width: '100%', borderRadius: 8 }}
                        styles={{
                          body: {
                            padding: 20,
                            overflow: 'hidden',
                          },
                        }}
                      >
                        <Form.Item
                          className="formItem"
                          name={id}
                          key={id}
                          rules={[{required: true, message: '请选择该题目'}]}>
                          <Radio.Group className="radioGroup">
                            <Row gutter={[10, 10]}>
                              {
                                questionOptions.map(item_ => (
                                  <Col className='radioContaon' span={12}>
                                    <Radio value={item_.id}>
                                      {item_.content}
                                    </Radio>
                                  </Col>
                                ))
                              }
                            </Row>
                          </Radio.Group>
                        </Form.Item>
                      </Card>
                    )
                  })
                }
                <Form.Item label={null}>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size='large'>
                    提交
                  </Button>
                </Form.Item>
              </Space>

            </Form>
        }
      </div>
    </div>
  )
}

export default connect((state) => ({}))(doExercises)
