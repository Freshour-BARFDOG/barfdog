import React from 'react';
import PreviewImage from "/src/components/atoms/PreviewImage";
import CloseButton from "/src/components/atoms/CloseButton";
import Fake_input from "/src/components/atoms/fake_input";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import ItemLabel from "/src/components/atoms/ItemLabel";
import rem from "/util/func/rem";
import {postFileUpload} from "../../../../../api/reqData";

export default function SingleItemThumbnail({fileList, setFileList, formErrors }) {

  // console.log(fileList)


  const imageFileChangeHandler = async (e) => {
    // - 파일이 존재하지 않는 경우 -> 삭제 API는 따로 없음
    // - server에서 일정시간마다 찌꺼기 file을 삭제하는 처리하는 방식으로 구현됨
    const thisInput = e.currentTarget;
    const file = thisInput.files[0];
    const filename = file ? file.name : '';

    if (!file) {
      setFormValues((prevState) => ({
        ...prevState,
        thumbnailId: '',
      }));
      setFormErrors((prevState) => ({
        ...prevState,
        thumbnailId: '필수항목입니다.',
      }));
      setThumbFile({
        ...thumbFile,
        file: '',
        filename: '',
      });
      return;
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        thumb: '업로드 중',
      }));
      const formData = new FormData();
      formData.append('file', file);
      const thumbApiURL = '/api/admin/blogs/thumbnail/upload';
      const response = await postFileUpload(thumbApiURL, formData);
      const thumbId = response.data.id;
      const isFaild = response.status !== 200 && response.status !== 201;
      setFormValues((prevState) => ({
        ...prevState,
        thumbnailId: thumbId,
      }));
      setFormErrors((prevState) => ({
        ...prevState,
        thumbnailId: isFaild && '업로드에 실패했습니다. 파일형식을 확인하세요.',
      }));
      setThumbFile({
        ...thumbFile,
        file: !isFaild && file,
        filename: !isFaild && filename,
        thumbnailId: thumbId,
      });
    } catch (err) {
      alert(`에러가 발생했습니다.\n${err}`);
    }

    setIsLoading((prevState) => ({
      ...prevState,
      thumb: false,
    }));
  };


  const onDeleteThumbHandler = (e) => {
    const thumb = e.currentTarget;
    const tobeDeletedIndex = Number(thumb.dataset.index);
    const newFileList = fileList.filter((list, index)=> index !== tobeDeletedIndex);
    setFileList(newFileList);
    // console.log(newFileList);
  };



  return (
    <>
      <div className="inp_section multiImageBox">
        {fileList.length > 0 && (
          <div className="grid-box grid-column col-10">
            {fileList.map((file, index) => {
              return (
                <PreviewImage
                  key={`${file.file.name}`}
                  file={file.file}
                  style={{cursor:'default'}}
                >
                  <CloseButton
                    data-index={`${index}`}
                    onClick={onDeleteThumbHandler}
                    className={'preview-delete-button'}
                  />
                  {index === 0 &&           <ItemLabel
                    label="대표이미지"
                    style={{
                      backgroundColor: "#000",
                      height: rem(30),
                      fontSize:rem(13),
                      left: '50%',
                      top:'auto',
                      bottom: rem(0),
                      width: '100%',
                      transform: "translate(-50%, 0)rotate(0deg)",
                    }}
                  />}
                </PreviewImage>
              );
            })}
          </div>
        )}

        <label className="inp_wrap file" htmlFor="thumbnails">
          <div className="inp_box">
            <input
              id={'thumbnails'}
              type="file"
              accept="image/*"
              className="hide"
              multiple={true}
              onChange={imageFileChangeHandler}
            />
            <Fake_input filename={fileList.length && fileList[0].filename} />
          </div>
        </label>
        <div className="desc">
          <p>* 첫 번째 이미지가 단품 리스트의 대표 이미지로 노출됩니다.</p>
          <p>* 이미지는 최소 1장, 최대 10장 등록가능합니다.</p>
          <p>* 이미지는 1MB이하 / jpg, jpeg, png, gif 형식만 등록가능합니다.</p>
          <p>* 이미지 비율 1:1</p>
        </div>
        {formErrors.thumbnails && (
          <ErrorMessage>{formErrors.thumbnails}</ErrorMessage>
        )}
      </div>
    </>
  )
};