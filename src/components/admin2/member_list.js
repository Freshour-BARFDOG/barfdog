import React, { useState, useEffect } from "react";
import {
  Alert,
  Table,
  Spin,
  Space,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";

import { getData, postData, postObjData, putObjData } from '../../pages/api/reqData';

const columns = [
  Table.SELECTION_COLUMN,
  {
    title: "",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>수정</a>
        <a>삭제</a>
      </Space>
    ),
  },
  { title: "고유번호", dataIndex: "id", key: "id", },
  { title: "생성날짜", dataIndex: "createdDate", key: "createdDate", },
  { title: "수정날짜", dataIndex: "modifiedDate", key: "modifiedDate", },
  { title: "누적구입량", dataIndex: "accumulatedamount", key: "accumulatedamount", },
  { title: "누적구독량", dataIndex: "accumulatedSubscribe", key: "accumulatedSubscribe", },
  { title: "주소(시)", dataIndex: "city", key: "city", },
  { title: "상세주소", dataIndex: "detailAddress", key: "detailAddress", },
  { title: "길주소", dataIndex: "street", key: "street", },
  { title: "우편번호", dataIndex: "zipcode", key: "zipcode", },
  { title: "14살 이상", dataIndex: "over14yearsOld", key: "over14yearsOld", },
  { title: "이메일 수락", dataIndex: "receiveEmail", key: "receiveEmail", },
  { title: "SMS 수락", dataIndex: "receiveSms", key: "receiveSms", },
  { title: "생년월일", dataIndex: "birthday", key: "birthday", },
  { title: "이메일", dataIndex: "email", key: "email", },
  { title: "첫 지불날짜", dataIndex: "firstPaymentDate", key: "firstPaymentDate", },
  { title: "수령동의", dataIndex: "receiveAgree", key: "receiveAgree", },
  { title: "추천인", dataIndex: "recommend", key: "recommend", },
  { title: "성별", dataIndex: "gender", key: "gender", },
  { title: "등급", dataIndex: "grade", key: "grade", },
  { title: "브로셔", dataIndex: "isBrochure", key: "isBrochure", },
  { title: "고정등급", dataIndex: "isFixedGrade", key: "isFixedGrade", },
  { title: "지불", dataIndex: "isPaid", key: "isPaid", },
  { title: "구독", dataIndex: "isSubscribe", key: "isSubscribe", },
  { title: "취소", dataIndex: "isWithdrawal", key: "isWithdrawal", },
  { title: "마지막 로그인 날짜", dataIndex: "lastLoginDate", key: "lastLoginDate", },
  { title: "나의 추천코드", dataIndex: "myRecommendationCode", key: "myRecommendationCode", },
  { title: "이름", dataIndex: "name", key: "name", },
  { title: "핸드폰", dataIndex: "phoneNumber", key: "phoneNumber", },
  { title: "제공자", dataIndex: "provider", key: "provider", },
  //{ title: "제공자 아이디", dataIndex: "providerId", key: "providerId", },
  { title: "추천코드", dataIndex: "recommendCode", key: "recommendCode", },
  { title: "보상", dataIndex: "reward", key: "reward", },
  { title: "역할", dataIndex: "roles", key: "roles", },
];


const filterData = (data, search) => {

  
  let defaultData = [];

  if (!search) return defaultData;
  if (!search.rangeDate) return defaultData;


  //for(let i = 0; i < data.length; i++) {
  for(let i = data.length-1; i>=0; --i) {
    const data_tmp = data[i];
    defaultData.push({
      key: i.toString(),
      id: data_tmp.id,
      createdDate: data_tmp.createdDate,
      modifiedDate: data_tmp.modifiedDate,
      accumulatedamount: data_tmp.accumulatedamount,
      accumulatedSubscribe: data_tmp.accumulatedSubscribe,
      city: data_tmp.city,
      detailAddress: data_tmp.detailAddress,
      street: data_tmp.street,
      zipcode: data_tmp.zipcode,
      over14yearsOld: data_tmp.over14yearsOld=== true ? "YES" : "NO",
      receiveEmail: data_tmp.receiveEmail=== true ? "YES" : "NO",
      receiveSms: data_tmp.receiveSms=== true ? "YES" : "NO",
      birthday: data_tmp.birthday,
      email: data_tmp.email,
      firstPaymentDate: data_tmp.firstPaymentDate,
      receiveAgree: data_tmp.receiveAgree=== true ? "YES" : "NO",
      recommend: data_tmp.recommend,
      gender: data_tmp.gender,
      grade: data_tmp.grade,
      isBrochure: data_tmp.isBrochure=== true ? "YES" : "NO",
      isFixedGrade: data_tmp.isFixedGrade=== true ? "YES" : "NO",
      isPaid: data_tmp.isPaid=== true ? "YES" : "NO",
      isSubscribe: data_tmp.isSubscribe=== true ? "YES" : "NO",
      isWithdrawal: data_tmp.isWithdrawal=== true ? "YES" : "NO",
      lastLoginDate: data_tmp.lastLoginDate,
      myRecommendationCode: data_tmp.myRecommendationCode,
      name: data_tmp.name,
      phoneNumber: data_tmp.phoneNumber,
      provider: data_tmp.provider,
      providerId: data_tmp.providerId,
      recommendCode: data_tmp.recommendCode,
      reward: data_tmp.reward,
      roles: data_tmp.roles,
    });

  }

  return defaultData;
}

export default function MemberList({ search }) {

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
        // let link = `http://localhost:8080/members/between-dates?endDate=${tmp_endDate}&startDate=${tmp_strDate}`;
        // //let link = `http://localhost:8080/api/admin/new/orders/searchBetween/${tmp_strDate}/${tmp_endDate}`;

        // axios
        //   .get(link)
        //   .then(response => {
        //     setDataBase(response.data);
        //   })
        //   .catch(error => {
        //     console.error(error);
        //   })
        //   .finally(() => {
        //     setIsLoading(false);
        //   });


          try {
            (async () => {
              const url = `members/between-dates?endDate=${tmp_endDate}&startDate=${tmp_strDate}`;
              const res = await getData(url);
  
              if(res.status === 200){
                const dataToAssign = res.data ?? []; // 주어진 데이터
                setDataBase(dataToAssign); // 데이터베이스에 할당
                setIsLoading(false);
              }
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

    
  let filteredData = filterData(dataBase, search);


  return (
    <div className="px-8 pt-5">
      <>
        <Table
          bordered={true}
          rowSelection={{
            type: "checkbox",
          }}
          columns={columns}
          dataSource={filteredData}
          scroll={{
            x: 4500,
            y: 1500,
          }}
        />
      </>
    </div>
  );




};
