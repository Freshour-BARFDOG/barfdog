import React, { useEffect, useState } from 'react';
import PreviewImage from '/src/components/atoms/PreviewImage';
import CloseButton from '/src/components/atoms/CloseButton';
import Fake_input from '/src/components/atoms/fake_input';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import Spinner from '/src/components/atoms/Spinner';
import convertFileSizeToMegabyte from '/util/func/convertFileSizeToMegabyte';
import compareIdList from '/util/func/compareIdList';
import uploadImageToApiServer from '/util/func/uploadImageToApiServer';
import { valid_fileSize } from '/util/func/validation/validationPackage';



export default function FileInput({
  id,
  apiUrl,
  setFormValues,
  formErrors,
  setFormErrors,
  originImageDatas = [],
  maxImageCount = 5,
  maxFileSize = 10000000,
  mode = 'create',
  required = true,
  theme = 'basic',
  className,
  option = { descriptionHTML: additionalDesriptionHTML },
  ...props
}) {
  
  const [isFirstRendering, setIsFirstRendering] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [allIdList, setAllIdList] = useState([]); // for Post update summit event;
  const [fileList, setFileList] = useState([]); // for Preview;
  // console.log(allIdList);
  // console.log(fileList);
  // console.log(originImageDatas);

  useEffect(() => {
    // ! important: 데이터fetching없이 useEffect의 dependency가 변화하지 않을 경우, 무한루프실행됨.
    if (mode === 'update') {
      const initAllIdList = originImageDatas.map((data) => data.id);
      const initFileList = originImageDatas.map((data) => ({
        file: null,
        filename: data.filename,
        id: data.id,
        url: data.url,
      }));
      setAllIdList(initAllIdList);
      setFileList(initFileList);
    }
  }, [originImageDatas]);

  useEffect(() => {
    if (!isFirstRendering) {
      if (mode === 'update') {
        const curIdList = fileList.map((list) => list.id);
        const originIdList = originImageDatas.map((list) => list.id);
        const resultIdList = compareIdList(allIdList, curIdList, originIdList);
        // console.log('::: File Upload To Server CRUD RESULT :::', resultIdList);
        const newImageValues = resultIdList?.cur.map((imageId, index) => ({
          id: imageId,
          leakOrder: index + 1, // order 시작숫자: 1. (!== index 시작숫자: 0)
        }));
        setFormValues((prevState) => ({
          ...prevState,
          [id]: newImageValues || [],
          addImageIdList: resultIdList?.cur || [],
          deleteImageIdList: resultIdList?.del || [],
        }));
      } else if (mode === 'create') {
        setFormErrors((prevState) => ({
          ...prevState,
          [id]: !fileList.length ? '필수항목입니다.' : '',
        }));
        const curIdList = fileList.map((list) => list.id);
        setFormValues((prevState) => ({
          ...prevState,
          [id]: prevState[id].length > 0 ? prevState[id].filter((list) => curIdList.indexOf(list.id) >= 0) : [],
        }));
      }
    }
    setIsFirstRendering(false);
  }, [fileList]);

  const multipleImageFileChangeHandler = async (e) => {
    const curFiles = e.currentTarget.files;
    const curFileListCount = fileList.length;
    const updatedFileListCount = curFiles.length;
    if (curFileListCount + updatedFileListCount > maxImageCount) {
      return alert(`이미지는 최대 ${maxImageCount}장까지 등록할 수 있습니다.`);
    }

    /// ! TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
    /// ! TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
    // if (curFiles.length === 1) {
    //   const file = curFiles[0];
    //   const hasError = valid_fileSize(file, maxFileSize);
    //   if (hasError) return;
    //   setIsLoading(true);
    //   const response = {id : Math.floor(Math.random() *100)}
    //   console.log(response)
    //   setFileList((prevState) => [
    //     ...prevState,
    //     { file: file, filename: file.name, id: response.id, url: null },
    //   ]);
    //   setAllIdList((prevState) => [...prevState, response.id]);
    // } else if (curFiles.length > 1) {
    //   let newFileList = [];
    //   let fileCount = curFileListCount;
    //   for (const filesKey in curFiles) {
    //     const leakOrder = fileCount + 1;
    //     const file = curFiles[filesKey];
    //     if (typeof file !== 'object') break; // file 순회 시 파일 외 요소 filtering
    //     const hasError = valid_fileSize(file, maxFileSize);
    //     if (hasError) break;
    //     setIsLoading(true);
    //     const response = {id : Math.floor(Math.random() *100)}
    //     newFileList.push({
    //       file: file,
    //       filename: file.name,
    //       id: response.id,
    //     });
    //     fileCount++;
    //   }
    //   setFileList((prevState) => [...prevState, ...newFileList]);
    //   const newfileIdList = newFileList.map((list) => list.id);
    //   setAllIdList((prevState) => prevState.concat(newfileIdList));
    // }
    // setIsLoading(false);
    // return
    /// ! TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST
    /// ! TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST

    try {
      if (curFiles.length === 1) {
        const file = curFiles[0];
        const hasError = valid_fileSize(file, maxFileSize);
        if (hasError) return;
        setIsLoading(true);
        const leakOrder = curFileListCount + 1;
        const response = await uploadImageToApiServer(
          file,
          setFormValues,
          id,
          setFormErrors,
          apiUrl,
          leakOrder,
        );

        setFileList((prevState) => [
          ...prevState,
          {
            file: file,
            filename: file.name,
            id: response.id,
            url: response.url,
          },
        ]);
        setAllIdList((prevState) => [...prevState, response.id]);
      } else if (curFiles.length > 1) {
        let newFileList = [];
        let fileCount = curFileListCount;
        for (const filesKey in curFiles) {
          const leakOrder = fileCount + 1;
          const file = curFiles[filesKey];
          if (typeof file !== 'object') break; // file 순회 시 파일 외 요소 filtering
          const hasError = valid_fileSize(file, maxFileSize);
          if (hasError) break;
          setIsLoading(true);
          const response = await uploadImageToApiServer(
            file,
            setFormValues,
            id,
            setFormErrors,
            apiUrl,
            leakOrder,
          );
          // console.log(response);
          newFileList.push({
            file: file,
            filename: file.name,
            id: response.id,
          });
          fileCount++;
        }
        setFileList((prevState) => [...prevState, ...newFileList]);
        const newfileIdList = newFileList.map((list) => list.id);
        setAllIdList((prevState) => prevState.concat(newfileIdList));
      }
    } catch (err) {
      console.log(err);
      console.error('Error 발생: ', err);
    }

    setIsLoading(false);
  };

  const onDeleteThumbHandler = (e) => {
    const thumb = e.currentTarget;
    const tobeDeletedButtonId = Number(thumb.dataset.id);
    // console.log('삭제될 이미지 ID:', tobeDeletedButtonId);
    const newFileList = fileList.filter(
      (list) => list.id !== tobeDeletedButtonId,
    );
    setFileList(newFileList);
  };

  return (
    <>
      <div
        className={`inp_section multiImageBox ${theme}-theme ${
          className || ''
        }`}
      >
        {theme === 'basic' && (
          <>
            {fileList?.length > 0 && (
              <div className={`col-${maxImageCount} grid-box grid-column`}>
                {fileList?.map((file, index) => {
                  return (
                    <PreviewImage
                      key={`${file.filename}-${file.id}`}
                      file={file.file}
                      thumbLink={file.url}
                      objectFit={'contain'}
                      style={{ cursor: 'default' }}
                    >
                      <CloseButton
                        data-id={`${file.id}`}
                        onClick={onDeleteThumbHandler}
                        className={'preview-delete-button'}
                      />
                    </PreviewImage>
                  );
                })}
              </div>
            )}
            <label className="inp_wrap inline-grid file" htmlFor={id}>
              <div className="inp_box">
                <input
                  id={id}
                  type="file"
                  accept="image/*"
                  className="hide"
                  multiple={true}
                  onChange={multipleImageFileChangeHandler}
                />
                <Fake_input
                  filename={fileList.length && fileList[0].filename}
                  loadingIcon={isLoading && <Spinner />}
                  theme={theme}
                />
              </div>
            </label>
          </>
        )}
        {theme === 'modern' && (
          <>
            <div className={`grid-box`}>
              <label className="inp_wrap inline-flex file" htmlFor={id}>
                <input
                  id={id}
                  type="file"
                  accept="image/*"
                  className="hide"
                  multiple={true}
                  onChange={multipleImageFileChangeHandler}
                />
                <Fake_input
                  filename={fileList.length && fileList[0].filename}
                  loadingIcon={
                    isLoading && <Spinner style={{ color: '#fff' }} />
                  }
                  theme={theme}
                />
              </label>
              <div className={`preview-wrap grid-box`}>
                {fileList.map((file, index) => {
                  return (
                    <PreviewImage
                      key={`${file.filename}-${file.id}`}
                      file={file.file}
                      thumbLink={file.url}
                      objectFit={'contain'}
                      style={{ cursor: 'default' }}
                    >
                      <CloseButton
                        data-id={`${file.id}`}
                        onClick={onDeleteThumbHandler}
                        className={'preview-delete-button'}
                      />
                    </PreviewImage>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="desc">
          {option.descriptionHTML}
          <p>
            * 이미지는 {required ? '최소 1장,' : ''} 최대 {maxImageCount}장
            이내로 등록 가능합니다.
          </p>
          <p>
            * 파일크기는 {convertFileSizeToMegabyte(maxFileSize)}MB이하 / jpg,
            jpeg, png, gif 형식만 등록 가능합니다.
          </p>
        </div>
        {required && formErrors[id] && (
          <ErrorMessage>{formErrors[id]}</ErrorMessage>
        )}
      </div>
    </>
  );
}


const additionalDesriptionHTML = (
  <>
    <p>* 첫 번째 이미지가 대표 이미지로 노출됩니다.</p>
  </>
);