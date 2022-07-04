import React, { useEffect, useState } from 'react';
import PreviewImage from '/src/components/atoms/PreviewImage';
import CloseButton from '/src/components/atoms/CloseButton';
import Fake_input from '/src/components/atoms/fake_input';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import Spinner from '/src/components/atoms/Spinner';
import convertFileSizeToMegabyte from '/util/func/ConvertFileSizeToMegabyte';
import { postFileUpload } from '/api/reqData';

export default function EventDetailImage({
  id,
  setFormValues,
  formErrors,
  setFormErrors,
  apiUrl,
  originImageDatas = [],
  mode,
}) {
  const maxImageCount = 5;
  const maxFileSize = 10000000;

  const [isFirstRendering, setIsFirstRendering] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]); // for Preview;
  const [fullImageIdList, setFullImageIdList] = useState([]); // for Post update summit event;

  // console.log(fullImageIdList);
  // console.log(fileList);

  useEffect(() => {
    // init values
    if (mode === 'update') {
      const initCondition = fullImageIdList.length === 0;
      const initImageIdList = originImageDatas.map((data) => data.id);
      initCondition && setFullImageIdList(initImageIdList);
      const initFileList = originImageDatas.map((data) => ({
        file: null,
        filename: data.filename,
        id: data.id,
        url: data.url,
      }));
      setFileList(initFileList);
    };
  }, [originImageDatas]);

  useEffect(() => {
    if (!isFirstRendering) {
      if (mode === 'update') {
        const currentImageIdList = fileList.map((list) => list.id);
        const originImageIdList = originImageDatas.map((list) => list.id);
        const resultImageIdList = compareImageList(
          fullImageIdList,
          currentImageIdList,
          originImageIdList,
        );
        console.log(resultImageIdList);
        const newImageValues = resultImageIdList?.cur.map((imageId, index)=>({
          id: imageId,
          leakOrder: (index+1) // order는 1부터 시작함.
        }))
        setFormValues((prevState) => ({
          ...prevState,
          [id]: newImageValues || [],
          addImageIdList: resultImageIdList?.add || [],
          deleteImageIdList: resultImageIdList?.del || [],
        }));
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          [id]: !fileList.length ? '필수항목입니다.' : '',
        }));
        const currentFileIdList = fileList.map((list) => list.id);
        setFormValues((prevState) => ({
          ...prevState,
          [id]: prevState[id].filter((list) => currentFileIdList.indexOf(list.id) >= 0),
        }));
      }
    }
    setIsFirstRendering(false);
  }, [fileList]);

  const multipleImageFileChangeHandler = async (e) => {
    const curFiles = e.currentTarget.files;
    const currentFileListCount = fileList.length;
    const updatedFileListCount = curFiles.length;
    if (currentFileListCount + updatedFileListCount > maxImageCount) {
      return alert(`이미지는 최대 ${maxImageCount}장까지 등록할 수 있습니다.`);
    }

    try {
      if (curFiles.length === 1) {
        const file = curFiles[0];
        const hasError = valid_fileSize(file, maxFileSize);
        if (hasError) return;
        setIsLoading(true);
        const leakOrder = currentFileListCount + 1;
        const response = await uploadImage(
          file,
          setFormValues,
          id,
          setFormErrors,
          apiUrl,
          leakOrder,
        );

        setFileList((prevState) => [
          ...prevState,
          { file: file, filename: file.name, id: response.id, url: response.url },
        ]);
        setFullImageIdList((prevState) => [...prevState, response.id]);
      } else if (curFiles.length > 1) {
        let newFileList = [];
        let fileCount = currentFileListCount;
        for (const filesKey in curFiles) {
          const leakOrder = fileCount + 1;
          const file = curFiles[filesKey];
          if (typeof file !== 'object') break; // file 순회 시 파일 외 요소 filtering
          const hasError = valid_fileSize(file, maxFileSize);
          if (hasError) break;
          setIsLoading(true);
          const response = await uploadImage(
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
        setFullImageIdList((prevState) => prevState.concat(newfileIdList));
      }
    } catch (err) {
      console.log(err);
      alert('Error 발생: ', err);
    }
    setIsLoading(false);
  };

  const onDeleteThumbHandler = (e) => {
    const thumb = e.currentTarget;
    const tobeDeletedButtonId = Number(thumb.dataset.id);
    // console.log('삭제될 이미지 ID:', tobeDeletedButtonId);
    const newFileList = fileList.filter((list) => list.id !== tobeDeletedButtonId);
    setFileList(newFileList);
  };

  return (
    <>
      <div className="inp_section multiImageBox">
        <div className="col-5 grid-box grid-column col-5">
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
        <label className="inp_wrap file" htmlFor={id}>
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
              loadingIcon={
                isLoading && (
                  <Spinner
                    style={{ color: 'var(--color-main)', width: '15', height: '15' }}
                    speed={0.6}
                  />
                )
              }
            />
          </div>
        </label>
        <div className="desc">
          <p>* 이미지는 최소 1장, 최대 {maxImageCount}장 등록가능합니다.</p>
          <p>
            * 파일크기는 {convertFileSizeToMegabyte(maxFileSize)}MB이하 / jpg, jpeg, png, gif 형식만
            등록가능합니다.
          </p>
        </div>
        {formErrors[id] && <ErrorMessage>{formErrors[id]}</ErrorMessage>}
      </div>
    </>
  );
}

const uploadImage = async (file, setFormValues, id, setFormErrors, postApiUrl, leakOrder) => {
  let result = {
    id: '',
    url: '',
    leakOrder: undefined,
  };
  const formData = new FormData();
  formData.append('file', file);
  const response = await postFileUpload(postApiUrl, formData); // ! ORIGIN CODE
  // const response = {// TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
  //   data: { id: Math.floor(Math.random() * 100), leakOrder: Math.floor(Math.random() * 100) },
  //   status: 200,
  // };

  const imageId = response.data.id;
  const imageUrl = response.data.url;
  const isFailed = response.status !== 200 && response.status !== 201;

  result.id = imageId;
  result.url = imageUrl;
  result.leakOrder = leakOrder;

  setFormValues((prevState) => ({
    ...prevState,
    [id]: [...prevState[id], { id: imageId, leakOrder: leakOrder }],
  }));
  setFormErrors((prevState) => ({
    ...prevState,
    [id]: isFailed && '업로드에 실패했습니다. 파일형식을 확인하세요.',
  }));

  return result;
};

const valid_fileSize = (file, maxFileSize) => {
  const error = file.size >= maxFileSize;
  if (error) {
    alert(
      `- 최대 파일크기: ${convertFileSizeToMegabyte(
        maxFileSize,
      )}MB 이상의 파일이 포함돼있습니다.\n- 초과된 파일명: ${
        file.name
      } \n- 초과된 파일크기: ${convertFileSizeToMegabyte(file.size)}MB`,
    );
  }
  return error;
};

const compareImageList = (allArrBefore, curArrBefore, originArrBefore) => {
  if (!allArrBefore.length) return console.error('There is no Image File.');

  const originArr = originArrBefore.map((a) => Number(a));
  const allArr = allArrBefore.map((a) => Number(a));
  const curArr = curArrBefore.map((a) => Number(a));

  let result = {
    origin: originArr, // very First image List
    all: allArr, // full image List
    cur: curArr, // innerHTML image List
    add: [], // new image List that have been completely uploaded in this process
    del: [], // the image List to be deleted
  };

  for (const key in result) {
    let arr = result[key];
    result[key] = arr.map((a) => Number(a));
  }

  allArr.map((id) => {
    const isCurArr = curArr.indexOf(id) >= 0;
    const isOriginArr = originArr.indexOf(id) >= 0;
    const isNew = isCurArr && !isOriginArr;
    const isToBeDeleted = curArr.indexOf(id) < 0;

    isNew && result.add.push(id);
    isToBeDeleted && result.del.push(id);
  });

  return result;
};
