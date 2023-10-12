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
          openNewWindow("modifier-dog",record.dogId);
        }} > {record.dogId} 수정 </a>
      </Space>
    ),
  },
  { title: "생성날짜", dataIndex: "createdDate", key: "createdDate", },
  { title: "수정날짜", dataIndex: "modifiedDate", key: "modifiedDate", },
  { title: "이름", dataIndex: "name", key: "name", },
  { title: "성별", dataIndex: "gender", key: "gender", },
  { title: "생일", dataIndex: "birth", key: "birth", },
  { title: "견종", dataIndex: "dogType", key: "dogType", },
  { title: "무게", dataIndex: "weight", key: "weight", },
  { title: "사이즈", dataIndex: "dogSize", key: "dogSize", },
  { title: "상태", dataIndex: "dogStatus", key: "dogStatus", },
  { title: "바프독 등록 시점시, 강아지 나이(개월 수)", dataIndex: "startAgeMonth", key: "startAgeMonth", },
  { title: "대표견여부", dataIndex: "representative", key: "representative", },
  { title: "노령견 여부", dataIndex: "oldDog", key: "oldDog", },
  { title: "중성화 여부", dataIndex: "neutralization", key: "neutralization", },
  { title: "활동량", dataIndex: "activityLevel", key: "activityLevel", },
  { title: "산책 횟수", dataIndex: "walkingCountPerWeek", key: "walkingCountPerWeek", },
  { title: "산책 시간", dataIndex: "walkingTimePerOneTime", key: "walkingTimePerOneTime", },
  { title: "간식 횟수", dataIndex: "snackCountLevel", key: "snackCountLevel", },
  { title: "못 먹는 음식", dataIndex: "inedibleFood", key: "inedibleFood", },
  { title: "못 먹는 음식 기타", dataIndex: "inedibleFoodEtc", key: "inedibleFoodEtc", },
  { title: "질병 및 주의사항", dataIndex: "caution", key: "caution", },
  { title: "삭제여부", dataIndex: "deleted", key: "deleted", },
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
              const url = `api/admin/new/dog/searchBetween/${tmp_strDate}/${tmp_endDate}`;
              const res = await getData(url);

              console.log(res)
  
              if(res?.status === 200){
                const dataToAssign = res.data._embedded?.dogAdminDtoList ?? []; // 주어진 데이터

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

        dogId: data_tmp.dogId,
        createdDate: data_tmp.createdDate,
        modifiedDate: data_tmp.modifiedDate,
        deleted: data_tmp.deleted=== true ? "YES" : "NO",
        representative: data_tmp.representative=== true ? "YES" : "NO",
        name: data_tmp.name,
        gender: data_tmp.gender,
        birth: data_tmp.birth,
        startAgeMonth: data_tmp.startAgeMonth,
        oldDog: data_tmp.oldDog=== true ? "YES" : "NO",
        dogType: data_tmp.dogType,
        dogSize: data_tmp.dogSize,
        weight: data_tmp.weight,
        neutralization: data_tmp.neutralization=== true ? "YES" : "NO",
        activityLevel: data_tmp.activityLevel,
        walkingCountPerWeek: data_tmp.walkingCountPerWeek,
        walkingTimePerOneTime: data_tmp.walkingTimePerOneTime,
        dogStatus: data_tmp.dogStatus,
        snackCountLevel: data_tmp.snackCountLevel,
        inedibleFood: data_tmp.inedibleFood,
        inedibleFoodEtc: data_tmp.inedibleFoodEtc,
        caution: data_tmp.caution,
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


  
        return item;
      })
    );
  
  
  
  
  
  }





  const datatmp_general = (inputData) => {
    
    return (inputData.map((item) => {
      return {
              
        "생성날짜" : item.createdDate,
        "수정날짜" : item.modifiedDate,
        "이름" : item.name,
        "성별" : item.gender,
        "생일" : item.birth,
        "견종" : item.dogType,
        "무게" : item.weight,
        "사이즈" : item.dogSize,
        "상태" : item.dogStatus,
        "바프독 등록 시점시, 강아지 나이(개월 수)" : item.startAgeMonth,
        "대표견여부" : item.representative,
        "노령견 여부" : item.oldDog,
        "중성화 여부" : item.neutralization,
        "활동량" : item.activityLevel,
        "산책 횟수" : item.walkingCountPerWeek,
        "산책 시간" : item.walkingTimePerOneTime,
        "간식 횟수" : item.snackCountLevel,
        "못 먹는 음식" : item.inedibleFood,
        "못 먹는 음식 기타" : item.inedibleFoodEtc,
        "질병 및 주의사항" : item.caution,
        "삭제여부" : item.deleted,


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




  console.log(dataBase)
    
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
