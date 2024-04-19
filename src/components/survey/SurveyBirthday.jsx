import React, { useEffect, useState, useRef } from 'react';
import s from './surveyBirthday.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { subYears, endOfYear, getYear, getMonth, format } from 'date-fns';
import range from 'lodash/range';
import ko from 'date-fns/locale/ko';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FcNext } from 'react-icons/fc';
import { FcPrevious } from 'react-icons/fc';
const SurveyBirthday = ({
  type,
  required,
  id,
  formValue,
  setFormValues,
  title,
  children,
  addedClassName,
  disabled,
  placeholder,
  errorMessage,
  filteredType,
  icon,
  dogInfoIndex,
  ...props
}) => {
  const initialValue = formValue || '';
  const [selectedDate, setSelectedDate] = useState(null);

  const calculatePregnancyStatus = (dueDate) => {
    const today = new Date();
    const differenceInDays = Math.floor(
      (today - dueDate) / (1000 * 60 * 60 * 24),
    );

    if (differenceInDays <= 40) {
      return 'PREGNANT_EARLY';
    } else {
      return 'PREGNANT_LATE';
    }
  };

  const handleRawInput = (e) => {
    const rawInput = e.target.value;
    // 입력값이 'yyyyMMdd' 형식과 일치하는지 확인
    const dateIsValid = rawInput?.match(/^(\d{4}).?(\d{2}).?(\d{2})$/);
    if (dateIsValid) {
      // const formattedDate = `${dateIsValid[1]}-${dateIsValid[2]}-${dateIsValid[3]}`;
      const formattedDate = `${dateIsValid[1]}${dateIsValid[2]}${dateIsValid[3]}`;
      handleDateChange(new Date(formattedDate));
    }
  };

  const handleDateChange = (date) => {
    let formattedDate = '';

    const pregnancyStatus = calculatePregnancyStatus(date);

    // date 값이 유효하면, 날짜 포맷 변경
    if (date && !isNaN(date)) {
      // formattedDate = format(date, 'yyyy-MM-dd');
      formattedDate = format(date, 'yyyyMMdd');
      setSelectedDate(date);
      setFormValues((prevFormValues) => {
        const newFormValues = prevFormValues.map((item, idx) => {
          if (idx === dogInfoIndex) {
            return {
              ...item,
              [id]: formattedDate,
              specificDogStatus:
                id === 'expectedPregnancyDay' && pregnancyStatus,
            };
          }
          return item;
        });

        return newFormValues;
      });
      //! [이전]
      // setFormValues((prevState) => {
      //   return {
      //     ...prevState,
      //     [id]: formattedDate,
      //   };
      // });
    }

    if (date === null) {
      setSelectedDate(null);

      // 내용 업데이트
      setFormValues((prevFormValues) => {
        const newFormValues = prevFormValues.map((item, idx) => {
          if (idx === dogInfoIndex) {
            return {
              ...item,
              [id]: '',
            };
          }
          return item;
        });

        return newFormValues;
      });
      //! [이전]
      // setFormValues((prevState) => {
      //   return {
      //     ...prevState,
      //     [id]: '',
      //   };
      // });
      // return;
    }
    // // console.log('id:',id,' val:',formattedDate);

    setSelectedDate(date);

    // 내용 업데이트
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === dogInfoIndex) {
          return {
            ...item,
            [id]: formattedDate,
            specificDogStatus: id === 'expectedPregnancyDay' && pregnancyStatus,
          };
        }
        return item;
      });

      return newFormValues;
    });

    //! [이전]
    // setFormValues((prevState) => {
    //   return {
    //     ...prevState,
    //     [id]: formattedDate,
    //   };
    // });
  };

  const addedClassNameList = () => {
    let classNameList = '';
    if (!addedClassName?.length) return;

    addedClassName?.forEach((list) => {
      if (!list) return;
      return (classNameList += ` ${s[list]} `);
    });
    return classNameList;
  };

  // const minDate = subYears(new Date(), 100);
  // const maxDate = endOfYear(new Date());
  const today = new Date();
  const maxDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [startDate, setStartDate] = useState(new Date());
  const years = range(1900, getYear(new Date()) + 1, 1).reverse();
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const toggleYearDropdown = () => {
    setIsYearDropdownOpen(!isYearDropdownOpen);
    setIsMonthDropdownOpen(false);
  };

  const toggleMonthDropdown = () => {
    setIsMonthDropdownOpen(!isMonthDropdownOpen);
    setIsYearDropdownOpen(false);
  };

  const selectedDayClassName = (date) =>
    selectedDate && date.getTime() === selectedDate.getTime()
      ? `${s.day}`
      : null;

  const handleInputFocus = (event) => {
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobileDevice) {
      event.target.blur(); // 모바일 장치에서만 포커스 해제
    }
  };

  return (
    <>
      {/* <div className={s['join__wrap']}> */}
      <div className={s['join__wrap']}>
        {/* <div className={s['input-title-wrap']}> */}
        <div className={s.date_label_wrap}>
          <label htmlFor={id}>
            <span
              // className={`${s['inp-title']} ${required && s['required']}`}
              className={s.date_label_span}
              id={`${id}Title`}
            >
              {title}
            </span>
          </label>
        </div>
        <div className={`${s['input-cont-wrap']} ${addedClassNameList()}`}>
          <div className={s['input-wrap']}>
            <div className={s.date_wrap}>
              <div className={`${s.svg_wrap} img-wrap`}>
                <FaRegCalendarAlt className={s['icon']} size="100%" />
              </div>

              <DatePicker
                placeholderText="연도. 월. 일."
                className={s['birthday']}
                id={id}
                selected={selectedDate}
                onChange={handleDateChange}
                onChangeRaw={handleRawInput}
                dateFormat={'yyyy. MM. dd.'}
                maxDate={id === 'birth' && maxDate}
                // required={required}
                locale={ko}
                disabledKeyboardNavigation
                isClearable
                // onFoucus 직접입력 막기-> MacOS Safari 정지 이슈발생
                // PC환경 직접입력 허용(ex 2023. 05. 12. 폼으로 정확해야만 직접 입력됨, 달력에서 고를 수 없는 값은 입력불가, console 입력 확인완료)
                // onFocus={e => e.target.blur()}
                onFocus={handleInputFocus}
                dayClassName={selectedDayClassName}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div
                    style={{
                      margin: 10,
                      display: 'flex',
                      justifyContent: 'center',
                      columnGap: 10,
                      zIndex: 10,
                    }}
                  >
                    <button
                      className={s.date_prev}
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                    >
                      <FcPrevious />
                    </button>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 10,
                      }}
                    >
                      <YearDropdown
                        years={years}
                        selectedYear={getYear(date)}
                        onChange={(year) => changeYear(year.toString())}
                        isOpen={isYearDropdownOpen}
                        toggleDropdown={toggleYearDropdown}
                      />

                      <MonthDropdown
                        months={months}
                        selectedMonth={months[getMonth(date)]}
                        onChange={(month) => changeMonth(months.indexOf(month))}
                        isOpen={isMonthDropdownOpen}
                        toggleDropdown={toggleMonthDropdown}
                      />
                    </div>

                    <button
                      className={s.date_next}
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                    >
                      <FcNext />
                    </button>
                  </div>
                )}
              />
            </div>
            {icon && icon}
            {errorMessage}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default SurveyBirthday;

