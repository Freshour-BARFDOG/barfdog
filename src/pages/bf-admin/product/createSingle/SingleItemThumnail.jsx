import React from 'react';
import PreviewImage from "/src/components/atoms/PreviewImage";
import CloseButton from "/src/components/atoms/CloseButton";
import Fake_input from "/src/components/atoms/fake_input";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import ItemLabel from "/src/components/atoms/ItemLabel";
import rem from "/util/func/rem";

export default function SingleItemThumbnail({fileList, setFileList, formErrors }) {

  // console.log(fileList)


  const imageFileChangeHandler = (e) => {
    const curFiles = e.currentTarget.files;
    if(!curFiles?.length) return;

    const maxImageCount = 10;
    const currentFileListCount = fileList.length;
    const updatedFileListCount = curFiles.length;
    if (currentFileListCount + updatedFileListCount > maxImageCount) {
      return alert(`이미지는 최대 ${maxImageCount}장까지 등록할 수 있습니다.`);
    }



    if (curFiles.length === 1) {
      const file = curFiles[0];
      return setFileList((prevState) => [...prevState, { file: file, filename: file.name }]);
    } else if (curFiles.length > 1) {
      let newFileList = [];
      for (const filesKey in curFiles) {
        const file = curFiles[filesKey];
        if (typeof file === 'object') {
          newFileList.push({
            file: file,
            filename: file.name,
          });
        }
      }
      return setFileList((prevState) => [...prevState, ...newFileList]);
    }
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
      <div className="inp_section">
        {fileList.length > 0 && (
          <div className="grid-box grid-column">
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