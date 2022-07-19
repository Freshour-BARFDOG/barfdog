import React from 'react';
import styled from 'styled-components';
import rem from '@util/func/rem';
import CloseButton from "./CloseButton";

const FakeInput = styled.span`
  height: ${rem(30)};
  display: grid;
  grid-template-columns: ${rem(75)} 1fr ${rem(20)};
  column-gap: ${rem(8)};
  align-items: center;
  cursor: pointer;
  width: 100%;
  font-size: ${rem(14)};
  background-color: var(--gray-v10);
 padding: ${rem(6)} 0 ${rem(6)} ${rem(6)} ;
`;

const Button = styled.em`
  display: flex;
  align-content: center;
  justify-content: center;
  min-width: ${rem(75)};
  white-space: nowrap;
  font-size: inherit;
  background: var(--color-main);
  border-color:  var(--color-main) !important;
  transition: background-color .2s var(--transition-cubic);
  &:hover{
    background-color: var(--color-point-hover) ;
    border-color:  var(--color-main) !important;
  }
  color: #fff !important;
`;

const Label = styled.p`
  max-width: calc(100% - ${rem(75)});
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: inherit;
`;


const CloaseButtonWrap = styled.span`
  display: flex;
  align-content: center;
  justify-content: center;
  margin-right: ${rem(6)};
`;


export default function Fake_input_uploadDogProfileImage({ filename, loadingIcon, onDelete}) {
  return (
    <>
      <FakeInput className="fake_input">
        <Button className="fake_input_body admin_btn line basic_m" type="submit">
          {loadingIcon || '파일선택'}
        </Button>
        <Label className="fake_input_filename">
          {filename ? filename : '선택된 파일이 없습니다.'}
        </Label>
        <CloaseButtonWrap>
          <CloseButton onClick={onDelete} lineColor={'#ABABAB'}/>
        </CloaseButtonWrap>
      </FakeInput>
    </>
  );
}

