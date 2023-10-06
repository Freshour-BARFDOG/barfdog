import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  DownOutlined,
  Badge,
  Space,
  Tag,
  Alert,
  Button,
  Table,
  Dropdown,
  MenuProps,
  Popconfirm,
  Spin,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import * as xlsx from "xlsx";
import axios from "axios";

import { getData, postData, postObjData, putObjData } from '../../pages/api/reqData';





const openNewWindow = (link,key) => {
  // 새 창을 열기 위한 로직을 구현합니다.
  const url = `/bf-admin2/${link}/${key}`; // 예시 URL
  const subWindow = window.open(url, '_blank', 'width=1000,height=1000');
  if (subWindow) {
    subWindow.focus();
  } else {
    alert('Subwindow blocked. Please allow pop-ups and try again.');
  }
};



const columns = [
  Table.EXPAND_COLUMN,
  Table.SELECTION_COLUMN,
  // {
  //   title: "",
  //   key: "action",
  //   render: (_, record) => (
  //     <Space size="middle">
  //     <a
  //       href="#"
  //       onClick={(e) => {
  //         e.preventDefault();
  //         openNewWindow(record.key);
  //       }}
  //     >
  //       View Details
  //     </a>
  //       {/* <a>삭제</a> */}
  //     </Space>
  //   ),
  // },
  { title: "주문번호", dataIndex: "orderNumber", key: "orderNumber", },
  { title: "주문상태", dataIndex: "state", key: "state", },
  { title: "구독상태", dataIndex: "subscription", key: "subscription", },
  { title: "묶음배송", dataIndex: "isPackage", key: "isPackage", },
  { title: "구매자", dataIndex: "orderMemberName", key: "orderMemberName", },
  { title: "수령자", dataIndex: "orderRecivedName", key: "orderRecivedName", },
  { title: "견명", dataIndex: "orderDogName", key: "orderDogName", },
  { title: "브로셔", dataIndex: "memberIsBrochure", key: "memberIsBrochure", },
  { title: "플랜", dataIndex: "plan", key: "plan", },
  // { title: "레시피", dataIndex: "recipe", key: "recipe",
  //   render: (_, { recipe }) => {

  //     if(!recipe) return (<></>);
      
  //     return (
  //     <>
  //       {recipe.map((tag) => {
  //         let color = "";
  //         if (tag === "TURKEY&BEEF") {
  //           color = "geekblue";
  //           return (
  //             <Tag color={color} key={tag}>
  //               🐔🐮
  //             </Tag>
  //           );
  //         } else if (tag === "DUCK&LAMB") {
  //           color = "green";
  //           return (
  //             <Tag color={color} key={tag}>
  //               🦆🐑
  //             </Tag>
  //           );
  //         } else if (tag === "LAMB&BEEF") {
  //           color = "red";
  //           return (
  //             <Tag color={color} key={tag}>
  //               🐑🐮
  //             </Tag>
  //           );
  //         } else if (tag === "STARTER PREMIUM") {
  //           color = "red";
  //           return (
  //             <Tag color={color} key={tag}>
  //               🖐️
  //             </Tag>
  //           );
  //         } else {
  //           return (
  //             <Tag key={tag}>
  //               {tag}
  //             </Tag>
  //           );
  //         }
  //       })}
  //     </>
  //     )

  //   },
  // },
  { title: "결제일", dataIndex: "paymentDate", key: "paymentDate", },
  { title: "개인정보수정일", dataIndex: "memberModifiedDate", key: "memberModifiedDate", },
  { title: "주문금액", dataIndex: "orderPrice", key: "orderPrice", },
  { title: "결제금액", dataIndex: "paymentPrice", key: "paymentPrice", },
  { title: "배송주기", dataIndex: "deliveryInterval", key: "deliveryInterval", },
  { title: "누적배송수", dataIndex: "memberAccumulatedSubscribe", key: "memberAccumulatedSubscribe", },
  { title: "누적 구독 배송수", dataIndex: "subscribeCount", key: "subscribeCount", },
  { title: "다음 배송일", dataIndex: "nextDeliveryDate", key: "nextDeliveryDate", 
  },
  { title: "다음 결제일", dataIndex: "nextPaymentDate", key: "nextPaymentDate", 
    sorter: (a, b) => new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate),
    sortDirections: ['descend', 'ascend'],
  },
  { title: "다음 결제액", dataIndex: "nextPaymentPrice", key: "nextPaymentPrice", },
  { title: "첫 결제일", dataIndex: "memberFirstPaymentDate", key: "memberFirstPaymentDate", },
  { title: "누적 결제금액", dataIndex: "memberAccumulatedamount", key: "memberAccumulatedamount", },
  { title: "등급", dataIndex: "memberGrade", key: "memberGrade", },
  { title: "연락처", dataIndex: "memberPhoneNumber", key: "memberPhoneNumber", },
  { title: "성별", dataIndex: "memberGender", key: "memberGender", },
  { title: "생년월일", dataIndex: "memberBirthday", key: "memberBirthday", },
  { title: "이메일", dataIndex: "memberEmail", key: "memberEmail", width: "7%"},
  { title: "주소", dataIndex: "deliveryStreet", key: "deliveryStreet", width: "12%"},
  { title: "요청사항", dataIndex: "deliveryRequest", key: "deliveryRequest", width: "7%"},
];







