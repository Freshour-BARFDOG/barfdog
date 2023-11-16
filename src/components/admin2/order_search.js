import { Divider, DatePicker, Space, Form, Input, Button, Checkbox, Select, Typography, Radio } from "antd"
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import DateRangeField from "./date-range";
import { useState } from 'react';
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { CustomCheck } from '/src/components/atoms/Checkbox';

const { RangePicker } = DatePicker;

const statusOptions = [
    { label: "전체", value: "ALL" },
    { label: "예약결제", value: "RESERVED_PAYMENT" },
    { label: "결제전", value: "BEFORE_PAYMENT" },
    { label: "생산중", value: "PRODUCING" },
    { label: "구매자귀책 취소완료", value: "CANCEL_DONE_BUYER" },
    { label: "예약된 주문 결제취소", value: "CANCEL_RESERVED_PAYMENT" },
    { label: "결제실패", value: "FAILED" },
    { label: "결제완료", value: "PAYMENT_DONE" },
    { label: "보류", value: "HOLD" },
    { label: "주문 취소 요청", value: "CANCEL_REQUEST" },
    { label: "주문 반품 요청", value: "RETURN_REQUEST" },
    { label: "판매자귀책 반품완료", value: "RETURN_DONE_SELLER" },
    { label: "구매자귀책 반품완료", value: "RETURN_DONE_BUYER" },
    { label: "주문 교환요청", value: "EXCHANGE_REQUEST" },
    { label: "판매자귀책 교환완료", value: "EXCHANGE_DONE_SELLER" },
    { label: "구매자귀책 교환완료", value: "EXCHANGE_DONE_BUYER" },
    
    // 일반구매 관련
    { label: "결제취소", value: "CANCEL_PAYMENT" },
    { label: "판매자귀책 취소완료", value: "CANCEL_DONE_SELLER" },
    { label: "배송출발", value: "DELIVERY_START" },
    { label: "배송확인", value: "DELIVERY_BEFORE_COLLECTION" },
    { label: "구매확정", value: "CONFIRM" },
    { label: "배송완료", value: "DELIVERY_DONE" },
    { label: "배송준비", value: "DELIVERY_READY" },
    { label: "최초결제실패", value: "FAILED_RESERVED_PAYMENT" },
];


const statusSubscribe = [
    { label: "구독중", value: "SUBSCRIBING" },
    { label: "구독전(결제전)", value: "BEFORE_PAYMENT" },
    { label: "구독보류", value: "SUBSCRIBE_PENDING" },
    { label: "어드민", value: "ADMIN" },
];

const statusGrade = [
    { label: "브론즈", value: "브론즈" },
    { label: "실버", value: "실버" },
    { label: "골드", value: "골드" },
    { label: "플래티넘", value: "플래티넘" },
    { label: "다이아몬드", value: "다이아몬드" },
    { label: "더바프", value: "더바프" },
];



export default function ProductSearch({ onSearch }) {

    const router = useRouter();
    //// console.log("2222222")
    //// console.log("2222222")

    const onFinish = (values) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, ...values },
        });
        onSearch(values);
    };


    return(
        <Form onFinish={onFinish}>
            <div
                className=
                "px-8 pt-5">
                <Space direction="vertical"
                    className=
                    "px-8 my-5 bg-gray-100 rounded-lg pt-5 pb-2 block sm:grid gap-x-3 border border-gray-200" 
                >
                    <Space direction="horizontal" className="pt-3">
                        <Form.Item name="rangeDateChoice" initialValue="created" 
                        label="데이터 로드, 기간(등록일): ">
                        {/* <Select style={{ width: 100 }}>
                            <Select.Option value="created">등록일</Select.Option>
                            <Select.Option value="updated">수정일</Select.Option>
                        </Select> */}
                        </Form.Item>
                        <Form.Item name="rangeDate" initialValue={[dayjs('2000-01-01T00:00:00'), dayjs()]}>
                        <DateRangeField />
                        </Form.Item>
                    </Space>
                    <Space direction="horizontal">
                        <Form.Item name="searchTypeGenOrSub" 
                        initialValue={"general"}
                        label="구매조건: ">
                            <Radio.Group >
                                <Radio value={"general"}>일반구매</Radio>
                                <Radio value={"subscribe"}>구독구매</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Space>
                    <Space direction="horizontal">
                        <Form.Item name="orderState" 
                        initialValue={statusOptions.map((e)=>(e.value))}
                        label="판매상태: ">
                        <CustomCheck options={statusOptions} />
                        </Form.Item>
                    </Space>
                    <Space direction="horizontal" >
                        <Form.Item name="subscribeState" 
                        initialValue={statusSubscribe.map((e)=>(e.value))} 
                        label="구독상태: ">
                        <CustomCheck options={statusSubscribe} />
                        </Form.Item>
                        <Form.Item className="mx-5"
                        name="gradeState" 
                        initialValue={statusGrade.map((e)=>(e.value))} 
                        label="등급: ">
                        <CustomCheck options={statusGrade} />
                        </Form.Item>
                    </Space>
                    <Space direction="horizontal">
                        <Form.Item name="searchType" label="검색조건" initialValue="orderMemberName" 
                            style={{width: 200,}}>
                            <Select popupMatchSelectWidth={false}>
                                <Select.Option value="orderMemberName">구매자</Select.Option>
                                <Select.Option value="orderDeliveryName">수령자</Select.Option>
                                <Select.Option value="orderDogName">견명</Select.Option>
                                <Select.Option value="orderMemberEmail">이메일</Select.Option>
                                <Select.Option value="orderNumber">주문번호</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="searchText" className="grow">
                            <Input placeholder="검색어를 입력해주세요" />
                        </Form.Item>
                    </Space>
                </Space>
            </div>
            <div className="flex justify-center gap-2">
                <Button 
                icon={<SearchOutlined /> }
                htmlType="submit"
                >검색</Button>
            </div>
        </Form>
    )

}