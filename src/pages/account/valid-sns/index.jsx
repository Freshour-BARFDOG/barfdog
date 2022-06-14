import React from 'react'
import MetaTitle from "/src/components/atoms/MetaTitle";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import s from "src/pages/account/valid-sns/index.module.scss";

function ValidSnsPage() {
  return (
    <>
      <MetaTitle title="SNS계정 연동확인" />
      <Layout>
        <Wrapper>
          <div className={s.box}> 
          
            <div className={s.text}>
              해당 번호는 이미 가입된 계정이 있습니다. <br />
              확인을 누르면 계정이 연동됩니다.
            </div>
            <div className={s.btn}>
              확인

            </div>
          </div>




        </Wrapper>
      </Layout>
    </>
  );
}

export default ValidSnsPage;