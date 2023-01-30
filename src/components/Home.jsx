import React from 'react'
import styled from 'styled-components';
import Hero from './Hero';
import Insurance from './Insurance';
import Plan from './Plan';

function Home() {
  return (
    <Container>
      <Hero />
      <Plan />
      <Insurance />
    </Container>
  )
}

export default Home

const Container=styled.div`
    height: auto;
    display: flex;
    flex-direction: column;
    
`