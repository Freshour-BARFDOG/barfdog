import {Provider} from 'react-redux';
import store from '@store/index';
import '/styles/global/global.scss';
import AuthInterceptor from '/store/auth-interceptor';
import '/src/pages/api/axios.config';
import {ModalContextProvider} from '/store/modal-context';
import ChannelTalkProvider from '/src/pages/api/channelTalk/ChannelTalkProvider';
import GAProvider from '/src/pages/api/googleAnalytics/GAProvider';
import {getDataSSR, getTokenFromServerSide} from '/src/pages/api/reqData';
import {userType} from '/store/TYPE/userAuthType';
import React from "react";
import {AlertLayer} from "@src/layers/AlertLayer";

// Server Only File (client에서 사용하는 로직 사용불가)
// Next JS : 최초실행
//👉 공통된 Data Fetching이 필요하다면 _app.js에 getInitialProps를 붙이면 된다.CustomProps

/* ! < '최초' 랜더링 시, 2번 API FETCHING 이유 >
   - nextjs는 pre-rendering 과정을 사전에 한번 거치는데 그때 한번 실행되고
   - 실제 rendering 될때 다시 한번 실행됨.
   (- 그 이후에는, 다른 페이지 이동후 같은 페이지 방문 시, 1번 랜더링 하는 것을 확인할 수 있다.)
*
* */

export default function MyApp({ Component, pageProps, CustomProps }) {
  // console.log('pageProps: ', pageProps, '\nCURSOMPROPS:', props);
  return (
    <GAProvider>
      <Provider store={store}>
        <AuthInterceptor CustomProps={CustomProps}>
          <ChannelTalkProvider>
            <ModalContextProvider>
                <AlertLayer props={CustomProps}>
                  <Component {...pageProps} />
                </AlertLayer>
            </ModalContextProvider>
          </ChannelTalkProvider>
        </AuthInterceptor>
      </Provider>
    </GAProvider>
  );
}

