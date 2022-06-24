import React, { useEffect, useState } from 'react';
import ModalWrapper from '/src/components/modal/ModalWrapper';
import s from './Modal_AdminRecommendArticle.module.scss';
import rem from '/util/func/rem';
import CloseButton from '/src/components/atoms/CloseButton';
import { getData, putObjData } from '/api/reqData';
import SelectTag from '/src/components/atoms/SelectTag';
import { valid_isEmptyObject } from '/util/func/validationPackage';



/* Todo List
    1. 추천아티클 이미 선택된 option 기능
    2. api > put > 이미 선정된 아티클이 없을 경우, 500 에러남 // put을 post로 변경불가능할지??
* */




function Modal_AdminRecommendArticle({ setActiveModal }) {

  const firstBlogId = 'firstBlogId';
  const secondBlogId = 'secondBlogId';

  const [blogList, setBlogList] = useState([]);
  const [artricle, setArtricle] = useState({});
  const selectOptions = [
    ...blogList.map((list) => ({
      label: list.title,
      value: list.id,
    })),    {
      label: '선택',
      value: null,
    },
  ].reverse();

  // console.log(blogList);
  console.log(artricle);

  useEffect(() => {
    (async () => {
      const res = await getData('api/admin/articles');
      console.log(res);



      const articles = res.data.articlesAdminDtos;
      const articleData = {
        [firstBlogId]: 1, //      ////// ! ARTICLE > DATA확인 필요함
        [secondBlogId]: 5, //      ////// ! ARTICLE > DATA확인 필요함
      };

      setArtricle(articleData);

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

  const onHideRecommendArticleModal = () => {
    setActiveModal(false);
  };

  const onInputChangeHandler = (value, id) => {
    const blogId = Number(value);
    setArtricle((prevState) => ({
      ...prevState,
      [id]: blogId,
    }));
  };

  const onSaveArticle = () => {
    console.log(artricle);
    const errorMessage = valid_isEmptyObject(artricle);
    if (errorMessage) return alert('추천아티클을 모두 선정해주세요.');
    (async () => {
      const res = await putObjData('api/admin/articles', artricle);
      console.log(res);
    })();
  };


  return (
    <ModalWrapper
      background
      label="추천아티클 설정"
      positionCenter
      style={{ padding: '0', width: '100%', maxWidth: `${rem(600)}` }}
    >
      <div className={s['title-section']}>
        <h2>추천아티클 설정</h2>
        <CloseButton
          style={{ width: `${rem(32)}`, height: `${rem(32)}` }}
          lineColor={'#fff'}
          onClick={onHideRecommendArticleModal}
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
              initialValue={artricle[firstBlogId]}
            />
          </label>
          <label className={s['input-row']} htmlFor="recommend-1">
            <p className={s['input-title']}>추천 아티클2</p>
            <SelectTag
              name={'select-article'}
              id={secondBlogId}
              onChange={onInputChangeHandler}
              options={selectOptions}
              initialValue={artricle[secondBlogId]}
            />
          </label>
        </div>
        <div className={s['btn-section']}>
          <button className="admin_btn line confirm_l" onClick={onHideRecommendArticleModal}>
            닫기
          </button>
          <button className="admin_btn line confirm_l point" onClick={onSaveArticle}>
            저장
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default Modal_AdminRecommendArticle;
