import { useEffect, useState } from "react";
import * as s from "../coupon/allianceCoupon.module.scss";
import CloseButton from "/src/components/atoms/CloseButton";
import enterKey from "/util/func/enterKey";
import ErrorMessage from "/src/components/atoms/ErrorMessage";

const AllianceEventAddInput = ({
  eventNameList,
  setEventNameList,
  eventErrorMessage = '',
}) => {
  const [eventValue, setEventValue] = useState('');
  const [eventError, setEventError] = useState(eventErrorMessage);

  useEffect(() => {
    if (eventErrorMessage) setEventError(eventErrorMessage);
  }, [eventErrorMessage])

  const handleChange = (e) => {
    setEventError('');
    setEventValue(e.target.value);
  }

  const handleAddEventName = () => {
    if (!eventValue) {
      setEventError('입력하지 않은 항목이 있습니다.');
      return;
    }
    if (!eventNameList.includes(eventValue)) {
      setEventNameList([...eventNameList, eventValue]);
      setEventValue('');
    } else {
      setEventError('이미 등록된 행사입니다. 다시 입력해 주세요.');
    }
  }
  return (
    <div style={{ width: '100%', textAlign: 'left' }}>
      <div className={s.eventNameListInputBox}>
        <input
          name='eventName'
          value={eventValue}
          onChange={handleChange}
          onKeyDown={(e) => enterKey(e, handleAddEventName)}
        />
        <button onClick={handleAddEventName} className='admin_btn line basic_m'>
          추가
        </button>
      </div>
      {eventError && (
        <ErrorMessage>{eventError}</ErrorMessage>
      )}
      <div className={s.eventNameListChips}>
        {eventNameList.map(event => (
          <div key={event} className={s.eventNameChip}>
            <span>{event}</span>
            <i>
              <CloseButton
                style={{ height: '100%'}}
                onClick={() => setEventNameList(eventNameList.filter(name => name !== event))}
              />
            </i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllianceEventAddInput;