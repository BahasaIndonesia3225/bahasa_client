import React, { useEffect, useState } from 'react';
import { request } from '@umijs/max';

export default (props) => {
  const { title, vod } = props.courseInfo;
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if(player) {
      request('/file/web/get-auth/' + vod, {method: 'GET'}).then(res => {
        const { success, content } = res;
        player.replayByVidAndPlayAuth(vod,content);
      })
    }else {
      request('/file/web/get-auth/' + vod, {method: 'GET'}).then(res => {
        const { success, content } = res;
        if(success) {
          new Aliplayer({
            id: "player-con",
            vid: vod,
            playauth: content,
            height: "525px",
            // cover: './image/cover.jpg',
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
                "加油学习！",
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
  }, [ vod ])

  return (
    <div>
      <div style={{ height: 525, position: 'relative' }}>
        <div id="player-con" />
      </div>
    </div>
  )
}