function YearDropdown({
  years,
  selectedYear,
  onChange,
  isOpen,
  toggleDropdown,
}) {
  // const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      // Scroll to the selected year's position when the dropdown is opened
      const selectedYearButton = dropdownRef.current.querySelector(
        `button[value="${selectedYear}"]`,
      );
      if (selectedYearButton) {
        const selectedYearRect = selectedYearButton.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const scrollAmount = selectedYearRect.top - dropdownRect.top;
        dropdownRef.current.scrollTop += scrollAmount;
      }
    }
  }, [isOpen, selectedYear]);

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  return (
    <div className={s.pic_box}>
      <button className={s.pic_button} onClick={toggleDropdown}>
        {selectedYear}
      </button>
      {isOpen && (
        <div className={s.pic_flex} ref={dropdownRef}>
          {years.map((year) => (
            <button
              className={s.pic_list}
              key={year}
              value={year}
              onClick={() => {
                onChange(year);
                // setIsOpen(false);
                toggleDropdown();
              }}
              style={{
                fontWeight: year === selectedYear ? '600' : 'normal',
                backgroundColor: year === selectedYear ? '#efefef' : '#fff',
                color: year === selectedYear ? '#ca1011' : '#000',
              }}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function MonthDropdown({
  months,
  selectedMonth,
  onChange,
  isOpen,
  toggleDropdown,
}) {
  // const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      // Scroll to the selected month's position when the dropdown is opened
      const selectedMonthButton = dropdownRef.current.querySelector(
        `button[value="${selectedMonth}"]`,
      );
      if (selectedMonthButton) {
        const selectedMonthRect = selectedMonthButton.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const scrollAmount = selectedMonthRect.top - dropdownRect.top;
        dropdownRef.current.scrollTop += scrollAmount;
      }
    }
  }, [isOpen, selectedMonth]);

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  return (
    <div className={s.pic_box}>
      <button className={s.pic_button} onClick={toggleDropdown}>
        {selectedMonth}
      </button>
      {isOpen && (
        <div className={s.pic_flex} ref={dropdownRef}>
          {months.map((month) => (
            <button
              className={s.pic_list}
              key={month}
              value={month}
              onClick={() => {
                onChange(month);
                // setIsOpen(false);
                toggleDropdown();
              }}
              style={{
                fontWeight: month === selectedMonth ? '600' : 'normal',
                backgroundColor: month === selectedMonth ? '#efefef' : '#fff',
                color: month === selectedMonth ? '#ca1011' : '#000',
              }}
            >
              {month}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
