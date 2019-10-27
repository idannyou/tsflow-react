import React from 'react';
import { Box, Button, Header, Flex, Input } from '@procore/core-react';

function FixedBox(props) {
  return (
    <Box margin="lg" style={{ width: '300px' }}>
      {props.children}
    </Box>
  );
}

function InputClasses(props) {
  const disableButton = Boolean(
    !(props.appState.classOne && props.appState.classTwo)
  );

  return (
    <Flex alignItems="center" justifyContent="center" direction={'column'}>
      <FixedBox>
        <Header.H2>Class One:</Header.H2>
        <Input
          placeholder="Input your first class (ex: Wearing hat)"
          onChange={e => props.appState.setClassOne(e.target.value)}
          value={props.appState.classOne}
        />
      </FixedBox>
      <FixedBox>
        <Header.H2>Class Two:</Header.H2>
        <Input
          placeholder="Input your second class (ex: Not wearing hat)"
          onChange={e => props.appState.setClassTwo(e.target.value)}
          value={props.appState.classTwo}
        />
      </FixedBox>
      <Box margin="lg">
        <Button
          disabled={disableButton}
          onClick={() => props.appState.setFinishInputClasses(true)}
        >
          Submit
        </Button>
      </Box>
    </Flex>
  );
}

export default InputClasses;
