import React, { useState, useMemo } from 'react';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './inquiry.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import {inquiryStatusIcon} from "/store/TYPE/inquiry/InquiryStatusIcon";
import {getDataSSR, putObjData} from '/src/pages/api/reqData';
import transformDate from '/util/func/transformDate';
import Link from "next/link";
import {useModalContext} from "/store/modal-context";
import Modal_confirm from "/src/components/modal/Modal_confirm";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import Image from 'next/image';

export default function InquiryArticlePage({ data }) {
  // console.log(data);
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const info = useMemo( () => data, [] );
  const [isLoading, setIsLoading] = useState({});
  const [confirmModal, setConfirmModal] = useState( false );
  const [submitted, setSubmitted] = useState( false );
  
  
  const onStartConfirm = ()=>{
    if(submitted) return onFailPostApiCallback();
    setConfirmModal(true);
  }
  
  const onDeleteItem = async (confirm) => {
    setConfirmModal(false);
    if(!confirm) return ;
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: true,
      }));
  
  
      const body = {
        id: info.id
      };
  
      
      const apiUrl = '/api/questions';
      const res = await putObjData(apiUrl, body);
    
      if (res.isDone) {
        setSubmitted(true);
        mct.alertShow('성공적으로 1:1 문의등록 삭제되었습니다.', onSuccessCallback);
      } else {
        mct.alertShow(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
      }
    
    } catch (err) {
      mct.alertShow('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.', onFailPostApiCallback);
    
      console.error('API통신 오류 : ', err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: false,
      }));
    }
  };
  
  const onSuccessCallback = ()=>{
    window.location.href='/mypage/inquiry';
  }
  
  const onFailPostApiCallback = ()=>{
    window.location.href='/mypage/inquiry';
  }

 
  return (
    <>
      <MetaTitle title="마이페이지 1:1 문의 확인" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s['body-section']}>
              <h1>1:1 문의</h1>
             
              <ul>
                <div className={s['info-row']}>
                  <div className={s['info-row-title']}>답변</div>
                  <div className={s['info-row-cont']}>
                    <span className={s['status-box']}>{inquiryStatusIcon[info.answerStatus]}</span>
                  </div>
                </div>

                <div className={s['info-row']}>
                  <div className={s['info-row-title']}>제목</div>
                  <div className={s['info-row-cont']}>{info.title}</div>
                </div>

                <div className={s['info-row']}>
                  <div className={s['info-row-title']}>등록일</div>
                  <div className={s['info-row-cont']}>
                    {transformDate(info.createdDate, 'time', { seperator: '.' })}
                  </div>
                </div>
              </ul>
              
              <div className={`${s['info-row']} ${s['contents']}`}>
                <div className={s['info-row-title']}><span>문의내용</span></div>
                <div className={s['info-row-cont']}>{info.contents}
                {info.questionImgDtoList.length > 0 &&
                  <div className={s['info-row-grid']}>
                    {info.questionImgDtoList.length > 0 &&
                    info.questionImgDtoList.map((img) => (
                      <a href={img.url} target="_blank">
                        <Image
                          src={img.url}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </a>
                      ))
                    }
                  </div>
                }
                </div>
              </div>
              {info.adminAnswer.length > 0 &&
              info.adminAnswer.map((answer, i) => (
                <article key={`adminAnswer-${i}`} className={`${s['answer-section']}`}>
                  <div className={s['info-row']}>
                    <div className={s['info-row-title']}>제목</div>
                    <div className={s['info-row-cont']}>{answer.title}</div>
                  </div>
                  <div className={s['info-row']}>
                    <div className={s['info-row-title']}>등록일</div>
                    <div className={s['info-row-cont']}>{transformDate(answer.createdDate,'time', { seperator: '.' })}</div>
                  </div>
                  <div className={`${s['info-row']} ${s['contents']}`}>
                    <div className={s['info-row-title']}>문의답변</div>
                    <div className={s['info-row-cont']}>{answer.contents}
                    {answer.questionImgDtoList.length > 0 &&
                      <div className={s['info-row-flex']}>
                        {answer.questionImgDtoList.length > 0 &&
                        answer.questionImgDtoList.map((img) => (
                          <div className={`${s['img-wrap']} img-wrap init-next-image`}>
                            <Image
                              src={img.url}
                              objectFit="cover"
                              layout="fill"
                              alt="카드 이미지"
                            />
                          </div>
                          ))
                        }
                      </div>
                    }
                    </div>
                  </div>
                </article>
              ))}
            </section>
            
            <section className={`${s['btn-section']}`}>
              <button
                type={'button'}
                className={`custom_btn line confirm_m ${s.delete}`}
                onClick={onStartConfirm}
              >
                {isLoading.delete ? <Spinner /> : '삭제'}
              </button>
              <Link href={'/mypage/inquiry'} passHref>
                <a
                  type={'button'}
                  className={`custom_btn solid confirm_m ${s.confirm}`}
                >
                  목록보기
                </a>
              </Link>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {confirmModal && <Modal_confirm
        text={'작성한 문의글과 답글이 삭제됩니다.\n정말 삭제하시겠습니까?'}
        isConfirm={onDeleteItem}
      />}
      {hasAlert && <Modal_global_alert background/>}
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  let DATA = null;
  const id = Number(query.id);
  const apiUrl = `/api/questions/${id}`;
  const res = await getDataSSR(req, apiUrl); // ! PROD
  // const res = DUMMY_RESPONSE; // ! TEST
  console.log(res.data);

  if (res.data && res.status === 200) {
    const data = res.data;
    DATA = {
      id: data.question.id,
      title: data.question.title,
      contents: data.question.contents,
      createdDate: data.question.createdDate,
      answerStatus: data.question.answerStatus,
      category: data.question.category,
      questionImgDtoList: data.question.questionImgDtoList?.map((img)=>({
        questionImageId: img.questionImageId,
        filename: img.filename,
        url: img.url,
      })) || [],
      adminAnswer: data.answerList.map((item) => ({
        id: item.id,
        targetId: item.targetId,
        title: item.title,
        contents: item.contents,
        createdDate: item.createdDate,
        questionImgDtoList: item.questionImgDtoList?.map((img)=>({
          questionImageId: img.questionImageId,
          filename: img.filename,
          url: img.url,
        })) || [],
      })),
    };
  }

  // ! TODO: 추후 데이터가 없는 경우도 Redir
  if (typeof id !== 'number' || !id) {
    return {
      redirect: {
        destination: '/mypage/inquiry',
      },
    };
  }

  return {
    props: { data: DATA },
  };
}



