import ModalWrapper from './ModalWrapper';
import React, { useEffect, useState } from 'react';
import s from './modal_uploadDogProfileImage.module.scss';
import Fake_input_uploadDogProfileImage from '../atoms/fake_input_uploadDogProfileImage';
import Spinner from '../atoms/Spinner';
import PreviewImage from '/src/components/atoms/PreviewImage';
import rem from '/util/func/rem';
import convertFileSizeToMegabyte from '/util/func/convertFileSizeToMegabyte';
import { valid_fileSize } from '/util/func/validation/validationPackage';
import uploadImageToApiServer from '/util/func/uploadImageToApiServer';
import { useModalContext } from '/store/modal-context';
import Modal_global_alert from './Modal_global_alert';
import { postObjData, putObjData } from '../../pages/api/reqData';

export const Modal_uploadDogProfileImage = ({
  data,
  onActiveModal,
  setItemList,
  setModalMessage,
}) => {
  const maxFileSize = 10000000;
  const mct = useModalContext();

  // console.log(data);

  const initialFileValues = {
    file: '',
    filename: '',
    pictureUrl: data.pictureUrl,
    dogPictureId: data.dogPictureId,
    uploadMode: data.pictureUrl ? 'update' : 'create',
    ...data,
  };
  // console.log(initialFileValues)

  const [fileObj, setFileObj] = useState(initialFileValues);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeFile = (e) => {
    const curFiles = e.currentTarget.files;
    try {
      const file = curFiles[0];
      const hasError = valid_fileSize(file, maxFileSize);
      if (hasError) return;

      setFileObj((prevState) => ({
        ...prevState,
        file: file,
        filename: file?.name,
      }));
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const onSaveImageHandler = async () => {
    const isUnchanged = !fileObj.file && fileObj.pictureUrl;

    if (fileObj.uploadMode === 'create' && !fileObj.file) return alert('저장할 파일이 없습니다.');
    if (fileObj.uploadMode === 'update' && isUnchanged) return alert('기존과 동일한 파일입니다.');
    const dogId = data.id;
    const uploadThumbApiUrl = '/api/dogs/picture/upload';
    const matchingThumbApiUrl = `/api/dogs/${dogId}/picture`;

    try {
      setIsLoading(true);
      const uploadResponse =
        fileObj.file &&
        (await uploadImageToApiServer(fileObj.file, setFileObj, null, null, uploadThumbApiUrl));

      const isToBeDeleted = !fileObj.file && !fileObj.pictureUrl;
      let modalMessage;
      if (
        uploadResponse?.response?.status === 200 ||
        (fileObj.uploadMode === 'update' && isToBeDeleted)
      ) {
        const dogPictureId = isToBeDeleted ? null : uploadResponse.id;
        const body = { dogPictureId };
        const matchingThumbResponse = await putObjData(matchingThumbApiUrl, body);
        if (matchingThumbResponse.isDone) {
          modalMessage =
            fileObj.uploadMode === 'create'
              ? '프로필 사진이 등록되었습니다.'
              : '프로필 사진이 수정되었습니다.';
          setFileObj((prevState) => ({
            ...prevState,
            pictureUrl: uploadResponse?.url,
            dogPictureId: dogPictureId,
          }));
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 500);
        
      } else if (uploadResponse && uploadResponse?.response.status === 400) {
        // ERROR STATUS
        modalMessage = '프로필 사진 업데이트에 실패하였습니다.';
      }
      onShowModalHandler(modalMessage);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onHideModal = () => {
    if (onActiveModal && typeof onActiveModal === 'function') {
      onActiveModal(false);
      onDeleteFile();
      mct.alertHide();
    }
  };

  const onDeleteFile = () => {
    setFileObj((prevState) => ({
      ...prevState,
      file: null,
      filename: null,
      pictureUrl: null,
    }));
  };

  return (
    <>
      <ModalWrapper
        onBackgroundClick={onHideModal}
        background
        positionCenter
        style={{ padding: `${rem(16)} ${rem(20)} ${rem(20)}` }}
      >
        <p className={s.title} data-title={fileObj.uploadMode}>
          프로필 사진 편집
        </p>
        <label htmlFor="uploadFile">
          <div className={s['preview-wrap']}>
            <PreviewImage
              ratio={1}
              objectFit={'fill'}
              file={fileObj.file}
              thumbLink={fileObj.pictureUrl}
              backgroundColor={'var(--gray-v10)'}
            />
          </div>
          <input
            id={'uploadFile'}
            type="file"
            accept="image/*"
            className="hide"
            multiple={false}
            onChange={onChangeFile}
          />
          <Fake_input_uploadDogProfileImage
            filename={fileObj.filename}
            loadingIcon={isLoading && <Spinner style={{ color: '#fff' }} />}
            onDelete={onDeleteFile}
          />
        </label>
        <p className={s.desc}>
          * 파일크기 {convertFileSizeToMegabyte(maxFileSize)}MB 이하 / 확장자: jpg, jpeg, png, gif
        </p>
        <div className={s['btn-section']}>
          <button className={`admin_btn line popup`} type={'button'} onClick={onHideModal}>
            취소
          </button>
          <button className={`admin_btn solid popup`} type={'button'} onClick={onSaveImageHandler}>
            저장
          </button>
        </div>
      </ModalWrapper>
    </>
  );
};
