import React from 'react'
import styled from 'styled-components'


function Footer() {
  return (
    <Container>
      <div className="metropolis">
        <div className="text-container">
          <p className="my-metropolis">Pinsurance</p>
        </div>
      </div>
      <a href="https://github.com/anubhav11156/Pinsurance-FVM-Spacewarp" className="source-code-div" target="_blank">
        <div>
          <img src="/images/github-logo.png" />
        </div>
        <p>Source Code</p>
      </a>
      <div className="contributor-1">
        <div className="main-container">
          <div className="image-div">
            <div className="profile-pic-div">
              <img src="/images/profile.jpeg" />
            </div>
          </div>
          <div className="name-div">
            <p>Anubhav Kumar</p>
            <p>Bihar, India</p>
            <p>3rd year college student</p>
          </div>
          <div className="social-handle-div">
            <div className="handles">
              <a href="https://discordapp.com/users/769844243236913155" target="_blank">
                <img src="/images/discord-logo.png" />
              </a>
            </div>
            <div className="handles">
              <a href="https://www.behance.net/thermal_ice" target="_blank">
                <img src="/images/behance-logo.png" />
              </a>
            </div>
            <div className="handles">
              <a href="https://github.com/anubhav11156" target="_blank">
                <img src="/images/github-logo.png" />
              </a>
            </div>
            <div className="handles">
              <a href="https://www.linkedin.com/in/anubhav-kumar-8749871b8/" target="_blank">
                <img src="/images/linkedin-logo.png" />
              </a>
            </div>
            <div className="handles">
              <a href="https://twitter.com/meta_anubhav" target="_blank">
                <img src="/images/twitter.png" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Footer

const Container = styled.div`
  height: 600px;
  background-color: lightpink;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  border-top: 1px solid rgba(130, 71, 230, 0.4);

  background-color: rgba(10,10,13,255);

  .metropolis {
    padding-left: 20px;
    flex:1;
    display: flex;
    justify-content: start;
    align-items: end;
    height: 100%;

    .text-container {
      height: 150px;
      width: 100%;
      display: flex;
      flex-direction: column;
      width: 600px;

      .my-metropolis {
        margin: 0;
        font-size: 88px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.75);
      }
    }
  }

  .contributor-1 {
   flex:1;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;

   .main-container {
     margin-left: 20px;
     border: 1px solid white;
     height: 70%;
     width: 300px;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     background: rgba( 255, 255, 255, 0.1 );

     backdrop-filter: blur( 4px );
     -webkit-backdrop-filter: blur( 4px );
     border-radius: 2px;
     border: 2px solid rgba( 255, 255, 255, 0.5 );

     .image-div {
       height: 180px;
       width: 100%;
       display: flex;
       justify-content: center;

       .profile-pic-div {
         margin-top: 55px;
         height: 110px;
         width: 110px;
         border-radius: 70px;
         overflow: hidden;
         display: flex;
         justify-content: center;
         align-items: center;
         border: 2px solid #3adfae;
        
         img {
           width: 110px;
         }

       }
     }

     .name-div {
       margin-top: 10px;
       height: 100px;
       width: 100%;
       display: flex;
       flex-direction: column;
       align-items: center;
       margin-bottom: 0px;
       p {
         margin: 0;
         margin-top: 3px;
         display:block;
         font-size: 16px;
         color: rgba(255, 255, 255, 0.5);
         letter-spacing: 1px;
       }
     }

     .social-handle-div {
       flex: 1;
       width: 100%;
       display: flex;
       margin-left: 19px;
       justify-content: center;
      

       .handles {
         margin-top: 40px;
         margin-right: 20px;
         width: 30px;
         height: 30px;
         img {
           width: 100%;
         }
         transition: all 0.25s;
       }
       .handles:hover {
         scale: 1.15;
       }
       }
   }

 }

 .source-code-div {
   text-decoration: none;
   color: white;
   width: 160px;
   height: 40px;
   display: flex;
   justify-content: center;
   align-items: center;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   transition: color 0.15s;

   &:hover  {
     color: #3adfae;
   }

   div {
     margin-left: -5px;
     display: flex;
     justify-content: center;
     align-items: center;
     height: 100%;
     width: 35px;

     img {
       width: 28px;
     }
   }

   p {
     font-size: 16px;
     margin-left: 5px;
   }
 }
`