import React from 'react'
import styled from 'styled-components';
import Hero from './Hero';

function Home() {
  return (
    <Container>
      <Hero />
    </Container>
  )
}

export default Home

const Container=styled.div`
    height: 2000px;
    display: flex;
    flex-direction: column;
    
`