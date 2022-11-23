import React, {useMemo, useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import {AdminContentWrapper} from '/src/components/admin/AdminWrapper';
import Spinner from '/src/components/atoms/Spinner';
import {getDtataSSR_inquiryAuthorType} from "/util/func/getDtataSSR_inquiryAuthorType";
import transformDate from "/util/func/transformDate";
import {getDataSSR} from "/src/pages/api/reqData";
import s from "./adminInquiry[id].module.scss";
import {InquiryFiles} from "/src/components/mypage/inquiry/InquiryFiles";
import {inquiryStatusIcon} from "/store/TYPE/inquiry/InquiryStatusIcon";

export default function InquiryQuestionPage({data}) {
  
  // console.log(data);
  const info = useMemo(() => {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      targetId: data.targetId,
      title: data.title,
      contents: data.contents,
      createdDate: data.createdDate,
      answerStatus: data.answerStatus,
      category: data.category,
      questionImgDtoList: data.questionImgDtoList,
    };
  }, []);
  
  const [isLoading, setIsLoading] = useState({});
  
  
  const onReplying = async () => {
    setIsLoading((prevState) => ({
      ...prevState,
      routing: true,
    }));
    const questionId = data.id;
    window.location.href=`/bf-admin/community/inquiry/${questionId}/createAnswer`;
  }
  const onPrevPage = () => {
    window.location.href = '/bf-admin/community/inquiry';
  };
  
  
  
  return (
    <>
      <MetaTitle title="1:1 문의내용 상세보기" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              1:1 문의내용 상세보기
            </h1>
          </div>
          <main className="cont">
            <div className={`cont_body ${s['body-section']}`}>
              <div className={`${s['info-row']} ${s['status']}`}>
                <span className={s['info-row-title']}>답변상태</span>
                <span className={s['info-row-cont']}>{inquiryStatusIcon[info.answerStatus]}</span>
              </div>
              <div className={`${s['info-row']}`}>
                <span className={s['info-row-title']}>작성자</span>
                <span className={s['info-row-cont']}>{info.name}</span>
              </div>
              <div className={`${s['info-row']}`}>
                <span className={s['info-row-title']}>이메일</span>
                <span className={s['info-row-cont']}>{info.email}</span>
              </div>
              <div className={s['info-row']}>
                <span className={s['info-row-title']}>제목</span>
                <span className={s['info-row-cont']}>{info.title}</span>
              </div>
              {/* info-row */}
              <div className={s['info-row']}>
                <span className={s['info-row-title']}>등록일</span>
                <span className={s['info-row-cont']}>{info.createdDate}</span>
              </div>
              {/* info-row */}
              <div className={`${s['info-row']}`}>
                <span className={s['info-row-title']}>
                  첨부파일
                  {info.questionImgDtoList.length > 0 && (
                    <em className={s.fileCounter}>
                      {info.questionImgDtoList.length}개
                    </em>
                  )}
                </span>
                <span className={s['info-row-cont']}>
                  {info.questionImgDtoList.length > 0 ? (
                    <InquiryFiles datas={info.questionImgDtoList} />
                  ) : (
                    <span className={s['viewer-section']}>첨부파일이 없습니다.</span>
                  )}
                </span>
              </div>
              {/* info-row */}
              <div className={`${s['info-row']} ${s['contents']}`}>
                <span className={s['info-row-title']}>문의내용</span>
                <span className={s['info-row-cont']}>{info.contents}</span>
              </div>
            </div>
          </main>
          <div className="cont_bottom">
            <div className="btn_section">
              <button
                type="button"
                id="btn-cancle"
                className="admin_btn confirm_l line pointColor"
                onClick={onPrevPage}
              >
                목록보기
              </button>
              <button
                type="button"
                id="btn-create"
                className="admin_btn confirm_l solid"
                onClick={onReplying}
              >
                {isLoading.routing ? (
                  <Spinner
                    style={{ color: '#fff', width: '15', height: '15' }}
                    speed={0.6}
                  />
                ) : (
                  '답글작성'
                )}
              </button>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}


export async function getServerSideProps({ req, query }) {
  const { id } = query;
  let DATA = null;
  
  const inValid = isNaN(id);
  let AUTHOR_TYPE = await getDtataSSR_inquiryAuthorType(req, id);
  if (inValid || !AUTHOR_TYPE) { ! PROD
  // if (false) { // ! TEST
    return {
      redirect: {
        destination: '/bf-admin/community/inquiry',
      },
    };
  }
  
  // # 유저 질문
  const apiUrl = `/api/admin/questions/member/${id}`;
  const inquiry_res = await getDataSSR(req, apiUrl);
  // const inquiry_res = DUMMY_INQUIRY_RES; // ! TEST
  // console.log(inquiry_res)
  if (inquiry_res?.status === 200 && inquiry_res?.data) {
    const data = inquiry_res.data;
    const answerIdList = data.answerIdList;
    DATA = {
      id: data.id,
      name: data.name,
      email: data.email,
      title: data.title,
      contents: data.contents,
      createdDate: transformDate(data.createdDate, 'time', { seperator: '.' }),
      answerStatus: data.answerStatus,
      category: data.category,
      questionImgDtoList: data.questionImgDtoList?.map(q=> ({
        filename: q.filename || null,
        url: q.url || null,
      })) || [],
      answerIdList: answerIdList,
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
