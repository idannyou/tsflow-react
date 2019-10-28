import React from 'react';
import { Card, Flex } from '@procore/core-react';

import InputClasses from './InputClasses';
import MainScreen from './MainScreen';
import { ControllerDataset } from './controllerDataset';

function useAppState() {
  const [classOne, setClassOne] = React.useState('');
  const [classTwo, setClassTwo] = React.useState('');
  const [classOneSamples, setClassOneSamples] = React.useState(0);
  const [classTwoSamples, setClassTwoSamples] = React.useState(0);

  const [finishInputClasses, setFinishInputClasses] = React.useState(false);

  //webcam , model, and mobile net
  const videoRef = React.useRef();
  const truncatedMobileNetRef = React.useRef();
  const webcamRef = React.useRef();
  const controllerDatasetRef = React.useRef(new ControllerDataset(2));
  const modelRef = React.useRef;

  //canvas refs
  const classOneCanvasRef = React.useRef();
  const classTwoCanvasRef = React.useRef();

  return {
    classOne,
    setClassOne,
    classTwo,
    setClassTwo,
    classOneSamples,
    setClassOneSamples,
    classTwoSamples,
    setClassTwoSamples,
    finishInputClasses,
    setFinishInputClasses,
    videoRef,
    truncatedMobileNetRef,
    webcamRef,
    classOneCanvasRef,
    classTwoCanvasRef,
    controllerDatasetRef,
    modelRef
  };
}

function App() {
  const appState = useAppState();

  window.appState = appState;

  return (
    <Flex direction="column" alignItems="center">
      <Card style={{ width: '370px', height: '600px' }}>
        {appState.finishInputClasses ? (
          <MainScreen appState={appState} />
        ) : (
          <InputClasses appState={appState} />
        )}
      </Card>
    </Flex>
  );
}

export default App;
