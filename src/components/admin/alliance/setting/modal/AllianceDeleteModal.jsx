import ModalWrapper from "../../../../modal/ModalWrapper";
import * as s from '../allianceSetting.module.scss';
import InfoIcon from 'public/img/icon/info-red.svg';

const AllianceDeleteModal = ({ title, subTitle, onClose, onConfirm }) => {
  return (
    <ModalWrapper
      background
      positionCenter
      style={{ width: '100%', padding: '20px 40px', maxWidth: '420px' }}
    >
      <div className={s.modalContainer}>
        <InfoIcon />
        <h1 className={s.modalTitle}>{title}</h1>
        <h3 className={`pointColor ${s.modalSubTitle}`}>{subTitle}</h3>
        <div className={s.modalActions}>
          <button onClick={onClose} className='admin_btn line confirm_m'>취소</button>
          <button onClick={onConfirm} className='admin_btn solid confirm_m'>삭제</button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AllianceDeleteModal;