const columns_general = [
  Table.SELECTION_COLUMN,
  {
    title: "DB 주문번호", 
    render: (_, record) => (
      <Space size="middle">
      <a href="#" onClick={(e) => {
          e.preventDefault();
          openNewWindow("modifier-general-order",record.orderId);
        }} > {record.orderId} 수정 </a>
      </Space>
    ),
  },
  { title: "주문번호", dataIndex: "orderNumber", key: "orderNumber", },
  { title: "주문상태", dataIndex: "state", key: "state", },
  { title: "묶음배송", dataIndex: "isPackage", key: "isPackage", },
  { title: "결제금액", dataIndex: "paymentPrice", key: "paymentPrice", },
  { title: "구매자", dataIndex: "orderMemberName", key: "orderMemberName", },
  { title: "수령자", dataIndex: "orderRecivedName", key: "orderRecivedName", },
  { title: "결제일", dataIndex: "paymentDate", key: "paymentDate", },
  { title: "첫 결제일", dataIndex: "memberFirstPaymentDate", key: "memberFirstPaymentDate", },
  { title: "수량", dataIndex: "amount", key: "amount", },
  { title: "물품이름", dataIndex: "productName", key: "productName", },
  { title: "누적 결제금액", dataIndex: "memberAccumulatedamount", key: "memberAccumulatedamount", },
  { title: "등급", dataIndex: "memberGrade", key: "memberGrade", },
  { title: "연락처", dataIndex: "memberPhoneNumber", key: "memberPhoneNumber", },
  { title: "성별", dataIndex: "memberGender", key: "memberGender", },
  { title: "생년월일", dataIndex: "memberBirthday", key: "memberBirthday", },
  { title: "이메일", dataIndex: "memberEmail", key: "memberEmail", width: "7%"},
  { title: "주소", dataIndex: "deliveryStreet", key: "deliveryStreet", width: "12%"},
  { title: "요청사항", dataIndex: "deliveryRequest", key: "deliveryRequest", width: "7%"},
];


const filterDataGeneral = (data, search) => {

  let defaultData = [];

  if (!search) return defaultData;
  if (!search.rangeDate) return defaultData;


  for(let i = data.length-1; i >=0; --i) {
    const data_tmp = data[i];

    if(data_tmp.dtype == "general"){


      const arr_street = [data_tmp.deliveryStreet, data_tmp.deliveryDetailAddress, data_tmp.deliveryZipcode];
      const result_street = arr_street.join(", ");
      
      const result_amounts = data_tmp.itemAmounts.join(", ");
      const result_producNames = data_tmp.itemNames.join(", ");

      defaultData.push(
        {
          key: i.toString(),
          orderNumber: data_tmp.merchantUid,
          state: data_tmp.orderStatus,
          isPackage: data_tmp.isPackage === true ? "YES" : "NO",
          paymentPrice: data_tmp.paymentPrice,
          orderMemberName: data_tmp.memberName,
          orderRecivedName: data_tmp.deliveryName,
          paymentDate: data_tmp.createdDate,
          memberFirstPaymentDate: data_tmp.memberFirstPaymentDate,
          amount: result_amounts,
          productName: result_producNames,
          memberAccumulatedamount: data_tmp.memberAccumulatedamount,
          memberGrade: data_tmp.memberGrade,
          memberPhoneNumber: data_tmp.memberPhoneNumber,
          memberGender: data_tmp.memberGender,
          memberBirthday: data_tmp.memberBirthday,
          memberEmail: data_tmp.memberEmail,
          deliveryStreet: result_street,
          deliveryRequest: data_tmp.deliveryRequest,

          orderId: data_tmp.orderId,
          
        }
      )
    }

  }


  // 필터링
  //return defaultData;

  return (
    defaultData
    .filter((item) => {
      if (!item.state) return item;

      // 판매상태
      let orderState_result = false;
      const orderState_array = ["CANCEL_PAYMENT", "CANCEL_DONE_BUYER","CANCEL_DONE_SELLER" ,
      "DELIVERY_START" ,"DELIVERY_BEFORE_COLLECTION" ,"BEFORE_PAYMENT", "DELIVERY_DONE",
      "CONFIRM","FAILED","DELIVERY_READY","PAYMENT_DONE"];
      orderState_array.forEach((e) => {
        //if (search.orderState.includes(e) && !orderState_result) {
        if (search.orderState.indexOf(e) != -1 && !orderState_result) {
          orderState_result = item.state === e;
        }
      });
      


      // 등급
      let grade_result = true;
      const grad_array = ["브론즈","실버","골드","플래티넘","다이아몬드","더바프"];
      grad_array.forEach((e) => {
        if (search.gradeState.includes(e) && !grade_result && item.memberGrade) {
          grade_result = item.memberGrade === e;
        }
      });


      // 검색조건

      let search_result = false;
      if(search.searchText){
        if (search.searchType.includes("orderMemberName") && item.orderMemberName) {
          search_result = item.orderMemberName.includes(search.searchText);
        }
        else if (search.searchType.includes("orderDeliveryName")&& item.orderRecivedName) {
          search_result = item.orderRecivedName.includes(search.searchText);
        }
        else if (search.searchType.includes("orderDogName")&& item.orderDogName) {

          // @todo : item에 orderDogName이 없음

          //search_result = item.orderDogName.includes(search.searchText);
        }
        else if (search.searchType.includes("orderMemberEmail")&& item.memberEmail) {
          search_result = item.memberEmail.includes(search.searchText);
        }
        else if (search.searchType.includes("orderNumber")&& item.orderNumber) {
          search_result = item.orderNumber.includes(search.searchText);
        }
      } else { 
        search_result = true; 
      }

      if (
        orderState_result && 
        grade_result && 
        search_result) return item;
    })
  );
}

