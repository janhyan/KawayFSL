import ReactPlayer from "react-player/lazy";
import axios from "axios";
import { useState, useEffect } from "react";

export default function VideoPlayer(props) {
  const [videoUrl, setVideoUrl] = useState(null);
  const accessToken = props.token; // Retrieve your access token

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get("https://d3soyatq5ls79q.cloudfront.net/module-one/H.mp4", {
          headers: { Authorization: `Bearer ${accessToken}` },
          responseType: 'blob',
        });

        const blobUrl = URL.createObjectURL(response.data);
        setVideoUrl(blobUrl); // Set the video URL from the blob
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideo();
  }, [accessToken]);

  return (
    <ReactPlayer
      width="100%"
      height="100%"
      url={videoUrl} // Use the fetched blob URL
      controls
    />
  );
}
