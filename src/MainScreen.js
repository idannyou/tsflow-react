import React from 'react';
import {
  Box,
  Button,
  Card,
  Font,
  Header,
  Flex,
  FlexList
} from '@procore/core-react';

import { draw, loadWebcam, getImage } from './webcam';

function useLongPress(callback = () => {}, ms = 100) {
  const [startLongPress, setStartLongPress] = React.useState(false);

  React.useEffect(() => {
    let timerId;
    if (startLongPress) {
      timerId = setTimeout(callback, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongPress, ms, callback]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false)
  };
}

function Controls(props) {
  const handleLongPressOne = useLongPress(async () => {
    let img = await getImage(props.appState.webcamRef.current);
    draw(img, props.appState.classOneCanvasRef.current);
    props.appState.setClassOneSamples(props.appState.classOneSamples + 1);
    img.dispose();
  });

  const handleLongPressTwo = useLongPress(async () => {
    let img = await getImage(props.appState.webcamRef.current);
    draw(img, props.appState.classTwoCanvasRef.current);
    props.appState.setClassTwoSamples(props.appState.classTwoSamples + 1);
    img.dispose();
  });

  return (
    <Box margin="md">
      <Box margin="md">
        <FlexList size="lg" justifyContent="center">
          <Button> Train</Button>
          <Button> Predict</Button>
        </FlexList>
      </Box>
      <FlexList size="lg">
        <Flex direction="column" alignItems="center">
          <Header.H3>{props.appState.classOne}</Header.H3>
          <Button {...handleLongPressOne}>Add Sample</Button>
        </Flex>
        <Flex direction="column" alignItems="center">
          <Header.H3>{props.appState.classTwo}</Header.H3>
          <Button {...handleLongPressTwo}>Add Sample</Button>
        </Flex>
      </FlexList>
    </Box>
  );
}

function SampleCanvas(props) {
  return (
    <FlexList>
      <Box margin="sm">
        <FlexList direction="column">
          <canvas
            ref={props.appState.classOneCanvasRef}
            width="224"
            height="224"
            style={{ width: '150px' }}
          ></canvas>
          <Font>{`Samples: ${props.appState.classOneSamples}`}</Font>
        </FlexList>
      </Box>
      <Box margin="sm">
        <FlexList direction="column">
          <canvas
            ref={props.appState.classTwoCanvasRef}
            width="224"
            height="224"
            style={{ width: '150px' }}
          ></canvas>
          <Font>{`Samples: ${props.appState.classTwoSamples}`}</Font>
        </FlexList>
      </Box>
    </FlexList>
  );
}

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
    <Flex direction={'column'} alignItems="center">
      <Box margin="md">
        <Card>
          <Box margin="md">
            <video
              ref={props.appState.videoRef}
              autoPlay
              playsInline
              muted
              width="224"
              height="224"
            ></video>
          </Box>
        </Card>
      </Box>
      <Card>
        <Controls {...props} />
      </Card>
      <SampleCanvas {...props} />
    </Flex>
  );
}

export default MainScreen;