const filterDataSubscribe = (data, search) => {

  
  let defaultData = [];

  if (!search) return defaultData;
  if (!search.rangeDate) return defaultData;



  for(let i = data.length-1; i >=0; --i) {
    const data_tmp = data[i];


    if(data_tmp.dtype == "subscribe"){


      let countPacks = 28;
      if(data_tmp.plan === "TOPPING"){
        countPacks = 20;
      }

      const typeCountYYL = data_tmp.typeCountYYL;


      // 내꺼
      let gramRecipe1_tmp = 0.0;
      let gramRecipe2_tmp = 0.0;
      let gramRecipe3_tmp = 0.0;
      let gramRecipe4_tmp = 0.0;
      let totalGramRecipe1_tmp = 0.0;
      let totalGramRecipe2_tmp = 0.0;
      let totalGramRecipe3_tmp = 0.0;
      let totalGramRecipe4_tmp = 0.0;
  
      for(let j=0; j<data_tmp.recipeName.length; j++){
        const recipe_tmp = data_tmp.recipeName[j];
        const gramsRecipe = data_tmp.oneMealGramsPerRecipe[j];
        if(recipe_tmp === "STARTER PREMIUM"){
          gramRecipe1_tmp = gramsRecipe;
          totalGramRecipe1_tmp = gramsRecipe*countPacks/typeCountYYL;
        }else if(recipe_tmp === "TURKEY&BEEF"){
          gramRecipe2_tmp = gramsRecipe;
          totalGramRecipe2_tmp = gramsRecipe*countPacks/typeCountYYL;
        }else if(recipe_tmp === "DUCK&LAMB"){
          gramRecipe3_tmp = gramsRecipe;
          totalGramRecipe3_tmp = gramsRecipe*countPacks/typeCountYYL;
        }else if(recipe_tmp === "LAMB&BEEF"){
          gramRecipe4_tmp = gramsRecipe;
          totalGramRecipe4_tmp = gramsRecipe*countPacks/typeCountYYL;
        }
      }
      let totalGramRecipe_tmp = 
      totalGramRecipe1_tmp + totalGramRecipe2_tmp + totalGramRecipe3_tmp + totalGramRecipe4_tmp;



      // 석범이꺼
      let gramRecipe1_seok_tmp = 0.0;
      let gramRecipe2_seok_tmp = 0.0;
      let gramRecipe3_seok_tmp = 0.0;
      let gramRecipe4_seok_tmp = 0.0;
      let totalGramRecipe1_seok_tmp = 0.0;
      let totalGramRecipe2_seok_tmp = 0.0;
      let totalGramRecipe3_seok_tmp = 0.0;
      let totalGramRecipe4_seok_tmp = 0.0;

      // console.log(data_tmp.memberName,data_tmp.recipeName)
      // if(data_tmp.recipeName){
      //   const recipeName_seok = data_tmp.recipeName.split(", ");
      //   const oneMealGramsPerRecipe_seok = data_tmp.oneMealGramsPerRecipe.split(", ");
      //   for(let j=0; j<recipeName_seok.length; j++){
      //     const recipe_tmp = recipeName_seok[j];
      //     const gramsRecipe = parseFloat(oneMealGramsPerRecipe_seok[j]);
      //     if(recipe_tmp === "STARTER PREMIUM"){
      //       gramRecipe1_seok_tmp = gramsRecipe;
      //       totalGramRecipe1_seok_tmp = gramsRecipe*countPacks/typeCountYYL;
      //     }else if(recipe_tmp === "TURKEY&BEEF"){
      //       gramRecipe2_seok_tmp = gramsRecipe;
      //       totalGramRecipe2_seok_tmp = gramsRecipe*countPacks/typeCountYYL;
      //     }else if(recipe_tmp === "DUCK&LAMB"){
      //       gramRecipe3_seok_tmp = gramsRecipe;
      //       totalGramRecipe3_seok_tmp = gramsRecipe*countPacks/typeCountYYL;
      //     }else if(recipe_tmp === "LAMB&BEEF"){
      //       gramRecipe4_seok_tmp = gramsRecipe;
      //       totalGramRecipe4_seok_tmp = gramsRecipe*countPacks/typeCountYYL;
      //     }
      //   }
      // }


      let totalGramRecipe_seok_tmp = 
      totalGramRecipe1_seok_tmp + totalGramRecipe2_seok_tmp + totalGramRecipe3_seok_tmp + totalGramRecipe4_seok_tmp;


      // 소수점 이하 몇자리?
      const numFixed = 4;


      // 주소 합치기
      const arr_street = [data_tmp.deliveryStreet, data_tmp.deliveryDetailAddress, data_tmp.deliveryZipcode];
      const result_street = arr_street.join(", ");


      defaultData.push(
        {
          key: i.toString(),
          orderNumber: data_tmp.merchantUid,
          state: data_tmp.orderStatus,
          subscription: data_tmp.status,
          isPackage: data_tmp.isPackage === true ? "YES" : "NO",
          orderMemberName: data_tmp.memberName,
          orderRecivedName: data_tmp.deliveryName,
          orderDogName: data_tmp.dogName,
          memberIsBrochure: data_tmp.memberIsBrochure === true ? "YES" : "NO",
          plan: data_tmp.plan,
          paymentDate: data_tmp.createdDate,
          memberModifiedDate: data_tmp.memberModifiedDate,
          orderPrice: data_tmp.orderPrice,
          paymentPrice: data_tmp.paymentPrice,
          deliveryInterval: data_tmp.deliveryInterval,
          memberAccumulatedSubscribe: data_tmp.memberAccumulatedSubscribe,
          subscribeCount: data_tmp.subscribeCount,
          nextDeliveryDate: data_tmp.nextDeliveryDate,
          nextPaymentDate: data_tmp.nextPaymentDate,
          nextPaymentPrice: data_tmp.nextPaymentPrice,
          memberFirstPaymentDate: data_tmp.memberFirstPaymentDate,
          memberAccumulatedamount: data_tmp.memberAccumulatedamount,
          memberGrade: data_tmp.memberGrade,
          memberPhoneNumber: data_tmp.memberPhoneNumber,
          memberGender: data_tmp.memberGender,
          memberBirthday: data_tmp.memberBirthday,
          memberEmail: data_tmp.memberEmail,
          deliveryStreet: result_street,
          deliveryRequest: data_tmp.deliveryRequest,
          
          children0: [
            {
              key: i.toString(),
              orderId: data_tmp.orderId,
              subscribeId: data_tmp.subscribeId, //data_tmp.dogNeededCalorie,
              deliveryId: data_tmp.deliveryId,
              dogId: data_tmp.dogId,
              memberId: data_tmp.memberId,
              merchantUid: data_tmp.merchantUid,
            },
          ],

          children1: [
            {
              key: i.toString(),
              dogName: data_tmp.dogName,
              dogNeededCalorie: data_tmp.oneDayRecommendKcal, //data_tmp.dogNeededCalorie,
              gramsRecipeYYL: data_tmp.gramsRecipeYYL,
              dogType: data_tmp.dogType,
              dogGender: data_tmp.dogGender,
            },
          ],
          children2: [
            {
              key: i.toString(),
              countPacks: countPacks,
              typeCountYYL: typeCountYYL,
              totalGramRecipes: totalGramRecipe_tmp,
              gramRecipe1: gramRecipe1_tmp < 1.e-12 ? null : gramRecipe1_tmp,
              gramRecipe2: gramRecipe2_tmp < 1.e-12 ? null : gramRecipe2_tmp,
              gramRecipe3: gramRecipe3_tmp < 1.e-12 ? null : gramRecipe3_tmp,
              gramRecipe4: gramRecipe4_tmp < 1.e-12 ? null : gramRecipe4_tmp,
              totalGramRecipe1: totalGramRecipe1_tmp < 1.e-12 ? null : totalGramRecipe1_tmp,
              totalGramRecipe2: totalGramRecipe2_tmp < 1.e-12 ? null : totalGramRecipe2_tmp,
              totalGramRecipe3: totalGramRecipe3_tmp < 1.e-12 ? null : totalGramRecipe3_tmp,
              totalGramRecipe4: totalGramRecipe4_tmp < 1.e-12 ? null : totalGramRecipe4_tmp,

            },
          ],
          children3: [
            {
              key: i.toString(),
              countPacks: countPacks,
              typeCountYYL: typeCountYYL,
              totalGramRecipes: totalGramRecipe_seok_tmp,
              gramRecipe1: gramRecipe1_seok_tmp < 1.e-12 ? null : gramRecipe1_seok_tmp,
              gramRecipe2: gramRecipe2_seok_tmp < 1.e-12 ? null : gramRecipe2_seok_tmp,
              gramRecipe3: gramRecipe3_seok_tmp < 1.e-12 ? null : gramRecipe3_seok_tmp,
              gramRecipe4: gramRecipe4_seok_tmp < 1.e-12 ? null : gramRecipe4_seok_tmp,
              totalGramRecipe1: totalGramRecipe1_seok_tmp < 1.e-12 ? null : totalGramRecipe1_seok_tmp,
              totalGramRecipe2: totalGramRecipe2_seok_tmp < 1.e-12 ? null : totalGramRecipe2_seok_tmp,
              totalGramRecipe3: totalGramRecipe3_seok_tmp < 1.e-12 ? null : totalGramRecipe3_seok_tmp,
              totalGramRecipe4: totalGramRecipe4_seok_tmp < 1.e-12 ? null : totalGramRecipe4_seok_tmp,
            },
          ],
          children4: [
            {
              key: i.toString(),
              dogBirth: data_tmp.dogBirth,
              dogStartAgeMonth: data_tmp.dogStartAgeMonth,
              dogOldDog: data_tmp.dogOldDog === true ? "YES" : "NO",
              dogSize: data_tmp.dogSize,
              dogWeight: data_tmp.dogWeight,
              dogStatus: data_tmp.dogStatus,
              dogNeutralization: data_tmp.dogNeutralization === true ? "YES" : "NO",
            },
          ],
          children5: [
            {
              key: i.toString(),
              dogInedibleFood: data_tmp.dogInedibleFood,
              dogInedibleFoodEtc: data_tmp.dogInedibleFoodEtc,
              dogCaution: data_tmp.dogCaution,
              dogActivityLevel: data_tmp.dogActivityLevel,
              dogSnackCountLevel: data_tmp.dogSnackCountLevel,
              dogWalkingCountPerWeek: data_tmp.dogWalkingCountPerWeek,
              dogWalkingTimePerOneTime: data_tmp.dogWalkingTimePerOneTime,
            },
          ],
        }
      )

    }

  }



  // 필터링

  //return defaultData;

  return (
    defaultData
    .filter((item) => {
      if (!item.state) return item;

      // 판매상태
      let orderState_result = false;
      const orderState_array = ["RESERVED_PAYMENT", "BEFORE_PAYMENT","PRODUCING" ,
      "CANCEL_DONE_BUYER" ,"CANCEL_RESERVED_PAYMENT" ,"FAILED", "PAYMENT_DONE",
      "CANCEL_PAYMENT","CONFIRM","DELIVERY_DONE","DELIVERY_BEFORE_COLLECTION","DELIVERY_START"];
      orderState_array.forEach((e) => {
        // if (search.orderState.includes(e) && !orderState_result) {
        //   orderState_result = item.state.includes(e);
        // }
        if (search.orderState.indexOf(e) != -1 && !orderState_result) {
          orderState_result = item.state === e;
        }
      });
      //
      //console.log(item.state)


      // 구독상태
      let subscribe_result = false;
      const subscribe_array = ["SUBSCRIBING", "BEFORE_PAYMENT"];
      subscribe_array.forEach((e) => {
        if (search.subscribeState.includes(e) && !subscribe_result && item.subscription) {
          subscribe_result = item.subscription.includes(e);
        }
      });

      // 등급
      let grade_result = false;
      const grad_array = ["브론즈","실버","골드","플래티넘","다이아몬드","더바프"];
      grad_array.forEach((e) => {
        if (search.gradeState.includes(e) && !grade_result && item.memberGrade) {
          grade_result = item.memberGrade.includes(e);
        }
      });


      // 검색조건

      let search_result = false;
      if(search.searchText){
        if (search.searchType.includes("orderMemberName") && item.orderMemberName) {
          search_result = item.orderMemberName.includes(search.searchText);
        }
        else if (search.searchType.includes("orderDeliveryName")&& item.orderRecivedName) {
          search_result = item.orderRecivedName.includes(search.searchText);
        }
        else if (search.searchType.includes("orderDogName")&& item.orderDogName) {
          search_result = item.orderDogName.includes(search.searchText);
        }
        else if (search.searchType.includes("orderMemberEmail")&& item.memberEmail) {
          search_result = item.memberEmail.includes(search.searchText);
        }
        else if (search.searchType.includes("orderNumber")&& item.orderNumber) {
          search_result = item.orderNumber.includes(search.searchText);
        }
      } else { 
        search_result = true; 
      }


      if (
        orderState_result && 
        subscribe_result && 
        grade_result && 
        search_result) return item;
    })
  );

}




