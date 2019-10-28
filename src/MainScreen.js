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

import { train, predict } from './machineLearning';
import { draw, loadWebcam, getImage } from './webcam';

function useLongPress(callback = () => {}, ms = 10) {
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
    props.appState.controllerDatasetRef.current.addExample(
      props.appState.truncatedMobileNetRef.current.predict(img),
      0
    );

    img.dispose();
  });

  const handleLongPressTwo = useLongPress(async () => {
    let img = await getImage(props.appState.webcamRef.current);
    draw(img, props.appState.classTwoCanvasRef.current);
    props.appState.setClassTwoSamples(props.appState.classTwoSamples + 1);
    props.appState.controllerDatasetRef.current.addExample(
      props.appState.truncatedMobileNetRef.current.predict(img),
      1
    );
    img.dispose();
  });

  const [predictMode, setPredictMode] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [predictedClass, setPredictedClass] = React.useState(null);
  const [canPredict, setCanPredict] = React.useState(false);

  const handleTrain = async () => {
    props.appState.modelRef.current = await train(
      props.appState.controllerDatasetRef.current,
      props.appState.truncatedMobileNetRef.current,
      arg => console.log(arg)
    );
    setPredictMode(false);
    setCanPredict(true);
  };

  const handlePredict = () => {
    if (predictMode) {
      setPredictedClass(null);
    }
    setPredictMode(!predictMode);
  };

  React.useEffect(() => {
    let timer;

    if (predictMode) {
      timer = setTimeout(async () => {
        const classId = await predict(
          props.appState.webcamRef,
          props.appState.truncatedMobileNetRef,
          props.appState.modelRef
        );
        setCount(count + 1);
        setPredictedClass(classId);
      }, 100);
    } else {
      clearTimeout(timer);
    }
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <Box margin="md">
      <Box margin="md">
        <FlexList size="lg" justifyContent="center">
          <Button
            disabled={props.appState.controllerDatasetRef.current.xs == null}
            onClick={handleTrain}
            style={{ width: '125px' }}
          >
            Train
          </Button>
          <Button
            disabled={!canPredict}
            onClick={handlePredict}
            style={{ width: '125px' }}
          >
            {predictMode ? 'Stop Predicting' : 'Predict'}
          </Button>
        </FlexList>
      </Box>
      <FlexList size="lg" justifyContent="center">
        <Flex direction="column" alignItems="center">
          <Header.H3
            style={{
              color:
                predictedClass === null
                  ? 'black'
                  : predictedClass === 0
                  ? 'green'
                  : 'red'
            }}
          >
            {props.appState.classOne}
          </Header.H3>
          <Button style={{ width: '125px' }} {...handleLongPressOne}>
            Add Sample
          </Button>
        </Flex>
        <Flex direction="column" alignItems="center">
          <Header.H3
            style={{
              color:
                predictedClass === null
                  ? 'black'
                  : predictedClass === 1
                  ? 'green'
                  : 'red'
            }}
          >
            {props.appState.classTwo}
          </Header.H3>
          <Button style={{ width: '125px' }} {...handleLongPressTwo}>
            Add Sample
          </Button>
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
      const loadedWebcam = await loadWebcam(props.appState.videoRef.current);
      props.appState.webcamRef.current = loadedWebcam.webcam;
      props.appState.truncatedMobileNetRef.current =
        loadedWebcam.truncatedMobileNet;
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
