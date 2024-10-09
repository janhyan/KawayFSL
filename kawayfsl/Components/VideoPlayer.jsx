import ReactPlayer from "react-player/lazy";

export default function VideoPlayer(props) {
    const accessToken = props.token; // Retrieve your access token
    const path = 'https://d3soyatq5ls79q.cloudfront.net/module-one/C.mp4';
  
    return (
      <ReactPlayer
        width="100%"
        height="100%"
        url={path}
        config={{
          file: {
            forceHLS: true,
            hlsOptions: {
              xhrSetup: function (xhr, url) {
                xhr.open("GET", url, true);
                xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
              },
            },
          },
        }}
        controls
      />
    );

  // return (
  //   <ReactPlayer
  //     url="<https://d3soyatq5ls79q.cloudfront.net/module-one/B.mp4>"
  //     // config={{
  //     //   file: {
  //     //     attributes: {
  //     //       crossOrigin: "anonymous",
  //     //       headers: { Authorization: `Bearer ${props.token}` },
  //     //     },
  //     //   },
  //     // }}
  //     config={{
  //       file: {
  //         hlsOptions: {
  //           forceHLS: true,
  //           debug: false,
  //           xhrSetup: function(xhr, url) {
  //             if (needsAuth(url)) {
  //               xhr.setRequestHeader('Authorization', getToken())
  //             }
  //           },
  //         },
  //       },
  //     }}
  //     //   width="640"
  //     //   height="360"
  //     controls
  //     // url={`https://${props.module}/${props.lesson}`}
  //   />
  // );
}