const expandedRowRender = (record) => {
  const columns0 = [
    { title: "orderId", dataIndex: "orderId", key: "orderId", width: "5%",
    render: (_, record) => (
      <Space size="middle">
      <a href="#" onClick={(e) => {
          e.preventDefault();
          openNewWindow("modifier-subscribe-order",record.orderId);
        }} > {record.orderId} </a>
      </Space>
    ),
  },
    { title: "subscribeId", dataIndex: "subscribeId", key: "subscribeId", width: "5%",
    render: (_, record) => (
      <Space size="middle">
      <a href="#" onClick={(e) => {
          e.preventDefault();
          openNewWindow("modifier-subscribe",record.subscribeId);
        }} > {record.subscribeId} </a>
      </Space>
    ),},
    { title: "deliveryId", dataIndex: "deliveryId", key: "deliveryId", width: "5%",
    render: (_, record) => (
      <Space size="middle">
      <a href="#" onClick={(e) => {
          e.preventDefault();
          openNewWindow("modifier-delivery",record.deliveryId);
        }} > {record.deliveryId} </a>
      </Space>
    ),},
    { title: "dogId", dataIndex: "dogId", key: "dogId", width: "5%",
    render: (_, record) => (
      <Space size="middle">
      <a href="#" onClick={(e) => {
          e.preventDefault();
          openNewWindow("modifier-dog",record.dogId);
        }} > {record.dogId} </a>
      </Space>
    ),},
    { title: "memberId", dataIndex: "memberId", key: "memberId", width: "5%",
    render: (_, record) => (
      <Space size="middle">
      <a href="#" onClick={(e) => {
          e.preventDefault();
          openNewWindow("modifier-member",record.memberId);
        }} > {record.memberId} </a>
      </Space>
    ),},
    { title: "merchantUid", dataIndex: "merchantUid", key: "merchantUid", },
  ];
  const columns1 = [
    { title: "견이름", dataIndex: "dogName", key: "dogName", width: "5%"},
    { title: "견성별", dataIndex: "dogGender", key: "dogGender", width: "5%"},
    { title: "견종", dataIndex: "dogType", key: "dogType", width: "5%"},
    { title: "하루당 필요 칼로리", dataIndex: "dogNeededCalorie", key: "dogNeededCalorie", },
  ];
  const columns2 = [
    { title: "팩수", dataIndex: "countPacks", key: "countPacks", width: "5%"},
    { title: "종류", dataIndex: "typeCountYYL", key: "typeCountYYL", width: "5%"},
    { title: "총량", dataIndex: "totalGramRecipes", key: "totalGramRecipes", width: "5%"},
    { title: "레시피1 개당g", dataIndex: "gramRecipe1", key: "gramRecipe1", width: "5%"},
    { title: "레시피2 개당g", dataIndex: "gramRecipe2", key: "gramRecipe2", width: "5%"},
    { title: "레시피3 개당g", dataIndex: "gramRecipe3", key: "gramRecipe3", width: "5%"},
    { title: "레시피4 개당g", dataIndex: "gramRecipe4", key: "gramRecipe4", width: "5%"},
    { title: "레시피1 총량", dataIndex: "totalGramRecipe1", key: "totalGramRecipe1", width: "5%"},
    { title: "레시피2 총량", dataIndex: "totalGramRecipe2", key: "totalGramRecipe2", width: "5%"},
    { title: "레시피3 총량", dataIndex: "totalGramRecipe3", key: "totalGramRecipe3", width: "5%"},
    { title: "레시피4 총량", dataIndex: "totalGramRecipe4", key: "totalGramRecipe4", },
  ];
  
  const columns3 = [
    { title: "팩수", dataIndex: "countPacks", key: "countPacks", width: "5%"},
    { title: "종류", dataIndex: "typeCountYYL", key: "typeCountYYL", width: "5%"},
    { title: "총량", dataIndex: "totalGramRecipes", key: "totalGramRecipes", width: "5%"},
    { title: "레시피1 개당g", dataIndex: "gramRecipe1", key: "gramRecipe1", width: "5%"},
    { title: "레시피2 개당g", dataIndex: "gramRecipe2", key: "gramRecipe2", width: "5%"},
    { title: "레시피3 개당g", dataIndex: "gramRecipe3", key: "gramRecipe3", width: "5%"},
    { title: "레시피4 개당g", dataIndex: "gramRecipe4", key: "gramRecipe4", width: "5%"},
    { title: "레시피1 총량", dataIndex: "totalGramRecipe1", key: "totalGramRecipe1", width: "5%"},
    { title: "레시피2 총량", dataIndex: "totalGramRecipe2", key: "totalGramRecipe2", width: "5%"},
    { title: "레시피3 총량", dataIndex: "totalGramRecipe3", key: "totalGramRecipe3", width: "5%"},
    { title: "레시피4 총량", dataIndex: "totalGramRecipe4", key: "totalGramRecipe4", },
  ];
  
  const columns4 = [
    { title: "견출생", dataIndex: "dogBirth", key: "dogBirth", width: "5%"},
    { title: "견출생후 달", dataIndex: "dogStartAgeMonth", key: "dogStartAgeMonth", width: "5%"},
    { title: "노견", dataIndex: "dogOldDog", key: "dogOldDog", width: "5%"},
    { title: "견크기", dataIndex: "dogSize", key: "dogSize", width: "5%"},
    { title: "견무게", dataIndex: "dogWeight", key: "dogWeight", width: "5%"},
    { title: "견상태", dataIndex: "dogStatus", key: "dogStatus", width: "5%"},
    { title: "중성화", dataIndex: "dogNeutralization", key: "dogNeutralization", },
  ];
  
  const columns5 = [
    { title: "먹을수없는음식", dataIndex: "dogInedibleFood", key: "dogInedibleFood", width: "5%"},
    { title: "먹을수없는기타", dataIndex: "dogInedibleFoodEtc", key: "dogInedibleFoodEtc", width: "5%"},
    { title: "견주의", dataIndex: "dogCaution", key: "dogCaution", width: "5%"},
    { title: "견활동레벨", dataIndex: "dogActivityLevel", key: "dogActivityLevel", width: "5%"},
    { title: "견간식수", dataIndex: "dogSnackCountLevel", key: "dogSnackCountLevel", width: "5%"},
    { title: "견주당산책수", dataIndex: "dogWalkingCountPerWeek", key: "dogWalkingCountPerWeek", width: "5%"},
    { title: "견산책당시간", dataIndex: "dogWalkingTimePerOneTime", key: "dogWalkingTimePerOneTime", },
  ];


  return (
    <div>
      <p>레시피1: STARTER PREMIUM, 레시피2: TURKEY & BEEF, 레시피3: DUCK & LAMB, 레시피4: LAMB & BEEF</p>
      <Table bordered={true} columns={columns0} dataSource={record.children0} pagination={false} />
      <Table bordered={true} columns={columns1} dataSource={record.children1} pagination={false} />
      <Table bordered={true} columns={columns2} dataSource={record.children2} pagination={false} />
      <Table bordered={true} columns={columns4} dataSource={record.children4} pagination={false} />
      <Table bordered={true} columns={columns5} dataSource={record.children5} pagination={false} />
    </div>
  );
};

