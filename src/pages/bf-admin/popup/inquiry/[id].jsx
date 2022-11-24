import MetaTitle from '/src/components/atoms/MetaTitle';
import React, { useMemo } from 'react';
import { getDtataSSR_inquiryAuthorType } from '/util/func/getDtataSSR_inquiryAuthorType';
import { getDataSSR } from '/src/pages/api/reqData';
import transformDate from '/util/func/transformDate';
import popup from '../common-popup.module.scss';
import { PopupCloseButton_typeX } from '/src/components/popup/PopupCloseButton';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import s from '../../community/inquiry/[id]/adminInquiry[id].module.scss';
import { inquiryStatusIcon } from '/store/TYPE/inquiry/InquiryStatusIcon';
import { InquiryFiles } from '/src/components/mypage/inquiry/InquiryFiles';

export default function UserInquiryPopupPage({ data }) {
  const info = useMemo( () => data, [] );

  const onCloseWindowHandler = () => {
    window.close();
  };

  return (
    <>
      <MetaTitle title={`1:1문의`} />
      <PopupWrapper style={{ width: '100%', maxWidth: '900px' }}>
        <header className={popup.header}>
          <div className={popup.row}>
            <div className={popup.cont}>
              <h1 className={popup['popup-title']}>1:1문의내용 상세보기 (문의글 번호: {info.id})</h1>
              <PopupCloseButton_typeX />
            </div>
          </div>
        </header>
        <main className={popup.body}>
          <div className={`cont_body ${s['body-section']} ${s['add-padding']}`}>
            <div className={`${s['info-row']} ${s['status']}`}>
              <span className={s['info-row-title']}>답변상태</span>
              <span className={s['info-row-cont']}>
                {inquiryStatusIcon[info.answerStatus]}
              </span>
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
                  <span className={s['viewer-section']}>
                    첨부파일이 없습니다.
                  </span>
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
        <section className={popup['btn-section']}>
          <button
            type={'button'}
            onClick={onCloseWindowHandler}
            className={'admin_btn line confirm_l pointColor'}
          >
            닫기
          </button>
        </section>
      </PopupWrapper>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { id } = query;
  let DATA = null;

  const inValid = isNaN(id);
  let AUTHOR_TYPE = await getDtataSSR_inquiryAuthorType(req, id);
  if (inValid || !AUTHOR_TYPE) {
    !PROD;
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
      questionImgDtoList:
        data.questionImgDtoList?.map((q) => ({
          id: q.questionImageId,
          filename: q.filename || null,
          url: q.url || null,
        })) || [],
      answerIdList: answerIdList,
    };
  }

  return {
    props: { data: DATA },
  };
}
