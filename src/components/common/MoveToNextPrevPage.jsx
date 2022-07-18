import { useRouter } from 'next/router';
import s from './moveToNextPrevPage.module.scss';
import Image from 'next/image';
import React from 'react';

export const MoveToNextPrevPage = ({
  pageInfo = { next: { title: '', id: null }, prev: { title: '', id: null } },
  setCurPageId, borderColor, ...props
}) => {
  const router = useRouter();
  const onChangePageId = (e) => {
    const endPointIndexOnPath = 3;
    const targetPageId = Number(e.currentTarget.dataset.pageId);
    const curPath = router.asPath;
    router.query = targetPageId;
    const path = curPath.split('/');
    const newPath = path
      .map((p, index) => (index === endPointIndexOnPath ? targetPageId : p))
      .join('/');
    router.push(newPath);
    setCurPageId(targetPageId);
  };

  return (
    <section className={`${s.wrap} ani-show-all-child`} style={{borderColor:borderColor}} {...props}>
      <ul className={s.grid_box}>
        <li>
          <p>
            다음 글
            <i className={`${s.image} img-wrap`}>
              <Image
                priority="false"
                src={require('/public/img/pages/community/up_arrow.png')}
                objectFit="contain"
                layout="fill"
                alt="카드 이미지"
              />
            </i>
          </p>
          {pageInfo.next ? (
            <button type={'button'} onClick={onChangePageId} data-page-id={pageInfo.next.id}>
              {pageInfo.next.title}
            </button>
          ) : (
            <p>다음 글이 없습니다.</p>
          )}
        </li>
        <li>
          <p>
            이전 글
            <i className={`${s.image} img-wrap`}>
              <Image
                priority="false"
                src={require('/public/img/pages/community/down_arrow.png')}
                objectFit="contain"
                layout="fill"
                alt="카드 이미지"
              />
            </i>
          </p>
          {pageInfo.prev ? (
            <button type={'button'} onClick={onChangePageId} data-page-id={pageInfo.prev.id}>
              {pageInfo.prev.title}
            </button>
          ) : (
            <p>이전 글이 없습니다.</p>
          )}
        </li>
      </ul>
    </section>
  );
};
