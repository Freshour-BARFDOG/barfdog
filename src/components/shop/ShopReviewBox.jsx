import s from '/src/pages/shop/item/[itemId].module.scss';
import RatingStars from '../atoms/RatingStars';
import React, { useEffect, useRef, useState } from 'react';
import { slideDown, slideUp } from '/util/func/slideToggle';
import { useSelector } from 'react-redux';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import { filter_blindingUserName } from '/util/func/filter_blindingUserName';
import MiniImageIcon from '/public/img/icon/icon-mini-image.svg';
import Image from 'next/image';

export const ShopReviewBox = ({ data }) => {
  const auth = useSelector((state) => state.auth);
  const isAdmin = auth.isAdmin;
  const getListApiUrl = `/api/items/${data?.itemId}/reviews`;
  const searchPageSize = 10;
  const apiDataQueryString = 'itemReviewsDtoList';
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState({});

  const pageInterCeptor = async (res) => {
    let newPageInfo = {
      totalPages: 0,
      size: 0,
      totalItems: 0,
      currentPageIndex: 1,
      newPageNumber: 1,
      newItemList: [],
    };
    const pageData = res.data.page;
    if (res.data._embedded) {
      const newItemList = res.data._embedded.itemReviewsDtoList || [];

      newPageInfo = {
        totalPages: pageData.totalPages,
        size: pageData.size,
        totalItems: pageData.totalElements,
        currentPageIndex: pageData.number,
        newPageNumber: pageData.number + 1,
        newItemList: newItemList,
      };
    }
    return newPageInfo;
  };

  return (
    <section className={s.tab_slide_box2}>
      {/* 리뷰별점박스 */}
      <div className={s.flex_box}>
        <div className={s.content}>
          <div className={s.title}>{data?.count}개의 리뷰</div>
          <div className={s.grade}>
            {data?.star.toFixed(1)} /<span className={s.red}>5.0</span>
          </div>
          <RatingStars count={data?.star} size={27} disabled />
        </div>
      </div>

      {/* ADMIN 전용 후기작성버튼*/}
      {isAdmin && (
        <div className={s.button_box}>
          <a
            className={s.write_button}
            href={`/bf-admin/review/create?itemId=${data?.itemId}`}
            target={'_blank'}
            rel={'noreferrer'}
          >
            관리자 후기생성
          </a>
        </div>
      )}

      <div className={s.notice_board}>
        <div className={s.flex_title}>
          <div>No</div>
          <div>별점</div>
          <div className={s.px16_title_content}>제목</div>
          <div></div>
          <div>등록일</div>
        </div>
        <ul className="reviewBox">
          {isLoading.fetching && <Spinner />}
          {itemList.length > 0 ? (
            itemList?.map((data, index) => (
              <ShopSingleItem_ReviewList key={`review-list-${index}`} data={data} />
            ))
          ) : (
            <EmptyContMessage message={'등록된 댓글이 없습니다.'} />
          )}
        </ul>
      </div>
      <section className={s['pagination_box']}>
        <PaginationWithAPI
          apiURL={getListApiUrl}
          size={searchPageSize}
          setItemList={setItemList}
          queryItemList={apiDataQueryString}
          setIsLoading={setIsLoading}
          routerDisabled={true}
          pageInterceptor={pageInterCeptor}
        />
      </section>
    </section>
  );
};

const ShopSingleItem_ReviewList = ({ data }) => {
  const DATA = {
    id: data.reviewDto.id,
    star: data.reviewDto.star,
    contents: data.reviewDto.contents,
    username: data.reviewDto.username,
    createdDate: data.reviewDto.createdDate,
    itemImages: data.reviewImageDtoList,
  };

  const [visible, setVisible] = useState(false);
  const boxRef = useRef(null);
  const onClickHandler = () => {
    visible ? setVisible(false) : setVisible(true);
  };

  useEffect(() => {
    const selectedElem = boxRef.current;
    if (!selectedElem) return;
    visible ? slideDown(selectedElem) : slideUp(selectedElem);
  }, [visible]);

  return (
    <li>
      <figure className={`${s.grid_box} ${s.review_thead}`} onClick={onClickHandler}>
        {/* 그리드 1 시작지점 */}
        <span className={s.number}>{DATA.id}</span>
        <i className={s.star_box}>
          <RatingStars count={DATA.star} margin={0} disabled />
        </i>
        <p className={s.content}>
          <i className={`${s.image} img-wrap`}>{DATA.itemImages.length > 0 && <MiniImageIcon />}</i>
          <em className={s.title}>{DATA.contents}</em>
        </p>
        <span className={s.name}>{filter_blindingUserName(DATA.username)}</span>
        <span className={s.date}>{DATA.createdDate}</span>
      </figure>
      <div className={s.review_tbody} ref={boxRef}>
        <p className={s.text}>{DATA.contents}</p>
        <ul className={s.images}>
          {DATA.itemImages?.map((image, index) => (
            <li key={`member-review-image-${image.id}-${index}`} className={'img-wrap'}>
              <Image
                priority={false}
                src={image.url}
                objectFit="cover"
                layout="fill"
                alt={image.filename}
              />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};
