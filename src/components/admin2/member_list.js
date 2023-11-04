import React, { useState, useEffect } from "react";
import {
  Alert,
  Table,
  Spin,
  Button,
  Space,
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
  Table.SELECTION_COLUMN,
  {
    title: "DB고유번호", 
    render: (_, record) => (
      <Space size="middle">
      <a href="#" onClick={(e) => {
          e.preventDefault();
          openNewWindow("modifier-member",record.memberId);
        }} > {record.memberId} 수정 </a>
      </Space>
    ),
  },
  { title: "생성날짜", dataIndex: "createdDate", key: "createdDate", },
  { title: "수정날짜", dataIndex: "modifiedDate", key: "modifiedDate", },
  { title: "마지막 로그인 날짜", dataIndex: "lastLoginDate", key: "lastLoginDate", },
  { title: "구독 유무", dataIndex: "subscribe", key: "subscribe", },
  { title: "이름", dataIndex: "name", key: "name", },
  { title: "이메일", dataIndex: "email", key: "email", },
  { title: "전화번호", dataIndex: "phoneNumber", key: "phoneNumber", },
  { title: "우편번호", dataIndex: "zipcode", key: "zipcode", },
  { title: "도시", dataIndex: "city", key: "city", },
  { title: "거리", dataIndex: "street", key: "street", },
  { title: "상세주소", dataIndex: "detailAddress", key: "detailAddress", },
  { title: "생년월일", dataIndex: "birthday", key: "birthday", },
  { title: "성별", dataIndex: "gender", key: "gender", },
  { title: "서비스 이용약관", dataIndex: "servicePolicy", key: "servicePolicy", },
  { title: "개인정보 수집 및 이용", dataIndex: "privacyPolicy", key: "privacyPolicy", },
  { title: "SMS 수신동의", dataIndex: "receiveSms", key: "receiveSms", },
  { title: "이메일 수신동의", dataIndex: "receiveEmail", key: "receiveEmail", },
  { title: "만 14세 이상", dataIndex: "over14yearsOld", key: "over14yearsOld", },
  { title: "추천인 코드", dataIndex: "recommendCode", key: "recommendCode", },
  { title: "내 추천 코드", dataIndex: "myRecommendationCode", key: "myRecommendationCode", },
  { title: "등급", dataIndex: "grade", key: "grade", },
  { title: "리워드", dataIndex: "reward", key: "reward", },
  { title: "첫 결제일", dataIndex: "firstPaymentDate", key: "firstPaymentDate", },
  { title: "누적 금액", dataIndex: "accumulatedAmount", key: "accumulatedAmount", },
  { title: "누적 구독", dataIndex: "accumulatedSubscribe", key: "accumulatedSubscribe", },
  { title: "비밀번호 설정 필요", dataIndex: "needToSetPassword", key: "needToSetPassword", },
  { title: "다른사람 추천 유무", dataIndex: "recommend", key: "recommend", },
  { title: "SNS/이메일 수신동의", dataIndex: "receiveAgree", key: "receiveAgree", },
  { title: "권한", dataIndex: "roles", key: "roles", },
  { title: "가입 포털", dataIndex: "provider", key: "provider", },
  { title: "가입 포털 코드", dataIndex: "providerId", key: "providerId", },
  { title: "임시 비밀번호 유무", dataIndex: "temporaryPassword", key: "temporaryPassword", },
  { title: "구매유무", dataIndex: "paid", key: "paid", },
  { title: "브로셔", dataIndex: "brochure", key: "brochure", },
  { title: "탈퇴여부", dataIndex: "withdrawal", key: "withdrawal", },
  { title: "관리자 수정 유무", dataIndex: "fixedGrade", key: "fixedGrade", },
];



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
              const url = `api/admin/new/members/searchBetween/${tmp_strDate}/${tmp_endDate}`;
              const res = await getData(url);

              // console.log(res)
  
              if(res?.status === 200){
                const dataToAssign = res.data._embedded?.memberAdminDtoList ?? []; // 주어진 데이터

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





  const filterData = (data, search) => {

  
    let defaultData = [];
  
    if (!search) return defaultData;
    if (!search.rangeDate) return defaultData;
  
  
    //for(let i = 0; i < data.length; i++) {
    for(let i = data.length-1; i>=0; --i) {
      const data_tmp = data[i];
      defaultData.push({
        key: i.toString(),
        memberId: data_tmp.memberId,
        createdDate: data_tmp.createdDate,
        modifiedDate: data_tmp.modifiedDate,
        lastLoginDate: data_tmp.lastLoginDate,
        subscribe: data_tmp.subscribe=== true ? "YES" : "NO",
        name: data_tmp.name,
        email: data_tmp.email,
        phoneNumber: data_tmp.phoneNumber,
        zipcode: data_tmp.zipcode,
        city: data_tmp.city,
        street: data_tmp.street,
        detailAddress: data_tmp.detailAddress,
        birthday: data_tmp.birthday,
        gender: data_tmp.gender,
        servicePolicy: data_tmp.servicePolicy=== true ? "YES" : "NO",
        privacyPolicy: data_tmp.privacyPolicy=== true ? "YES" : "NO",
        receiveSms: data_tmp.receiveSms=== true ? "YES" : "NO",
        receiveEmail: data_tmp.receiveEmail=== true ? "YES" : "NO",
        over14yearsOld: data_tmp.over14yearsOld=== true ? "YES" : "NO",
        recommendCode: data_tmp.recommendCode,
        myRecommendationCode: data_tmp.myRecommendationCode,
        grade: data_tmp.grade,
        reward: data_tmp.reward,
        firstPaymentDate: data_tmp.firstPaymentDate,
        accumulatedAmount: data_tmp.accumulatedAmount,
        accumulatedSubscribe: data_tmp.accumulatedSubscribe,
        needToSetPassword: data_tmp.needToSetPassword=== true ? "YES" : "NO",
        recommend: data_tmp.recommend=== true ? "YES" : "NO",
        receiveAgree: data_tmp.receiveAgree=== true ? "YES" : "NO",
        roles: data_tmp.roles,
        provider: data_tmp.provider,
        //providerId: data_tmp.providerId,
        temporaryPassword: data_tmp.temporaryPassword=== true ? "YES" : "NO",
        paid: data_tmp.paid=== true ? "YES" : "NO",
        brochure: data_tmp.brochure=== true ? "YES" : "NO",
        withdrawal: data_tmp.withdrawal=== true ? "YES" : "NO",
        fixedGrade: data_tmp.fixedGrade=== true ? "YES" : "NO",
      });
  
    }
  
  
  
  
  
  
    return (
      defaultData
      .filter((item) => {
  
        // 등급
        let grade_result = false;
        const grad_array = ["브론즈","실버","골드","플래티넘","다이아몬드","더바프"];
        grad_array.forEach((e) => {
          if (search.gradeState.includes(e) && !grade_result && item.grade) {
            grade_result = item.grade.includes(e);
          }
        });
        
        // 등급
        let subscribe_result = false;
        if (search.subscribeState.includes("YES") && !subscribe_result) {
          if(item.subscribe === "YES") subscribe_result = true;
        }
        if (search.subscribeState.includes("NO") && !subscribe_result) {
          if(item.subscribe === "NO") subscribe_result = true;
        }
        
      // 검색조건

      let search_result = false;
      if(search.searchText){
        if (search.searchType.includes("name") && item.name) {
          search_result = item.name.includes(search.searchText);
        }
        else if (search.searchType.includes("email")&& item.email) {
          search_result = item.email.includes(search.searchText);
        }
        else if (search.searchType.includes("memberId")&& item.memberId) {
          search_result = item.memberId.includes(search.searchText);
        }
      } else { 
        search_result = true; 
      }


  
        if (
          grade_result &&
          search_result &&
          subscribe_result) return item;
      })
    );
  
  
  
  
  
  }





  const datatmp_general = (inputData) => {
    
    return (inputData.map((item) => {
      return {
              
        "생성날짜" : item.createdDate,
        "수정날짜" : item.modifiedDate,
        "마지막 로그인 날짜" : item.lastLoginDate,
        "구독 유무" : item.subscribe,
        "이름" : item.name,
        "이메일" : item.email,
        "전화번호" : item.phoneNumber,
        "우편번호" : item.zipcode,
        "도시" : item.city,
        "거리" : item.street,
        "상세주소" : item.detailAddress,
        "생년월일" : item.birthday,
        "성별" : item.gender,
        "서비스 이용약관" : item.servicePolicy,
        "개인정보 수집 및 이용" : item.privacyPolicy,
        "SMS 수신동의" : item.receiveSms,
        "이메일 수신동의" : item.receiveEmail,
        "만 14세 이상" : item.over14yearsOld,
        "추천인 코드" : item.recommendCode,
        "내 추천 코드" : item.myRecommendationCode,
        "등급" : item.grade,
        "리워드" : item.reward,
        "첫 결제일" : item.firstPaymentDate,
        "누적 금액" : item.accumulatedAmount,
        "누적 구독" : item.accumulatedSubscribe,
        "비밀번호 설정 필요" : item.needToSetPassword,
        "다른사람 추천 유무" : item.recommend,
        "SNS/이메일 수신동의" : item.receiveAgree,
        "권한" : item.roles,
        "가입 포털" : item.provider,
        "가입 포털 코드" : item.providerId,
        "임시 비밀번호 유무" : item.temporaryPassword,
        "구매유무" : item.paid,
        "브로셔" : item.brochure,
        "탈퇴여부" : item.withdrawal,
        "관리자 수정 유무" : item.fixedGrade,


      }
      }));
  
    }
    


  // export excel
  const downloadExcel = (inputData) => {

    let datas = [];
    datas = datatmp_general(inputData)
    const ws = xlsx.utils.json_to_sheet(datas);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "SheetJS");
    xlsx.writeFile(wb, "sheetjs.xlsx");
  };




  // console.log(dataBase)
    
  let filteredData = filterData(dataBase, search);


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
