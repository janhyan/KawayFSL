import React from 'react';
import ReactPlayer from 'react-player/lazy';

export default function VideoPlayer() {
  return (
    <ReactPlayer
      url="<https://www.youtube.com/watch?v=ysz5S6PUM-U>"
      width="640"
      height="360"
      controls
    />
  );
}
