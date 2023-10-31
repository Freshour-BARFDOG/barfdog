import { Space, Form, Input, Button, Checkbox, Select,  } from "antd"
import { SearchOutlined } from '@ant-design/icons';
import DateRangeField from "./date-range";
import dayjs from "dayjs";
import { useRouter } from "next/router";


const gradeState = [
    { label: "브론즈", value: "브론즈" },
    { label: "실버", value: "실버" },
    { label: "골드", value: "골드" },
    { label: "플래티넘", value: "플래티넘" },
    { label: "다이아몬드", value: "다이아몬드" },
    { label: "더바프", value: "더바프" },
];


const subscribeState = [
    { label: "YES", value: "YES" },
    { label: "NO", value: "NO" },
];


export default function MemberSearch({ onSearch }) {

    const router = useRouter();

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
                        </Form.Item>
                        <Form.Item name="rangeDate" initialValue={[dayjs('2000-01-01T00:00:00'), dayjs()]}>
                            <DateRangeField />
                        </Form.Item>
                    </Space>
                    <Space direction="horizontal" >
                        <Form.Item className="mx-5"
                        name="gradeState" 
                        initialValue={gradeState.map((e)=>(e.value))} 
                        label="등급: ">
                        <Checkbox.Group options={gradeState} />
                        </Form.Item>
                    </Space>
                    <Space direction="horizontal" >
                        <Form.Item className="mx-5"
                        name="subscribeState" 
                        initialValue={subscribeState.map((e)=>(e.value))} 
                        label="구독유무: ">
                        <Checkbox.Group options={subscribeState} />
                        </Form.Item>
                    </Space>
                    <Space direction="horizontal">
                        <Form.Item name="searchType" label="검색조건" initialValue="name" 
                            style={{width: 200,}}>
                            <Select dropdownMatchSelectWidth={false}>
                                <Select.Option value="name">이름</Select.Option>
                                <Select.Option value="email">이메일</Select.Option>
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