import React from "react";
import Webcam from "react-webcam";

export default function OutputWebcam() {
    const webRef = React.useRef(null);
  
    return (
      <Webcam
        ref={webRef}
        disablePictureInPicture={true}
        height={600}
        width={600}
        mirrored={true}
      />
    );
  };