import React from 'react';
import { Box, Button, Header, Flex, Input } from '@procore/core-react';

import { loadWebcam } from './webcam';

function MainScreen(props) {
  React.useEffect(() => {
    async function initWebcam() {
      props.appState.webcamRef.current = await loadWebcam(
        props.appState.videoRef.current,
        props.appState.truncatedMobileNetRef.current
      );
    }
    initWebcam();
  }, [
    props.appState.webcamRef,
    props.appState.videoRef,
    props.appState.truncatedMobileNetRef
  ]);
  return (
    <Flex justifyContent="center">
      <Box margin="sm">
        <video
          ref={props.appState.videoRef}
          autoPlay
          playsInline
          muted
          width="224"
          height="224"
        ></video>
      </Box>
    </Flex>
  );
}

export default MainScreen;