MyApp.getInitialProps = async (initialProps) => {
  // console.log(origin);
  const { ctx, Component, pageProps } = initialProps;
  const { res, req } = ctx;
  let token = null;
  let USER_TYPE = null;
  let EXPIRED_TOKEN_ADMIN = null;
  let EXPIRED_TOKEN_MEMBER = null;
  let cartDATA = null;
  let memberDATA = null;
  let fetchingError = null;

  // console.log('RESPONSE: ', res);
  // ! SSR: request & response 존재
  // ! CCR : request & response '없음' => _app.jsx가 실행될 때,  token, USER_TYPE이 위에 정의된 값으로 초기화됨.
  // ! 따라서, Login State을 유지하기 위해서는, Redux등으로, SSR이 안되었을 때를 대비하여, 상태관리를 해줘야함.
  // ! auth-interceptor에서, 토큰만료를 확인하는 조건 => null이 아닌 false일 때로, 구체적으로 명시하여 구분해야함.
  // const SSR_cookie = req?.headers?.cookie || res?.headers?.cookie;
  if (req?.headers?.cookie || res?.headers?.cookie) {
    token = getTokenFromServerSide(req);
    const valid_adminApiUrl = '/api/admin/setting';
    const valid_memberApiUrl = `/api/baskets`;

    const res_ADMIN = await getDataSSR(req, valid_adminApiUrl, token);
    const res_CART = await getDataSSR(req, valid_memberApiUrl, token);

    // STEP 1. USER TYPE
    if (res_ADMIN && res_ADMIN.status === 200 && res_CART.status === 200) {
      USER_TYPE = userType.ADMIN;
    } else if (res_CART && res_CART.status === 200) {
      USER_TYPE = userType.MEMBER;
    } else {
      USER_TYPE = userType.NON_MEMBER;
    }

    // STEP 2. EXPIRED TOKEN
    // 토큰 만료 확인 후 , login Page Redir한 경우 => 무한 redir을 방지하기 위해 토큰 만료 초기화
    if (res_ADMIN && res_ADMIN.status === 401) {
      // EXPIRED_TOKEN_ADMIN = req.headers.referer?.indexOf('/bf-admin/login') >= 0 ? true : null;
      EXPIRED_TOKEN_ADMIN = true;
    } else if (res_ADMIN) {
      EXPIRED_TOKEN_ADMIN = false;
    }

    if (res_CART && res_CART.status === 401) {
      // console.log('EXPIRED_TOKEN_MEMBER: ', EXPIRED_TOKEN_MEMBER);
      // EXPIRED_TOKEN_MEMBER = req.headers.referer?.indexOf('/bf-admin/login') >= 0 ? true : null;
      EXPIRED_TOKEN_MEMBER = true;
    } else if (res_CART) {
      EXPIRED_TOKEN_MEMBER = false;
    }

    // STEP 3. CART DATA

    if (
      (USER_TYPE === userType.MEMBER && res_CART.status === 200) ||
      (USER_TYPE === userType.ADMIN && res_ADMIN.status === 200)
    ) {
      const membersApiUrl = `/api/members`;
      const res_MEMBER = await getDataSSR(req, membersApiUrl, token);
      const memberData = res_MEMBER.data;
      const mypageApiUrl = `/api/mypage`; // 마이페이지 상단 내 정보 화면
      const res_MEMBER_Dashboard = await getDataSSR(req, mypageApiUrl, token);
      const mypageData = res_MEMBER_Dashboard.data;
      // console.log('/api/members => ',memberData);
      console.log('/api/mypage => ',mypageData);
      if(mypageData){
        memberDATA = {
          userType: USER_TYPE,
          memberId: memberData.memberId,
          name: memberData.name,
          email: memberData.email,
          phoneNumber: memberData.phoneNumber,
          birthday: memberData.birthday,
          gender: memberData.gender,
          provider: memberData.provider,
          providerId: memberData.providerId,
          grade: mypageData.mypageMemberDto.grade,
          receiveSms: memberData.receiveSms,
          receiveEmail: memberData.receiveEmail,
          address: {
            zipcode: memberData.address.zipcode,
            city: memberData.address.city,
            street: memberData.address.street,
            detailAddress: memberData.address.detailAddress,
          },
          recommendCode: mypageData.mypageMemberDto.myRecommendationCode,
          reward: mypageData.mypageMemberDto.reward,
          deliveryCount: mypageData.deliveryCount,
          couponCount: mypageData.couponCount,
          dog: {
            dogName:mypageData.mypageDogDto?.dogName,
            thumbnailUrl: mypageData.mypageDogDto?.thumbnailUrl || null,
          },
          subscribe:{
            subscribedDogs: mypageData.mypageDogDtoList?.map((dog)=>({
              dogName:dog.dogName,
              inStock: dog.inStock, // ! 구독상품 레시피의 재고유무
              recipeName: dog.recipeName
            })) || [], // 마이페이지의 모든 강아지목록이 아닌, "현재 구독중인 강아지 목록" (api 객체명으로 인해 혼동할 필요 없음)
          }
        };
      }



      // STEP 4. Add cart data
      const cartData = res_CART?.data;
      if(cartData){
        cartDATA = {
          deliveryConstant: {
            price: cartData.deliveryConstant.price,
            freeCondition: cartData.deliveryConstant.freeCondition,
          },
          basketDtoList: cartData.basketDtoList.map((item) => ({
            itemDto: {
              basketId: item.itemDto.basketId,
              itemId: item.itemDto.itemId,
              thumbnailUrl: item.itemDto.thumbnailUrl,
              name: item.itemDto.name,
              originalPrice: item.itemDto.originalPrice,
              salePrice: item.itemDto.salePrice,
              amount: item.itemDto.amount,
              deliveryFree: item.itemDto.deliveryFree,
            },
            itemOptionDtoList: item.itemOptionDtoList.map((opt) => ({
              id: opt.id,
              name: opt.name,
              optionPrice: opt.optionPrice,
              amount: opt.amount,
            })),
            totalPrice: item.totalPrice,
            _links: {
              increase_basket: item._links.increase_basket.href,
              decrease_basket: item._links.decrease_basket.href,
              delete_basket: item._links.delete_basket.href,
            },
          })),
        };
      }
    }
  }

  // ! 추후 작업 : 토큰 만료 시, Redir
  // if (EXPIRED_TOKEN_MEMBER || EXPIRED_TOKEN_ADMIN) {
  //   const redirectPath = EXPIRED_TOKEN_MEMBER
  //     ? '/account/login'
  //     : EXPIRED_TOKEN_ADMIN
  //       ? '/bf-admin/login'
  //       : null;
  //
  //   // res.setHeader("location", redirectPath);
  //   return {
  //     Component,
  //     pageProps,
  //     CustomProps: {
  //       data: { cart: cart_DATA || null, error: failedFetchingCartData || null },
  //       token: token,
  //       USERTYPE: USER_TYPE || null,
  //       EXPIRED_TOKEN: { ADMIN: EXPIRED_TOKEN_ADMIN, MEMBER: EXPIRED_TOKEN_MEMBER },
  //     },
  //     redirect: {
  //       destination: redirectPath,
  //       permanent: false,
  //     },
  //   }
  //
  // }
  // ! 추후 작업 : 토큰 만료 시, Redir

  // console.log('res_ADMIN: ',res_ADMIN)
  // console.log('res_MEMBER: ',res_MEMBER)
  // console.log('RESPONSE :::::: ',memberDATA);
  // console.log('EXPIRED_TOKEN_ADMIN: ', EXPIRED_TOKEN_ADMIN);
  // console.log('EXPIRED_TOKEN_MEMBER: ', EXPIRED_TOKEN_MEMBER);
  // console.log('USER_TYPE:: ',USER_TYPE)

  return {
    Component,
    pageProps,
    CustomProps: {
      data: { cart: cartDATA, member: memberDATA, error: fetchingError},
      token: token,
      USERTYPE: USER_TYPE || null,
      EXPIRED_TOKEN: { ADMIN: EXPIRED_TOKEN_ADMIN, MEMBER: EXPIRED_TOKEN_MEMBER },
    },
  };
};


const DUMMY_RES_OBJ = [{
  dogname: 'dog1',
  inStock: true,
  recipeName: 'STARTER PREMIUM'
},{
  dogname: 'dog2',
  inStock: true,
  recipeName: 'STARTER PREMIUM'
},{
  dogname: 'dog3',
  inStock: true,
  recipeName: 'STARTER PREMIUM'
},{
  dogname: 'dog4',
  inStock: true,
  recipeName: 'STARTER PREMIUM'
}]