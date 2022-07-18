import React from 'react';
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from "./cart.module.scss";
import Image from 'next/image';
import Link from 'next/link';




function CartPage() {
  return (
    <>
      <MetaTitle title="장바구니" />
      <Layout>
        <Wrapper>
          <section className={Styles.title}>
            <div className={Styles.text}>장바구니</div>
          </section>

          <section className={Styles.cart_btn}>
            <div className={Styles.content_box}>
              {/* 플렉스 row-reverse정렬 */}
              <div className={Styles.btn}>선택삭제</div>

              <div className={Styles.check_box}>
                <div className={Styles.auto__login__check}>
                  <label htmlFor="agree" className={Styles.chk__box}>
                    <input type="checkbox" id="agree" />
                    <span className={Styles.on} />
                    <div className={Styles.text}>전체선택</div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* 리스트 */}

          <section className={Styles.product_list}>
            <div className={Styles.emty_box}>
              <span>아직 장바구니에 담은 상품이 없습니다.</span>
              <div className={Styles.button_box}>
                <Link href="/shop?category=all" passHref>
                  <a className={Styles.emty_button}>상품 담으러 가기</a>
                </Link>
              </div>
            </div>
          </section>


          <section className={Styles.product_list}>
            <div className={Styles.flex_box}>
              {/* <div className={Styles.check_box}> */}
              <label className={Styles.check_box}>
                <div className={Styles.auto__login__check}>
                  <label htmlFor="list" className={Styles.chk__box}>
                    <input type="checkbox" id="list" />
                    <span className={Styles.on} />
                  </label>
                </div>
              </label>
              {/* </div> */}

              <div className={`${Styles.image} img-wrap`}>
                <Image
                  priority
                  src={require("/public/img/cart/cart_list.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
              <div className={Styles.list_text}>
                <p>바프레드</p>
                <span>46,200원</span>
                <div>44,900원</div>
              </div>
              
              <div className={Styles.grid_box}>
                <div className={Styles.count_box}>
                  <div className={Styles.minus}>-</div>

                  <div className={Styles.mid_box}>
                    <input classtype="text" id="count" placeholder="99"></input>
                  </div>
                  <div className={Styles.plus}> +</div>
                </div>


                <div className={Styles.price}>186,200원</div>
              </div>

              <div className={Styles.delete_btn}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("/public/img/cart/cart_x_btn.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={Styles.product_list}>
            <div className={Styles.flex_box}>
              {/* <div className={Styles.check_box}> */}
              <label className={Styles.check_box}>
                <div className={Styles.auto__login__check}>
                  <label htmlFor="list" className={Styles.chk__box}>
                    <input type="checkbox" id="list" />
                    <span className={Styles.on} />
                  </label>
                </div>
              </label>
              {/* </div> */}

              <div className={`${Styles.image} img-wrap`}>
                <Image
                  priority
                  src={require("/public/img/cart/cart_list.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
              <div className={Styles.list_text}>
                <p>바프레드</p>
                <span>46,200원</span>
                <div>44,900원</div>
              </div>

              <div className={Styles.grid_box}>
                <div className={Styles.count_box}>
                  <div className={Styles.minus}>-</div>

                  <div className={Styles.mid_box}>
                    <input classtype="text" id="count" placeholder="99"></input>
                  </div>
                  <div className={Styles.plus}> +</div>
                </div>


                <div className={Styles.price}>186,200원</div>
              </div>

              <div className={Styles.delete_btn}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("/public/img/cart/cart_x_btn.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={Styles.product_list}>
            <div className={Styles.flex_box}>
              {/* <div className={Styles.check_box}> */}
              <label className={Styles.check_box}>
                <div className={Styles.auto__login__check}>
                  <label htmlFor="list" className={Styles.chk__box}>
                    <input type="checkbox" id="list" />
                    <span className={Styles.on} />
                  </label>
                </div>
              </label>
              {/* </div> */}

              <div className={`${Styles.image} img-wrap`}>
                <Image
                  priority
                  src={require("/public/img/cart/cart_list.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
              <div className={Styles.list_text}>
                <p>바프레드</p>
                <span>46,200원</span>
                <div>44,900원</div>
              </div>

              <div className={Styles.grid_box}>
                <div className={Styles.count_box}>
                  <div className={Styles.minus}>-</div>

                  <div className={Styles.mid_box}>
                    <input classtype="text" id="count" placeholder="99"></input>
                  </div>
                  <div className={Styles.plus}> +</div>
                </div>


                <div className={Styles.price}>186,200원</div>
              </div>

              <div className={Styles.delete_btn}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("/public/img/cart/cart_x_btn.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={Styles.total_price}>
            <div className={Styles.flex_box}>
              <div className={Styles.amount}>
                <p className={Styles.up_text}>상품금액</p>
                <p className={Styles.down_text}>199,000원</p>
              </div>

              <div className={Styles.math}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("/public/img/cart/cart_plus.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>

              <div className={Styles.shipping}>
                <p className={Styles.up_text}>배송비</p>
                <p className={Styles.down_text}>5,000원</p>
              </div>

              <div className={Styles.math}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("/public/img/cart/cart_minus.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>

              <div className={Styles.discount}>
                <p className={Styles.up_text}>할인금액</p>
                <p className={Styles.down_text}>98,000원</p>
              </div>

              <div className={Styles.flex_text_box}>
                <div className={Styles.total}>총 주문 금액</div>

                <p>101,000원</p>
              </div>
            </div>
          </section>

          <section className={Styles.btn_box}>
            <Link href="/cart/Payment" passHref>
              <div className={Styles.btn_box}>
                  <a className={Styles.btn}>총 1건 주문하기</a>
              </div>
            </Link>

          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export default CartPage