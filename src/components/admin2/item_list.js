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
  { title: "고유번호", dataIndex: "itemId", key: "itemId", },
  { title: "생성날짜", dataIndex: "createdDate", key: "createdDate", },
  { title: "수정날짜", dataIndex: "modifiedDate", key: "modifiedDate", },
  { title: "무료배달", dataIndex: "deliveryFree", key: "deliveryFree", },
  { title: "할인율", dataIndex: "discountDegree", key: "discountDegree", },
  { title: "할인타입", dataIndex: "discountType", key: "discountType", },
  { title: "재고", dataIndex: "inStock", key: "inStock", },
  { title: "삭제", dataIndex: "isDeleted", key: "isDeleted", },
  { title: "품목타입", dataIndex: "itemType", key: "itemType", },
  { title: "이름", dataIndex: "name", key: "name", },
  { title: "원래가격", dataIndex: "originalPrice", key: "originalPrice", },
  { title: "남은량", dataIndex: "remaining", key: "remaining", },
  { title: "세일가격", dataIndex: "salePrice", key: "salePrice", },
  { title: "상태", dataIndex: "status", key: "status", },
  { title: "전체 판매량", dataIndex: "totalSalesAmount", key: "totalSalesAmount", },
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
      itemId: data_tmp.id,
      createdDate: data_tmp.createdDate,
      modifiedDate: data_tmp.modifiedDate,
      deliveryFree: data_tmp.deliveryFree === true ? "YES" : "NO",
      discountDegree: data_tmp.discountDegree,
      discountType: data_tmp.discountType,
      inStock: data_tmp.inStock === true ? "YES" : "NO",
      isDeleted: data_tmp.isDeleted === true ? "YES" : "NO",
      itemType: data_tmp.itemType,
      name: data_tmp.name,
      originalPrice: data_tmp.originalPrice,
      remaining: data_tmp.remaining,
      salePrice: data_tmp.salePrice,
      status: data_tmp.status,
      totalSalesAmount: data_tmp.totalSalesAmount,
    });
  }

  return defaultData;
}

export default function ItemList({ search }) {

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
        // let link = `http://localhost:8080/items/between-dates?endDate=${tmp_endDate}&startDate=${tmp_strDate}`;

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
              const url = `items/between-dates?endDate=${tmp_endDate}&startDate=${tmp_strDate}`;
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
            x: 2500,
            y: 1500,
          }}
        />
      </>
    </div>
  );




};
