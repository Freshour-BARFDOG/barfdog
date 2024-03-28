import { createButton } from 'react-social-login-buttons';

// KakaoIcon 컴포넌트 정의
const KakaoIcon = (props) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.902"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 1.8877C8.58 1.8877 0 9.4597 0 15.8657C0 20.6657 3.116 24.8997 7.862 27.4157L5.866 34.7477C5.688 35.3977 6.426 35.9137 6.992 35.5397L15.746 29.7297C16.484 29.8017 17.236 29.8437 18 29.8437C27.94 29.8437 36 23.5857 36 15.8657C36 9.4597 27.94 1.8877 18 1.8877Z"
      fill="black"
    />
  </svg>
);

const config_kakao = {
  text: '카카오로 시작하기',
  style: {
    background: '#FEE500',
    color: '#000000',
    fontSize: '1rem',
    margin: '1rem auto',
    padding: '1.8rem 0',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '12px',
    boxShadow: '0',
  },
  icon: KakaoIcon,
  className: 'kakaoLogin-btn',
};

const KakaoLoginBtn = createButton(config_kakao);
export default KakaoLoginBtn;
