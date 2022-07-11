import React from 'react';
import styled from 'styled-components';
import rem from '@util/func/rem';

const FakeInput = styled.span`
  height: ${rem(30)};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  width: 100%;
  font-size: ${rem(14)};
`;

const Button = styled.em`
  margin-right: ${rem(8)};
  display: flex;
  align-content: center;
  justify-content: center;
  cursor: pointer;
  width: ${rem(75)};
  white-space: nowrap;
  font-size: inherit;
`;

const Label = styled.p`
  cursor: pointer;
  max-width: calc(100% - ${rem(75)});
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: inherit;
`;

const FakeInputModernTheme = styled.span`
  background-color: #4d4d4d;
  width: ${rem(80)};
  height: ${rem(80)};
  position: relative;
  display: inline-flex;
  align-content: center;
  justify-content: center;
  cursor: pointer;
  
  &:before,
  &:after {
    display:${(props)=> props.loading === 'loading' ? 'none' : 'block'};
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    width: ${rem(2)};
    height: ${rem(28)};
    background-color: #fff;
  }
  &::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
`;

function Fake_input({ filename, loadingIcon, theme = 'basic' }) {
  return (
    <>
      {theme === 'basic' && (
        <FakeInput className="fake_input">
          <Button className="fake_input_body admin_btn line basic_m" type="submit">
            {loadingIcon || '파일선택'}
          </Button>
          <Label className="fake_input_filename">
            {filename ? filename : '선택된 파일이 없습니다.'}
          </Label>
        </FakeInput>
      )}
      {theme === 'modern' && (
        <FakeInputModernTheme loading={loadingIcon ? 'loading' : ''}>{loadingIcon}</FakeInputModernTheme>
      )}
    </>
  );
}

export default Fake_input;
