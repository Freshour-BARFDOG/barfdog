import Link from 'next/link';
import React from 'react';
import Styled from 'styled-components';



function AdminBtn_moveToPage({ href, text, className, animation }) {
  return (
    <Link href={href} passHref>
      <a>
        <button type="button" className={className} animation={animation}>
          {text}
        </button>
      </a>
    </Link>
  );
};


export default AdminBtn_moveToPage;