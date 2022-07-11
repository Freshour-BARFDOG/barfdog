import React from 'react';
import DaumPostCode from "/src/pages/api/daumPostCode";
import MetaTitle from "/src/components/atoms/MetaTitle";


export default function SearchAddressPopup() {
  return (
    <>
      <MetaTitle title="주소 검색"/>
      <DaumPostCode/>
    </>
  )
}