const rowExpandable = (record) => record.children1?.length > 0;


const ProductList = ({ search }) => {

  console.log(search);

  const [dataBase, setDataBase] = useState([]);
  const [dateStart, setDateStart] = useState(dayjs().format("YYYYMMDDHHmm"));
  const [dateEnd, setDateEnd] = useState(dayjs().format("YYYYMMDDHHmm"));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (search) {
      const tmp_strDate = search.rangeDate[0].format("YYYYMMDDHHmm");
      const tmp_endDate = search.rangeDate[1].format("YYYYMMDDHHmm");

      if (dateStart !== tmp_strDate || dateEnd !== tmp_endDate) {
        setDateStart(tmp_strDate);
        setDateEnd(tmp_endDate);
        setIsLoading(true);

       // let link = `http://localhost:8080/subscribe/between-dates?endDate=${tmp_endDate}&startDate=${tmp_strDate}`;

        // let link = `http://localhost:8080/api/admin/new/orders/searchBetween/${tmp_strDate}/${tmp_endDate}`;

        // axios
        //   .get(link)
        //   .then(response => {
        //     console.log(response.data._embedded.newOrderDtoList)
        //     setDataBase(response.data._embedded.newOrderDtoList);
        //   })
        //   .catch(error => {
        //     console.error(error);
        //   })
        //   .finally(() => {
        //     setIsLoading(false);
        //   });


        try {
          (async () => {
            const url = `api/admin/new/orders/searchBetween/${tmp_strDate}/${tmp_endDate}`;
            const res = await getData(url);

            if(res.status === 200){
              const dataToAssign = res.data._embedded?.newOrderDtoList ?? []; // 주어진 데이터
              //console.log(dataToAssign)
              setDataBase(dataToAssign); // 데이터베이스에 할당
              setIsLoading(false);
            }

              // if (res.status === 200) {
              //   const data = res.data;
              //   const orderItemInfoList = data.orderItemAndOptionDtoList.map((l) => l.orderItemDto);
              //   setAllData((prevDataList) =>
              //     prevDataList.map((data) =>
              //       data.id === orderId ? { ...data, orderItemInfoList } : data,
              //     ),
              //   );
              // }
          })();
        } catch (err) {
          console.error(err);
        }
        


      }
    }
  }, [search]);

  
  if (isLoading) {
    return (
      <div>
        <Alert message="로딩 중입니다." description="잠시만 기다려주세요." type="info" showIcon />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
          <Spin size="large" />
        </div>
      </div>
    )
  }


  //const filteredData = filterDataSubscribe(dataBase, search);

  console.log(dataBase)


  const datatmp_subscribe = (inputData) => {
    
  return (inputData.map((item) => {
    return {
      "주문번호": item.orderNumber,
      "주문상태": item.state,
      "구독상태": item.subscription,
      "묶음배송": item.isPackage,
      "구매자": item.orderMemberName,
      "수령자": item.orderRecivedName,
      "견종": item.children1[0].dogType,
      "견명": item.children1[0].dogName,
      "브로셔": item.memberIsBrochure,
      "팩수": item.children2[0].countPacks,
      "종류": item.children2[0].typeCountYYL,
      "레시피 총량": item.children2[0].totalGramRecipes,
      "레시피1 개당g": item.children2[0].gramRecipe1,
      "레시피2 개당g": item.children2[0].gramRecipe2,
      "레시피3 개당g": item.children2[0].gramRecipe3,
      "레시피4 개당g": item.children2[0].gramRecipe4,
      "레시피1 총량": item.children2[0].totalGramRecipe1,
      "레시피2 총량": item.children2[0].totalGramRecipe2,
      "레시피3 총량": item.children2[0].totalGramRecipe3,
      "레시피4 총량": item.children2[0].totalGramRecipe4,
      "(석범)레시피 총량": item.children3[0].totalGramRecipes,
      "(석범)레시피1 개당g": item.children3[0].gramRecipe1,
      "(석범)레시피2 개당g": item.children3[0].gramRecipe2,
      "(석범)레시피3 개당g": item.children3[0].gramRecipe3,
      "(석범)레시피4 개당g": item.children3[0].gramRecipe4,
      "(석범)레시피1 총량": item.children3[0].totalGramRecipe1,
      "(석범)레시피2 총량": item.children3[0].totalGramRecipe2,
      "(석범)레시피3 총량": item.children3[0].totalGramRecipe3,
      "(석범)레시피4 총량": item.children3[0].totalGramRecipe4,
      "결제일": item.paymentDate,
      "개인정보수정일": item.memberModifiedDate,
      "배송주기(일)": item.deliveryInterval,
      "누적 배송수": item.memberAccumulatedSubscribe,
      "다음 결제일": item.nextPaymentDate,
      "다음 결제액": item.nextPaymentPrice,
      "견 성별": item.children1[0].dogGender,
      "견 출생": item.children4[0].dogBirth,
      "노령": item.children4[0].dogOldDog,
      "소 중 대": item.children4[0].dogSize,
      "견 무게": item.children4[0].dogWeight,
      "중성화": item.children4[0].dogNeutralization,
      "활동량(1~5)": item.children5[0].dogActivityLevel,
      "산책(1주당)": item.children5[0].dogWalkingCountPerWeek,
      "산책(1회당,분)": item.children5[0].dogWalkingTimePerOneTime,
      "상태": item.children4[0].dogStatus,
      "간식(1~3)": item.children5[0].dogSnackCountLevel,
      "못먹는 음식": item.children5[0].dogInedibleFood,
      "못먹는 기타": item.children5[0].dogInedibleFoodEtc,
      "기타(질병)": item.children5[0].dogCaution,
      "첫 결제일": item.memberFirstPaymentDate,
      "연락처": item.memberPhoneNumber,
      "성별": item.memberGender,
      "생년월일": item.memberBirthday,
      "이메일": item.memberEmail,
      "주소": item.deliveryStreet,
      "요청사항": item.deliveryRequest,
    }
    }));

  }

  
  const datatmp_general = (inputData) => {
    
    return (inputData.map((item) => {
      return {
        "주문번호": item.orderNumber,
        "주문상태": item.state,
        "묶음배송": item.isPackage,
        "구매자": item.orderMemberName,
        "수령자": item.orderRecivedName,
        "결제일": item.paymentDate,
        "물품이름": item.productName,
        "수량": item.amount,
        "결제금액": item.paymentPrice,
        "첫 결제일": item.memberFirstPaymentDate,
        "누적 결제금액": item.memberAccumulatedamount,
        "생년월일": item.memberBirthday,
        "성별": item.memberGender,
        "이메일": item.memberEmail,
        "연락처": item.memberPhoneNumber,
        "주소": item.deliveryStreet,
        "요청사항": item.deliveryRequest,

      }
      }));
  
    }
    


  // export excel
  const downloadExcel = (inputData) => {

    let datas = [];
    if(search.searchTypeGenOrSub === "general"){
      datas = datatmp_general(inputData)
    }
    else if(search.searchTypeGenOrSub === "subscribe"){
      datas = datatmp_subscribe(inputData)
    }
    const ws = xlsx.utils.json_to_sheet(datas);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "SheetJS");
    xlsx.writeFile(wb, "sheetjs.xlsx");
  };










  let filteredData = [];
  if(search.searchTypeGenOrSub === "general"){
    filteredData = filterDataGeneral(dataBase, search);

    return (
      <div className="px-8 pt-5">
        <>
          <Button disabled={true}>일괄수정</Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadExcel(filteredData)}
          >
            액셀 다운로드
          </Button>
        </>

        <>
          <Table
            bordered={true}
            // rowSelection={{
            //   type: "checkbox",
            // }}
            columns={columns_general}
            dataSource={filteredData}
            scroll={{
              x: 4500,
              y: 1500,
            }}
          />
          ;
        </>
      </div>
    );
  }
  else if(search.searchTypeGenOrSub === "subscribe"){
    filteredData = filterDataSubscribe(dataBase, search);
    
    return (
      <div className="px-8 pt-5">
        <>
          <Button disabled={true}>일괄수정</Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadExcel(filteredData)}
          >
            액셀 다운로드
          </Button>
        </>

        <>
          <Table
            bordered={true}
            // rowSelection={{
            //   type: "checkbox",
            // }}
            columns={columns}
            dataSource={filteredData}
            expandable={{expandedRowRender, rowExpandable }}
            scroll={{
              x: 4500,
              y: 1500,
            }}
          />
        </>
      </div>
    );
  }





};

export default React.memo(ProductList);
