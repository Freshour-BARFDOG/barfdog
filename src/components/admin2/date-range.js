import { DatePicker, Radio, RadioChangeEvent } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
const { RangePicker } = DatePicker;


const dateRangeOptions = [
  { label: "전체", value: "total" },
  { label: "1년", value: "1year" },
  { label: "6개월", value: "6months" },
  { label: "3개월", value: "3months" },
  { label: "1개월", value: "1month" },
  { label: "1주일", value: "1week" },
  { label: "오늘", value: "today" },
];


const onChange = (value, dateString) => {
  // console.log('Selected Time: ', value);
  // console.log('Formatted Selected Time: ', dateString);
};
const DateRangeField = (props) => {
    //// console.log(props)
  //const [dateStart, setDateStart] = useState(dayjs().subtract(1, "year"));
  const [dateStart, setDateStart] = useState(dayjs('2000-01-01T00:00:00'));
  const [dateEnd, setDateEnd] = useState(dayjs());

  const handleButtonClick = (value) => {
    let startDate, endDate;


    switch (value) {
      case "today":
        startDate = endDate = dayjs();
        break;
      case "1week":
        startDate = dayjs().subtract(1, "week");
        endDate = dayjs();
        break;
      case "1month":
        startDate = dayjs().subtract(1, "month");
        endDate = dayjs();
        break;
      case "3months":
        startDate = dayjs().subtract(3, "month");
        endDate = dayjs();
        break;
      case "6months":
        startDate = dayjs().subtract(6, "month");
        endDate = dayjs();
        break;
      case "1year":
        startDate = dayjs().subtract(1, "year");
        endDate = dayjs();
        break;
      case "total":
        startDate = dayjs('2000-01-01T00:00:00');
        endDate = dayjs();
        break;
      default:
        break;
    }

    //props.onChange([startDate, endDate]);

    props.onChange([startDate, endDate])

    setDateStart(startDate);
    setDateEnd(endDate);
  };

  
  //const onOk = (value) => {
    //// console.log('onOk: ', value);
  //};
  
  const onChange = (value, dateString) => {
    setDateStart(value[0]);
    setDateEnd(value[1]);
    props.onChange([value[0], value[1]])
    //// console.log('Selected Time: ', value);
    //// console.log('Formatted Selected Time: ', dateString);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* <DatePicker
        showTime 
        //onChange={onChange} onOk={onOk}
        //placeholder="시작 날짜"
        //value={dateStart || null}
      />
      <span>~</span>
      <DatePicker 
        showTime 
        //onChange={onChange} onOk={onOk}
        //placeholder="종료 날짜"
        //value={dateEnd || null}
      /> */}
      
      <RangePicker 
      pickerOptions={{
        okButtonProps: {
          style: {
            backgroundColor: 'red',
            color: 'white',
          },
        },
        cancelButtonProps: {
          style: {
            backgroundColor: 'blue',
            color: 'white',
          },
        },
      }}
        showTime={{ format: 'HH:mm', }}
        format="YYYY-MM-DD HH:mm"
        onChange={onChange} 
        defaultValue={[dateStart, dateEnd]}
        value={[dateStart, dateEnd]}
        //onOk={onOk}
        //value={ dateStart || null}
      />
      <div className="flex items-center gap-1">
        <Radio.Group
          size="small"
          options={dateRangeOptions}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => handleButtonClick(e.target.value)}
          defaultValue={"total"}
        />
      </div>
    </div>
  );
};

export default DateRangeField;