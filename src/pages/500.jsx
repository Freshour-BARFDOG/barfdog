import React from 'react';
import Button_moveToPage from '../components/atoms/Button_moveToPage';
import Wrapper from '/src/components/common/Wrapper';

function Custom500() {
  return (
    <Wrapper>
      <div className="inner" style={{ padding: '20vh 0 0' }}>
        <h1
          style={{ fontSize: '60px', fontWeight: 'bold', textAlign: 'center' }}
        >
          500 Internal Server Error
        </h1>
        <h2
          style={{
            fontSize: '23px',
            fontWeight: '500',
            textAlign: 'center',
            color: '#555',
          }}
        >
          The server encountered an error and could not complete your request.
        </h2>
        <p
          style={{
            fontSize: '20px',
            fontWeight: '500',
            textAlign: 'center',
            color: '#555',
            marginTop: '20px',
          }}
        >
          서비스 장애가 발생하였습니다. 문제가 지속될 경우 서비스팀에 문의
          부탁드립니다.
        </p>
      </div>
    </Wrapper>
  );
}

export default Custom500;
