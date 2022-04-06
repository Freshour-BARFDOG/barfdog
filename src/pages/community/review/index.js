import React from 'react'
import Link from 'next/link';

function index() {
  return (
    <>
    <div>Reveiw Page</div>
    <Link href="/" as="/home">메인페이지로 이동하기</Link>
    </>
  )
}

export default index