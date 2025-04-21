import React, {useEffect, useState} from "react";
import {filter_dateAndTime} from "/util/func/filter_dateAndTime";


export function DateTimeInput({id, form, setForm, setErrors, defaultStringValueOfSeconds = "00", minDate}) {


  const {date, time} = filter_dateAndTime(form[id]);
  const [dateTime, setDateTime] = useState({
    date: date,
    time: time
  });

  useEffect(() => {
    // validation:  Date 또는 Time 값이 비어있는 경우
    const inValid = Object.values(dateTime).filter(value => !value).length > 0;
    if (inValid) return;


    setForm(prev => ({
      ...prev,
      [id]: `${dateTime.date} ${timeWithSeconds(dateTime.time, defaultStringValueOfSeconds)}`
    }))

  }, [dateTime]);


    const onChange = (e) => {
        let {value, type} = e.target;
        setDateTime(prev => ({
            ...prev,
            [type]: value
        }));
    }


    if (!form) {
        return;
    }


    return (<>
        <div className="inp_box">
            <input
                type="date"
                value={dateTime.date || ""}
                onChange={onChange}
                min={minDate || undefined}
            />
            <input
                type="time"
                value={dateTime.time || ""}
                onChange={onChange}
            />
        </div>
    </>);
}

const timeWithSeconds = (timeWithoutSeconds, seconds) => {
    return `${timeWithoutSeconds}:${filter_stringSeconds(seconds)}`


}


const filter_stringSeconds = (stringSeconds) => {
    const defaultSeconds = "00";
    let seconds = stringSeconds;
    if (stringSeconds.length === 1) {
        seconds = "0" + seconds;
    }
    return !stringSeconds || stringSeconds.length > 2 || Number(stringSeconds) >= 60 ? defaultSeconds : seconds;
}
