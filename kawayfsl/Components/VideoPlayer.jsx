import React from 'react';
import ReactPlayer from 'react-player/lazy';

export default function VideoPlayer(props) {
  return (
    <ReactPlayer
      // url="<https://d3soyatq5ls79q.cloudfront.net/module-one/A.mp4>"
    //   width="640"
    //   height="360"
      controls
      url={`https://${props.module}/${props.lesson}`}
    />
  );
}
