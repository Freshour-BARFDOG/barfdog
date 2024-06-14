import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { formats, toolbarOptions } from './QuillEditorSettings';
import { postFileUpload } from '/src/pages/api/reqData';
import Spinner from 'src/components/atoms/Spinner';
import s from './editor.module.scss';

/*
 * - Officaial Doc : https://quilljs.com/docs/api
 * - * 이미지 고유 id: 이미지 업로드 후 , api를 통하여 부여받음
 *   -> body(innerHTML)에 삽입
 *   -> 부모 component에서 innerHTML의 str을 통하여 이미지 id값 추출
 */

/* Usage In UserScreen
 * - 1. css file을 import
 * - import 'react-quill/dist/quill.snow.css';
 * - 2. HTML Tag class => 'view ql-editor' 추가.
 * - <div className={`view ql-editor`}
 * -  dangerouslySetInnerHTML={{ __html: itemInfo.contents }}></div>
 * - (global에서 css파일들이 섞이지 않도록 유의)
 * */

export default function QuillEditor({
  id,
  imageId,
  setFormValues,
  imageUploadApiURL,
  originImageIdList = [],
  initialValue,
  formValuesKey,
  mode = 'create',
}) {
  /* - 모듈 추가 시, 필요
   * const Quill = typeof window == 'object' ? require('quill') : () => false;
   */

  const ReactQuill =
    typeof window == 'object' ? require('react-quill') : () => false;
  const quillRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitAllImageIdListCompleted, setIsInitAllImageIdListCompleted] =
    useState(false);
  const [body, setBody] = useState(initialValue);
  const [allImageIdList, setAllImageIdList] = useState(originImageIdList);

  useEffect(() => {
    if (isInitAllImageIdListCompleted) return;
    setAllImageIdList(originImageIdList);
    setIsInitAllImageIdListCompleted(true);
  }, [originImageIdList]);

  useEffect(() => {
    const isInnerHtmlEmpty = body === '<p><br></p>';
    const resultIdList =
      analyze_ImageIdListCRUD(allImageIdList, body, originImageIdList) || [];
    // // console.log('::: Quill Editor Inner Image > CRUD RESULT :::', resultIdList);
    if (mode === 'create') {
      setFormValues((prevState) => ({
        ...prevState,
        [id]: isInnerHtmlEmpty ? '' : body,
        [imageId]: resultIdList?.cur || [],
      }));
    }

    if (mode === 'update') {
      // if (!resultIdList) return; // ! important validation: allImageIdList가 init되기 전에 실행될 경우, undefined가 반환되고, formvalue에 적절하지 않은 값들이 할당됨 => updatePage에서 정상작동하지 않게 됨.
      if (formValuesKey) {
        const { addImageKey, delImageKey } = formValuesKey;
        setFormValues((prevState) => ({
          ...prevState,
          [id]: isInnerHtmlEmpty ? '' : body,
          [addImageKey]: resultIdList?.cur,
          [delImageKey]: resultIdList?.del,
        }));
      } else {
        setFormValues((prevState) => ({
          ...prevState,
          [id]: isInnerHtmlEmpty ? '' : body,
          addImageIdList: resultIdList?.cur,
          deleteImageIdList: resultIdList?.del,
        }));
      }
    }
  }, [body, allImageIdList]);

  const imageHandler = () => {
    if (!imageUploadApiURL) return;
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    document.body.appendChild(input);
    input.click();
    input.onchange = async () => {
      const [file] = input.files;
      const formData = new FormData();
      formData.append('file', file);
      try {
        setIsLoading(true);
        const response = await postFileUpload(imageUploadApiURL, formData);
        if (response.status !== 200 && response.status !== 201) return;
        const imageData = response.data;

        const id = imageData.id.toString();
        const url = imageData.url;

        const editor = quillRef.current;
        const range = editor.getEditorSelection();
        const imageIndex = range?.index === 0 ? '0' : range?.index;

        editor.getEditor().insertEmbed(imageIndex, 'image', url + `#id=${id}#`);
        editor.getEditor().setSelection((range ? range.index : 0) + 1);
        document.body.querySelector(':scope > input').remove();
        if (!imageId) return;
        setAllImageIdList((prevState) => [...prevState, id]);
      } catch (err) {
        // // console.log(err);
        alert(`에러가 발생했습니다.\n${err}`);
      }
      setIsLoading(false);
    };
  };

  const onContentChangeHandler = (innerHTML) => {
    setBody(innerHTML);
  };

  const quillModules = useMemo(
    // 코드 위치 중요 // imageHandler 보다 늦게 실행되어야함
    () => ({
      toolbar: {
        container: toolbarOptions,
        handlers: { image: imageHandler },
      },
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: true,
      },
      clipboard: {
        matchVisual: false, // toggle to add extra line breaks when pasting HTML:
      },
      // imageResize: {
      //   // quillModules: ["Resize"],
      // },
    }),
    [],
  );

  return (
    <div className={s['editor-wrap']}>
      <ReactQuill
        id={id}
        theme="snow"
        modules={quillModules}
        formats={formats}
        placeholder={'내용을 입력하세요.'}
        preserveWhitespace // 띄어쓰기 보존
        onChange={onContentChangeHandler}
        defaultValue={initialValue}
        ref={quillRef}
      />
      {isLoading && (
        <Spinner
          className={s.spinner}
          style={{ color: 'var(--color-main)', width: '15', height: '15' }}
          speed={0.6}
        />
      )}
    </div>
  );
}

const analyze_ImageIdListCRUD = (
  standardImageIdList,
  innerHTML = '',
  originImageIdList = [],
) => {
  let result;
  if (!standardImageIdList.length) return;
  const currentImageIdList = extractImageIdList(innerHTML);
  result = compareImageList(
    standardImageIdList,
    currentImageIdList,
    originImageIdList,
  );
  return result;
};

const extractImageIdList = (html = '') => {
  let curimageIdList = [];

  const queryImageTag = html.split('<img');
  queryImageTag.filter((str) => {
    if (str.indexOf('src') < 0) return;
    const imgTag = str.split('>')[0];
    const queryFileData = imgTag.split('?')[1];
    const queryImageData = queryFileData.split('#')[1];
    const id = queryImageData.split('=')[1];
    if (id) {
      curimageIdList.push(id);
    }
  });
  return curimageIdList;
};

const compareImageList = (
  allArrBefore = [],
  curArrBefore = [],
  originArrBefore = [],
) => {
  if (!allArrBefore.length) return; // console.log('There is no Image File.');

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

  // // console.log(allArrBefore);
  // // console.log(allArr);
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

// * Quill > 사진사이즈 조절 모듈 추가 > 추후 업데이트 반영
// const loadQuill = async () => {
//   return new Promise(async (resolve, reject) => {
//     const Quill = await require("react-quill").Quill;
//     const ImageResize = (await require("quill-image-resize")).default;
//     resolve({ Quill, ImageResize });
//   })
//     .then(({ Quill, ImageResize }) => {
//       Quill.register("modules/ImageResize", ImageResize);
//       // console.log(Quill);
//       return;
//     })
//     .then((value) => {
//       setEnableEditor(true);
//     })
//     .catch((err) => {
//       // console.log(err);
//     });
// };
