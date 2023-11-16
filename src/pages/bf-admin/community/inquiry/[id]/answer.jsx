import React, {useMemo, useState} from 'react';
import s from './adminInquiry[id].module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import {AdminContentWrapper} from '/src/components/admin/AdminWrapper';
import Spinner from '/src/components/atoms/Spinner';
import {getDtataSSR_inquiryAuthorType} from '/util/func/getDtataSSR_inquiryAuthorType';
import transformDate from '/util/func/transformDate';
import {getDataSSR, putObjData} from '/src/pages/api/reqData';
import {useModalContext} from '/store/modal-context';
import popupWindow from '/util/func/popupWindow';
import {InquiryFiles} from "/src/components/mypage/inquiry/InquiryFiles";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";

export default function InquiryAnswerPage({ data }) {
  const answerId = data.id;
  const info = useMemo(() => {
    return {
      id: data.id,
      targetId: data.targetId,
      title: data.title,
      contents: data.contents,
      createdDate: data.createdDate,
      questionImgDtoList: data.questionImgDtoList,
      // questionImgDtoList: testImageList, // ! TEST
    };
  }, []);

  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [submitted, setSubmitted] = useState( false );
  
  // // console.log(info);

  const onDeleteItem = async () => {
    if(submitted) return onSuccessCallback();
    if(!confirm('답글을 삭제하시겠습니까?')) return;
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: true,
      }));
      
      
      const url = `/api/admin/questions`;
      const body = {
        id: answerId
      }
      const res = await putObjData(url, body);
      if (res.isDone) {
        mct.alertShow(
          `답글이 삭제되었습니다.`,
          onSuccessCallback,
        );
        setSubmitted(true);
      } else {
        mct.alertShow(
          `삭제에 실패하였습니다.`,
          onFailCallback,
        );
      }
      // // console.log(res);
    } catch (err) {
      mct.alertShow('서버와 통신문제로 인하여, 삭제에 실패하였습니다.', onFailCallback);
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: false,
      }));
    }
  };
  
  const onSuccessCallback = (e)=>{
    window.location.href = '/bf-admin/community/inquiry';
  }
  
  const onFailCallback = (e)=>{
    window.location.reload();
  }

  const onPrevPage = () => {
    window.location.href = '/bf-admin/community/inquiry';
  };

  const onPopupHandler = () => {
    const questionId = info.targetId;
    const href = `/bf-admin/popup/inquiry/${questionId}`;
    popupWindow(href);
  };

  return (
    <>
      <MetaTitle title="1:1 문의내용 답글" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className={`${s['header-section']} title_main`}>
            <h1>
              1:1 문의내용 답글
            </h1>
          </div>
          <main className="cont">
            <div className={`cont_body ${s['body-section']}`}>
              <div className={s['info-row']}>
                <div className="left-box">
                  <p className="title">원글 링크</p>
                </div>
                <div className="right-box">
                  <a
                    type={'button'}
                    className={'admin_btn line basic_m pointColor'}
                    onClick={onPopupHandler}
                    target={'_blank'}
                  >
                    원글 보기
                  </a>
                </div>
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
              <div className={`${s['info-row']} ${s['contents']} ${s['answer']}`}>
                <span className={s['info-row-title']}>답글</span>
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
                className="admin_btn confirm_l line"
                onClick={onDeleteItem}
              >
                {isLoading.delete ? (
                  <Spinner/>
                ) : (
                  '답글삭제'
                )}
              </button>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert background />}
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { id } = query;
  let DATA = null;

  const inValid = isNaN(id);
  let AUTHOR_TYPE = await getDtataSSR_inquiryAuthorType(req, id);
  // console.log('inValid: ', inValid, 'AUTHOR_TYPE', AUTHOR_TYPE);
  if (inValid || !AUTHOR_TYPE) { // !PROD;
    return {
      redirect: {
        destination: '/bf-admin/community/inquiry',
      },
    };
  }

  const apiUrl = `/api/admin/questions/admin/${id}`;
  const answer_res = await getDataSSR(req, apiUrl);
  // const answer_res = DUMMY_ANSWER_RES; // ! TEST
  // // console.log('answer_res: ',answer_res);
  if (answer_res?.status === 200 && answer_res?.data) {
    const data = answer_res.data;
    DATA = {
      id: data.id,
      targetId: data.targetId,
      title: data.title,
      contents: data.contents,
      createdDate: transformDate(data.createdDate, 'time', { seperator: '.' }),
      questionImgDtoList:
        data.questionImgDtoList?.map((q) => ({
          id: q.questionImageId,
          filename: q.filename || null,
          url: q.url || null,
        })) || [],
    };
  }
  return {
    props: { data: DATA },
  };
}

//
// const testImageList = [
//   {
//     questionImageId: 6,
//     filename: 'asdkfljdasfl.jpg',
//     url: 'http://localhost:4000/test.jpg',
//   },
//   {
//     questionImageId: 7,
//     filename: '    filename: \'a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1..jpg',
//     url: 'http://localhost:4000/test.jpg',
//   },
//   {
//     questionImageId: 8,
//     filename: 'a3.jpg',
//     url: 'http://localhost:4000/test.jpg',
//   },
// ]; // ! TEST


