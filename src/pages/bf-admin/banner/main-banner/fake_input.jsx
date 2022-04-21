import React from "react";
import styled from 'styled-components';
import rem from '@src/components/atoms/rem';
styled;


const FakeInput = styled.div`
  height: ${rem(30)};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const FakeInputBody = styled.span`
  margin-right: ${rem(8)};
  display: flex;
  cursor:pointer;
  width: ${rem(75)};
  white-space:nowrap;
`;

const FakeInputName = styled.span`
  cursor: pointer;
  max-width: calc(100% - ${rem(75)});
  white-space:nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
`;

function Fake_input({filename}) {
  return (
    <FakeInput className="fake_input">
      <FakeInputBody className="fake_input_body admin_btn line basic_m" type="submit">파일선택</FakeInputBody>
      <FakeInputName className="fake_input_filename">{filename? filename : '선택된 파일이 없습니다.'}</FakeInputName>
    </FakeInput>
  );
}

export default Fake_input;
