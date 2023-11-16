import React, { useState, useEffect } from "react";
import {
  Alert,
  Table,
  Spin,
  Space,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";

import { getData, postData, postObjData, putObjData } from '../api/reqData';

const columns = [
  Table.SELECTION_COLUMN,
  {
    title: '상세보기',
    key: 'detail',
    render: (text, record) => (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          openNewWindow(record.key);
        }}
      >
        View Details
      </a>
    ),
  },
  { title: "고유번호", dataIndex: "id", key: "id", },
];

const openNewWindow = (key) => {
  // 새 창을 열기 위한 로직을 구현합니다.
  const url = `/bf-admin2/modifier-details/${key}`; // 예시 URL
  const subWindow = window.open(url, '_blank', 'width=1000,height=1000');
  if (subWindow) {
    subWindow.focus();
  } else {
    alert('Subwindow blocked. Please allow pop-ups and try again.');
  }
};


const filterData = (data, search) => {

  
  let defaultData = [];

  defaultData.push({
    key: 0,
    id: 0,
  })


  return defaultData;
}

export default function MemberList({ search }) {

  // console.log(search);

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
      //   let link = `http://localhost:8080/members/between-dates?endDate=${tmp_endDate}&startDate=${tmp_strDate}`;

      //   axios
      //     .get(link)
      //     .then(response => {
      //       setDataBase(response.data);
      //     })
      //     .catch(error => {
      //       console.error(error);
      //     })
      //     .finally(() => {
      //       setIsLoading(false);
      //     });
      // }



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
          // rowSelection={{
          //   type: "checkbox",
          // }}
          columns={columns}
          dataSource={filteredData}
          // scroll={{
          //   x: 500,
          //   y: 1500,
          // }}
        />
      </>
    </div>
  );




};
