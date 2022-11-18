import React, { useState } from 'react';
import { getDataSSR } from '/src/pages/api/reqData';
import MetaTitle from '../../../../../components/atoms/MetaTitle';
import AdminLayout from '../../../../../components/admin/AdminLayout';
import { AdminContentWrapper } from '../../../../../components/admin/AdminWrapper';
import Spinner from '../../../../../components/atoms/Spinner';

export default function ReadInquiryPage(props) {
  const [isLoading, setIsLoading] = useState({});

  return (
    <>
      <MetaTitle title="1:1 문의 상세보기" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              1:1 문의 상세보기
              {isLoading.fetching && (
                <Spinner
                  style={{
                    color: 'var(--color-main)',
                    width: '20',
                    height: '20',
                  }}
                  speed={0.6}
                />
              )}
            </h1>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { id } = query;
  const availableQuery = typeof Number(id) === 'number';
  if(!availableQuery){
    return {
      redirect:{
        destination: '/bf-admin/community/inquiry'
      }
    }
  }

  let DATA = null;
  const apiUrl = '/api/_____';
  const res = await getDataSSR(req, apiUrl);
  if (res.status === 200 && res.data) {
    DATA = {};
  }

  return {
    props: { data: DATA },
  };
}
