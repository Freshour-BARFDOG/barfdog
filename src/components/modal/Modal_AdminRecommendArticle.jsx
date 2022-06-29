import React, { useEffect, useState } from 'react';
import ModalWrapper from '/src/components/modal/ModalWrapper';
import s from './Modal_AdminRecommendArticle.module.scss';
import rem from '/util/func/rem';
import CloseButton from '/src/components/atoms/CloseButton';
import { getData, putObjData } from '/api/reqData';
import SelectTag from '/src/components/atoms/SelectTag';
import ErrorMessage from '../atoms/ErrorMessage';
import Spinner from '../atoms/Spinner';
import validation_article from '/util/func/validation/validation_article';

/* Todo List
    1. 추천아티클 이미 선택된 option 기능
    2. api > put > 이미 선정된 아티클이 없을 경우, 500 에러남 // put을 post로 변경불가능할지??
* */

const firstBlogId = 'firstBlogId';
const secondBlogId = 'secondBlogId';

function Modal_AdminRecommendArticle({ setActiveModal }) {
  const initialArticleId = {
    [firstBlogId]: null,
    [secondBlogId]: null,
  };
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blogList, setBlogList] = useState([]);
  const [artricleIdObj, setArtricleIdObj] = useState(initialArticleId);
  const selectOptions = [
    ...blogList.map((list) => ({
      label: list.title,
      value: list.id,
    })),
    {
      label: '선택',
      value: null,
    },
  ].reverse();

  useEffect(() => {
    (async () => {
      const res = await getData('api/admin/articles');
      console.log(res);

      const articles = res.data.articlesAdminDtos;
      const articleData = {
        [firstBlogId]: articles[0]?.blogId,
        [secondBlogId]: articles[1]?.blogId,
      };
      setArtricleIdObj(articleData);
      let blogData = [];
      const blogs = res.data.blogTitlesDtos;
      blogs.forEach((list) => {
        const obj = {};
        obj.title = list.title;
        obj.id = list.blogId;
        blogData.push(obj);
      });
      setBlogList(blogData);
    })();
  }, []);


  const onHideModal = () => {
    setActiveModal(false);
  };


  const onInputChangeHandler = (value, id) => {
    const blogId = Number(value);
    setArtricleIdObj((prevState) => ({
      ...prevState,
      [id]: blogId,
    }));
  };


  const onSaveArticle = () => {
    const errorMessage = validation_article(artricleIdObj);
    setFormError(errorMessage);
    if (errorMessage) return;
    (async () => {
      setIsLoading(true);
      await putObjData('/api/admin/articles', artricleIdObj)
        .then((res) => {
          console.log(res);
          if (!res.isDone) {
            setFormError(res.error);
            alert(`추천아티클을 설정할 수 없습니다.\nError Message: ${res.error}`);
            onHideModal();
          } else {
            alert('추천아티클 설정이 완료되었습니다.');
            onHideModal();
          }
        })
        .catch((err) => console.log(err));
      setIsLoading(false);
    })();
  };

  return (
    <ModalWrapper
      background
      label="추천아티클 설정"
      positionCenter
      style={{ padding: '0', width: '100%', maxWidth: `${rem(600)}` }}
      onBackgroundClick={onHideModal}
    >
      <div className={s['title-section']}>
        <h2>추천아티클 설정</h2>
        <CloseButton
          style={{ width: `${rem(32)}`, height: `${rem(32)}` }}
          lineColor={'#fff'}
          onClick={onHideModal}
        />
      </div>
      <div className={s['body-section']}>
        <div className={s['input-section']}>
          <label className={s['input-row']} htmlFor="recommend-1">
            <p className={s['input-title']}>추천 아티클1</p>
            <SelectTag
              name={'select-article'}
              id={firstBlogId}
              onChange={onInputChangeHandler}
              options={selectOptions}
              initialValue={artricleIdObj[firstBlogId]}
            />
          </label>
          <label className={s['input-row']} htmlFor="recommend-1">
            <p className={s['input-title']}>추천 아티클2</p>
            <SelectTag
              name={'select-article'}
              id={secondBlogId}
              onChange={onInputChangeHandler}
              options={selectOptions}
              initialValue={artricleIdObj[secondBlogId]}
            />
            {<ErrorMessage>{formError}</ErrorMessage>}
          </label>
        </div>
        <div className={s['btn-section']}>
          <button className="admin_btn line confirm_l" onClick={onHideModal}>
            닫기
          </button>
          <button className="admin_btn line confirm_l point" onClick={onSaveArticle}>
            {isLoading ? (
              <Spinner
                style={{ color: 'var(--color-main)', width: '20', height: '20' }}
                speed={0.6}
              />
            ) : (
              '저장'
            )}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default Modal_AdminRecommendArticle;
