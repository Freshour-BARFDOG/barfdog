import { createButton } from 'react-social-login-buttons';

const NaverIcon = (props) => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="36" cy="36" r="36" fill="#03C75A" />
    <path d="M25 24H31.875V47H25V35.5V24Z" fill="white" />
    <path d="M40.125 24H47V47H40.125V24Z" fill="white" />
    <path
      d="M26.375 26.9346L31.875 24L46.3221 43.7792L40.125 47L26.375 26.9346Z"
      fill="white"
    />
  </svg>
);

const config_naver = {
  text: '네이버로 1초만에 로그인',
  style: {
    background: '#03C75A',
    color: '#fff',
    fontSize: '1rem',
    margin: '0.5rem auto',
    padding: '1.8rem 0',
    display: 'flex',
    borderRadius: '12px',
    boxShadow: '0',
    textAlign: 'center',
  },
  icon: NaverIcon,
  className: 'naverLogin-btn',
};

const NaverLoginBtn = createButton(config_naver);
export default NaverLoginBtn;
