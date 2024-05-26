import React, { useRef, useCallback, useState, useEffect } from 'react';
// import { transformToday } from '/util/func/transformDate';
// import { getDiffDate, getDiffDateNumber } from '/util/func/getDiffDate';
import { global_searchDateType } from '/store/TYPE/searchDateType';
import dayjs from 'dayjs';
import { ConfigProvider, DatePicker, Radio, RadioChangeEvent } from 'antd';
const { RangePicker } = DatePicker;
import s from './searchDateTime.module.scss';

const dateRangeOptions = [
  { label: '오늘', value: 'today' },
  { label: '1주일', value: '1week' },
  { label: '1개월', value: '1month' },
  { label: '3개월', value: '3months' },
  { label: '6개월', value: '6months' },
  { label: '1년', value: '1year' },
  { label: '전체', value: 'total' },
];

const SearchTerm = (props) => {
  // const [dateStart, setDateStart] = useState(dayjs('2000-01-01T00:00:00'));
  const [dateStart, setDateStart] = useState(dayjs().startOf('day'));
  //! ---> default 값 (오늘)
  const [dateEnd, setDateEnd] = useState(dayjs());

  const handleButtonClick = (value) => {
    let startDate, endDate;

    switch (value) {
      case 'today':
        startDate = endDate = dayjs();
        break;
      case '1week':
        startDate = dayjs().subtract(1, 'week');
        endDate = dayjs();
        break;
      case '1month':
        startDate = dayjs().subtract(1, 'month');
        endDate = dayjs();
        break;
      case '3months':
        startDate = dayjs().subtract(3, 'month');
        endDate = dayjs();
        break;
      case '6months':
        startDate = dayjs().subtract(6, 'month');
        endDate = dayjs();
        break;
      case '1year':
        startDate = dayjs().subtract(1, 'year');
        endDate = dayjs();
        break;
      case 'total':
        startDate = dayjs('2000-01-01T00:00:00');
        endDate = dayjs();
        break;
      default:
        break;
    }

    setDateStart(startDate);
    setDateEnd(endDate);

    props.setDate({
      from: startDate.format('YYYY-MM-DD-HH-mm'),
      to: endDate.format('YYYY-MM-DD-HH-mm'),
      term: props.date.term,
    });
  };

  const onChange = (value, dateString) => {
    if (Array.isArray(value)) {
      const [startDate, endDate] = value?.map((date) => dayjs(date));
      setDateStart(startDate);
      setDateEnd(endDate);
      props.setDate({
        from: startDate.format('YYYY-MM-DD-HH-mm'),
        to: endDate.format('YYYY-MM-DD-HH-mm'),
        term: props.date.term,
      });
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf('day');
  };

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledRangeTime = (current, type) => {
    const now = dayjs();
    if (
      (type === 'start' || type === 'end') &&
      current &&
      current.isSame(now, 'day')
    ) {
      return {
        disabledHours: () => range(now.hour() + 1, 24),
        disabledMinutes: () =>
          current.hour() === now.hour() ? range(now.minute() + 1, 60) : [],
        disabledSeconds: () =>
          current.hour() === now.hour() && current.minute() === now.minute()
            ? range(now.second() + 1, 60)
            : [],
      };
    }
    return {};
  };

  return (
    <>
      <div className="flex items-center gap-1"></div>
      <div className={s['search-row']}>
        <h4 className={s['title']}>
          {props.title}
          {props.tooltip && (
            <span className={s['tooltip-wrap']}>{props.tooltip}</span>
          )}
        </h4>
        <div className={`${s['inp-wrap']} ${s['term']}`}>
          <div>
            <ConfigProvider
              theme={{
                token: {
                  // Seed Token
                  colorPrimary: '#ca1011',
                  borderRadius: 0,
                },
              }}
            >
              <Radio.Group
                size="big"
                options={dateRangeOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => handleButtonClick(e.target.value)}
                defaultValue={'today'} //! 기본값 변경
              />
            </ConfigProvider>
          </div>
          <div>
            <ConfigProvider
              theme={{
                token: {
                  // Seed Token
                  colorPrimary: '#ca1011',
                },
                components: {
                  DatePicker: {
                    button: {
                      backgroundColor: 'red !important',
                    },
                  },
                },
              }}
            >
              <RangePicker
                pickerOptions={{
                  disabledDate: (current) => {
                    return current && current > dayjs().endOf('day');
                  },
                }}
                showTime={{ format: 'HH:mm', hideDisabledOptions: true }}
                format="YYYY-MM-DD HH:mm"
                onChange={onChange}
                defaultValue={[dateStart, dateEnd]}
                value={[dateStart, dateEnd]}
                disabledDate={disabledDate}
                disabledTime={disabledRangeTime}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchTerm;
