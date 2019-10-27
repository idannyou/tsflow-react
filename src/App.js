import React from 'react';
import { Box, Button, Card, Flex, Input } from '@procore/core-react';

import InputClasses from './InputClasses';
import MainScreen from './MainScreen';

import './App.css';

function useAppState() {
  //Temp set to Hats
  const [classOne, setClassOne] = React.useState('Wearing Hat');
  const [classTwo, setClassTwo] = React.useState('Not Wearing Hat');

  //Temp set to true
  const [finishInputClasses, setFinishInputClasses] = React.useState(true);

  return {
    classOne,
    setClassOne,
    classTwo,
    setClassTwo,
    finishInputClasses,
    setFinishInputClasses
  };
}

function App() {
  const appState = useAppState();
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