// const DUMMY_RESPONSE = {
//   data: {
//     _embedded: {
//       question: {
//         id: 1,
//         status: inquiryStatusType.MULTIPLE_ANSWERED,
//         title: '문의사항있습니다.',
//         contents:
//           'Lorem ipsum dolor sit amet \nLorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, dolor esse et, explicabo facere hic illo in, nemo omnis quidem repudiandae vitae! Asperiores, delectus ducimus facilis harum porro quisquam voluptate?',
//         createdDate: '2022-11-17T14:10:40'
//       },
//       adminAnswerDto: [
//         {
//           id: 1,
//           contents:
//             '관리자 첫 번째 답변입니다.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, dolor esse et, explicabo facere hic illo in, nemo omnis quidem repudiandae vitae! Asperiores, delectus ducimus facilis harum porro quisquam voluptate?',
//           createdDate: '2022-11-18T14:10:40',
//         },
//         {
//           id: 2,
//           contents:
//             '관리자 추가 답변Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, dolor esse et, explicabo facere hic illo in, nemo omnis quidem repudiandae vitae! Asperiores, delectus ducimus facilis harum porro quisquam voluptate?',
//           createdDate: '2022-11-19T14:10:40',
//         },
//         {
//           id: 3,
//           contents:
//             '관리자 추가 답변 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, dolor esse et, explicabo facere hic illo in, nemo omnis quidem repudiandae vitae! Asperiores, delectus ducimus facilis harum porro quisquam voluptate?',
//           createdDate: '2022-11-20T14:10:40',
//         },
//       ],
//     },
//   },
//   status: 200,
// };
