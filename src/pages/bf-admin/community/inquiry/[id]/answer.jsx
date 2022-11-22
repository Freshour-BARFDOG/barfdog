import React, {useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import {AdminContentWrapper} from '/src/components/admin/AdminWrapper';
import Spinner from '/src/components/atoms/Spinner';
import {inquiryAuthorType} from "/store/TYPE/inquiry/inquiryAuthorType";
import {getDtataSSR_inquiryAuthorType} from "/util/func/getDtataSSR_inquiryAuthorType";
import transformDate from "/util/func/transformDate";
import {getDataSSR} from "/src/pages/api/reqData";

export default function InquiryAnswerPage({data}) {
  console.log(data);
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
  let DATA = {
    inquiry: null,
    answer: []
  };
  
  const inValid = isNaN(id);
  let AUTHOR_TYPE = await getDtataSSR_inquiryAuthorType(req, id);
  // if (inValid || !AUTHOR_TYPE) { ! PROD
  if (false) { // ! TEST
    return {
      redirect: {
        destination: '/bf-admin/community/inquiry',
      },
    };
  }
  
  // # 유저 질문
  const inquiryApiUrl = `/api/admin/questions/member/${id}`;
  // const inquiry_res = await getDataSSR(req, inquiryApiUrl);
  const inquiry_res = DUMMY_INQUIRY_RES; // ! TEST
  if (inquiry_res?.status === 200 && inquiry_res?.data) {
    const data = inquiry_res.data;
    const answerIdList = data.answerIdList;
    const inquiryData = {
      id: data.id,
      name: data.name,
      email: data.email,
      title: data.title,
      contents: data.contents,
      createdDate: transformDate(data.createdDate, 'time', { seperator: '.' }),
      questionImgDtoList: data.questionImgDtoList?.map(q=> ({
        filename: q.filename || null,
        url: q.url || null,
      })) || [],
      answerIdList: answerIdList,
    }
    DATA.inquiry = inquiryData;
    
    
    // # 관리자 답변
    if(answerIdList.length) {
      const answerList = [];
      for (const answerId of answerIdList) {
        const answerApiUrl = `/api/admin/questions/admin/${answerId}`;
        // const answer_res = await getDataSSR(req, answerApiUrl);
        const answer_res = DUMMY_ANSWER_RES;
        console.log('answer_res: ',answer_res);
        if (answer_res?.status === 200 && answer_res?.data) {
          const data = answer_res.data;
          const answerData = {
            id: data.id,
            targetId: data.targetId,
            title: data.title,
            contents: data.contents,
            createdDate: transformDate(data.createdDate, 'time', { seperator: '.' }),
            questionImgDtoList: data.questionImgDtoList?.map(q=> ({
              filename: q.filename || null,
              url: q.url || null,
            })) || [],
          }
          // DATA.answer
          console.log('answerId: ',answerId)
          DATA.answer.push(answerData);
        }
      }
    }
  }
  

  return {
    props: { data: DATA },
  };
}



const DUMMY_INQUIRY_RES = {
  data: {
    id: 33,
    name: '실버',
    email: 'user@example.com',
    title: 'title!',
    contents: 'contentscontentscontents',
    createdDate: '2022-11-21T11:19:46.141',
    questionImgDtoList: [
      {filename: 'filename.jpg', url: 'http://localhost:4000/_next/image?url=%2F_next%2Fs…ic%2Fmedia%2Flogo(admin).77a38725.png&w=1200&q=75'},
      {filename: 'filename2.jpg', url: 'http://localhost:4000/_next/image?url=%2F_next%2Fs…ic%2Fmedia%2Flogo(admin).77a38725.png&w=1200&q=75'},
    ],
    answerIdList: [36,37,38]
  },
  _links: {},
  status: 200,
}



const DUMMY_ANSWER_RES = {
  data: {
    id: 35,
    targetId: 33,
    title: 'title!',
    contents: '관리자의 답변내용',
    createdDate: '2022-11-22T11:19:46.141',
    questionImgDtoList: [
      {filename: 'filename.jpg', url: 'http://localhost:4000/_next/image?url=%2F_next%2Fs…ic%2Fmedia%2Flogo(admin).77a38725.png&w=1200&q=75'},
      {filename: 'filename2.jpg', url: 'http://localhost:4000/_next/image?url=%2F_next%2Fs…ic%2Fmedia%2Flogo(admin).77a38725.png&w=1200&q=75'},
    ],
  },
  _links: {},
  status: 200,
}
