import React from 'react';
import Wrapper from '/src/components/common/Wrapper'

function ErrorPage() {
  return (
    <Wrapper>
      <div className='inner'  style={{padding:"20vh 0 0", textAlign:"center"}}>
        <h1 style={{fontSize: '60px', fontWeight:'bold', textAlign:'center'}}>500 Internal Server Error</h1>
        <h2 style={{fontSize: '30px', fontWeight:'500', textAlign:'center', width: "50%", display:"inline-block"}}>The server encountered an internal error or misconfiguration and was unable to complete your request.</h2>
      </div>
      
      </Wrapper>
  )
}

export default ErrorPage