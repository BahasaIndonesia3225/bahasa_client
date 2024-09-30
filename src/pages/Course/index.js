import { useEffect, useState } from 'react';
import { Row, Col, Flex, Image, Typography, List, theme } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
import { request } from '@umijs/max';
import PlayCourse from '@/pages/Course/playCourse';

let courseList_ = [
  {
    id: 'NmmbLYYl',
    name: '基础课 Pelajaran Dasar',
    coverImage: './image/baseCourse.png',
  },
  {
    id: 'a6RhhcNa',
    name: '进阶课 Pelajaran Lanjut',
    coverImage: './image/advancedCourse.png',
  },
  {
    id: 'wawrthJQ',
    name: '发音课 Pelajaran Pengucapan',
    coverImage: './image/voiceCourse.jpg',
  },
];

export default () => {
  const { token } = theme.useToken();
  const [courseId, setCourseId] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [courseInfo, setCourseInfo] = useState({});

  const queryCourse = () => {
    request('/business/web/course/find/TYAIILon', {
      method: 'GET',
    }).then((res) => {
      const { success, content } = res;
      if (success) {
        let { sections } = content;
        courseList_ = courseList_.map(item => {
          const { id, name, coverImage } = item;
          let list = sections.filter(j => j.chapterId === id);
          list = list.sort((a, b) => a.sort - b.sort);
          return { id, name, coverImage, list }
        })
        setCourseList(courseList_);
        setCourseId(courseList_[0].id);
      }
    });
  };
  useEffect(() => {
    queryCourse();
  }, []);

  return (
    <div
      style={{
        borderRadius: token.borderRadius,
        backgroundColor: token.colorBgContainer,
        padding: token.padding,
        height: '100%'
      }}
    >
      <CheckCard.Group
        size="small"
        value={courseId}
        onChange={(value) => {
          if (value) setCourseId(value);
        }}
      >
        {courseList.map((item) => {
          return (
            <CheckCard
              key={item.id}
              value={item.id}
              cover={<Image src={item.coverImage} preview={false} width={210} height={100} />}
            ></CheckCard>
          );
        })}
      </CheckCard.Group>
      <Row gutter={20}>
        <Col span={8}>
          { courseList.length && (
            <List
              size="small"
              bordered
              header={<div>本节课共有{courseList.filter(j => j.id === courseId)[0].list.length}节</div>}
              footer={<div>学习印尼语，就找东东印尼语</div>}
              pagination={{
                position: 'bottom',
                align: 'end',
                size: 'small',
                showSizeChanger: false
              }}
              dataSource={courseList.filter(j => j.id === courseId)[0].list}
              renderItem={(item) => {
                const {id, title, vod} = item;
                return (
                  <List.Item
                    actions={[<a onClick={() => setCourseInfo({ title, vod })}>观看</a>]}
                  >
                    <Typography.Text>{title}</Typography.Text>
                  </List.Item>
                )
              }}
            />
          )}
        </Col>
        <Col span={16}>
          {courseInfo?.vod && <PlayCourse courseInfo={courseInfo} />}
        </Col>
      </Row>
    </div>
  );
};
