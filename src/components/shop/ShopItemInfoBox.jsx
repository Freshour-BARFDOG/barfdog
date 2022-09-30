import Styles from '/src/pages/shop/item/[itemId].module.scss';
import Image from 'next/image';
import { ShopBotBox } from './ShopBotBox';
import React from 'react';
import 'react-quill/dist/quill.snow.css';
import s from './ShopItemInfo.module.scss'

export const ShopItemInfoBox = ({ contents }) => {
  return (
    <>
      <section className={s['contents-wrap']}>
        <div
          className={`view ql-editor ${s['ql-editor']}`}
          dangerouslySetInnerHTML={{ __html: contents }}
        ></div>
      </section>
    </>
  );
};
