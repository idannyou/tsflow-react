import React from 'react';

function MainScreen(props) {
  return (
    <div>
      <video
        ref={props.appState.videoRef}
        autoPlay
        playsInline
        muted
        width="224"
        height="224"
      ></video>
    </div>
  );
}

export default MainScreen;
