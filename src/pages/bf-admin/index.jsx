import React from 'react';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';

Index.getInitialProps = async (ctx) => {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const json = await res.json();
  console.log('SSR -> getInitialProps 테스트')
  console.log(json)
  return { stars: json.stargazers_count };
};

function Index() {
  return (
    <AdminLayout >
      <AdminContentWrapper>
          DashBoard 페이지
      </AdminContentWrapper>
    </AdminLayout>
  )
}

export default Index