import * as s from '../allianceSetting.module.scss';
import ModalWrapper from "../../../../modal/ModalWrapper";
import AllianceEventAddInput from "../AllianceEventAddInput";

const AllianceEventAddModal = ({
  eventNameList,
  setEventNameList,
  onClose,
  onConfirm,
  isConfirmDisabled,
  eventError,
  setEventError,
}) => {
  return (
    <ModalWrapper
      background
      positionCenter
      style={{ width: '100%', padding: '20px 40px', maxWidth: '420px' }}
    >
      <div className={s.modalContainer}>
        <h1 className={s.modalTitle}>행사 추가하기</h1>
        <div className={s.modalContent}>
          <AllianceEventAddInput
            eventNameList={eventNameList}
            setEventNameList={setEventNameList}
            eventError={eventError}
            setEventError={setEventError}
          />
        </div>
        <div className={s.modalActions}>
          <button onClick={onClose} className='admin_btn line confirm_m'>취소</button>
          <button
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className={`admin_btn solid confirm_m ${isConfirmDisabled ? 'disabled' : ''}`}
          >
            추가
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AllianceEventAddModal;