import MetaTitle from '../../../../components/atoms/MetaTitle';
import Spinner from '../../../../components/atoms/Spinner';
import React, { useState } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { AdminContentWrapper } from '../../../../components/admin/AdminWrapper';

export default function InquiryListPage(props) {
  const [isLoading, setIsLoading] = useState({});

  return (
    <>
      <MetaTitle title="1:1 문의목록" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              1:1 문의 목록
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
