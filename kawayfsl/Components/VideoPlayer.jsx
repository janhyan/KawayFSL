import ReactPlayer from "react-player/lazy";
import axios from "axios";
import { useState, useEffect } from "react";

export default function VideoPlayer(props) {
  const [videoUrl, setVideoUrl] = useState(null);
  const accessToken = props.token; // Retrieve your access token

  let lesson = props.lesson.split(' ').join('+');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`https://d3soyatq5ls79q.cloudfront.net/${props.module}/${lesson}.mp4`, {
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

// HLS STREAMING OPTION
// export default function VideoPlayer(props) {
//   const [accessToken, setAccessToken] = useState(null);
//   const videoUrl = "https://d3soyatq5ls79q.cloudfront.net/1/Countdown_1Day.m3u8"; // HLS URL

//   useEffect(() => {
//     if (props.token) {
//       setAccessToken(props.token); // Wait for token to be set
//     }
//   }, [props.token]);

//   console.log(accessToken);
//   return (
//     accessToken && ( // Only render player if token is available
//       <ReactPlayer
//         url={videoUrl}
//         width="100%"
//         height="100%"
//         controls
//         config={{
//           file: {
//             attributes: {
//               crossOrigin: "anonymous", // Enable CORS
//             },
//             forceHLS: true,
//             hlsOptions: {
//               xhrSetup: function (xhr) {
//                 xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`); // Set authorization header
//               },
//             },
//           },
//         }}
//       />
//     )
//   );
// }

