import React, {useEffect, useMemo, useRef, useState} from 'react';
import 'react-quill/dist/quill.snow.css';
import { postFileUpload } from '/api/reqData';
import { formats, toolbarOptions } from './QuillEditorSettings';



export default function QuillEditor({ id, imageId, setFormValues, setImageList, imageUploadApiURL }) {

  const ReactQuill = typeof window == 'object' ? require('react-quill') : () => false;
  // * ----- 추후에 모듈 추가할 때 필요 ----- * //
  const Quill = typeof window == 'object' ? require('quill') : () => false;
  // * ----- 추후에 모듈 추가할 때 필요 ----- * //
  const quillRef = useRef();


  if(!setFormValues || typeof setFormValues !== 'function') return;

  const [body, setBody] = useState('');
  console.log(body);
  useEffect(() => {
    setFormValues(prevState => ({
      ...prevState,
      [id]: body
    }))
    // 블로그의 내에 삽입된 이미지 id와 순서
  }, [body]);





  const onContentChangeHandler = (innerHTML) => {
    setBody(innerHTML)
  }


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
      const response = await postFileUpload(imageUploadApiURL, formData);

      if (response.status !== 200 && response.status !== 201) return;
      const imageData = response.data;

      // console.log(imageData)
      const id = imageData.id.toString();
      const url = imageData.url;

      const editor = quillRef.current;
      const range = editor.getEditorSelection();
      const imageIndex = range?.index === 0 ? '0' : range?.index;

      editor.getEditor().insertEmbed(imageIndex, 'image', url + `#id=${id}#`);
      editor.getEditor().setSelection((range ? range.index : 0) + 1);
      document.body.querySelector(':scope > input').remove();

      setImageList((prevList) => [...prevList, id]);

      if(!imageId)return;
      setFormValues(prevState => ({
        ...prevState,
        [imageId] : [...prevState[imageId], id]
      }))
    };
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
    <ReactQuill
      id={id}
      theme="snow"
      modules={quillModules}
      formats={formats}
      placeholder={'내용을 입력하세요.'}
      preserveWhitespace // 띄어쓰기 보존
      onChange={onContentChangeHandler}
      // onBlur={onBlurhandler}
      ref={quillRef}
    />
  );
}

// * ------------------------------------------------------- * //
// * ------------------------------------------------------- * //
// * ------------------------------------------------------- * //
// * ------------------------------------------------------- * //
// * ------------------------------------------------------- * //

/*
 * Officaial Doc : https://quilljs.com/docs/api
 */

// // const QuillNoSSRWrapper = dynamic(
// //   async () => {
// //     const { default: RQ} = await import("react-quill");
// //     return function comp({ forwardedRef, ...props }) {
// //       return <RQ ref={forwardedRef} {...props} />;
// //     };
// //   },
// //   { ssr: false }
// // );

// const QuillEditor = ({ handleQuillChange }) => {
//   const quillRef = useRef();
//   const [enableEditor, setEnableEditor] = useState(false);
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     setEnableEditor(true);
//     // loadQuill();
//   }, [setEnableEditor]);

//   const onBlurhandler = (e) => {
//     console.log("blur:", e);
//   };

//   // const onChangehandler = (innerHTML) => {
//   //   handleQuillChange(innerHTML);
//   // };

//   const imageHandler = (e) => {
//     const input = document.createElement("input");

//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "image/*");
//     document.body.appendChild(input);

//     input.click();

//     input.onchange = async () => {
//       const [file] = input.files;
//       // const URL = `/api/admin/blogImage/upload`;
//       // const data = {
//       //   file: file,
//       // };
//       // const reponse = await postData(URL, file, null, "multipart/form-data");
//       // console.log(reponse);
//       // ! ------- 업로드...........여기서 에러난다.
//       // ! ------- 업로드...........여기서 에러난다.
//       // ! ------- 업로드...........여기서 에러난다.
//       // ! ------- 업로드...........여기서 에러난다.
//       // ! ------- 업로드...........여기서 에러난다.
//       // ! ------- 업로드...........여기서 에러난다.
//       // ! ------- 업로드...........여기서 에러난다.

//       // await uploadImage(presignedURL, file);

//       const range = quillRef.current.getEditorSelection();
//       quillRef.current.getEditor();
//       quillRef.current
//         .getEditor()
//         .insertEmbed(
//           range.index,
//           "image",
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp9eL42GbYri0fLCk2Eszu0YtdjYyVdq3jtpGvSEQzj4L2sIf7c3To1GqPP86JVmIDnx4&usqp=CAU"
//         );
//       quillRef.current.getEditor().setSelection(range.index + 1);
//       document.body.querySelector(":scope > input").remove();
//     };
//   };

//   const quillModules = {
//     toolbar: {
//       container: toolbarOptions,
//       handlers: { image: imageHandler },
//     },
//     history: {
//       delay: 2000,
//       maxStack: 500,
//       userOnly: true,
//     },
//     clipboard: {
//       matchVisual: false, // toggle to add extra line breaks when pasting HTML:
//     },
//     // imageResize: {
//     //   // quillModules: ["Resize"],
//     // },
//   };

//   return (
//     <>
//       {enableEditor && (
//         <QuillNoSSRWrapper
//           id={"quill-editor"}
//           theme="snow"
//           modules={quillModules}
//           formats={quillFormats}
//           placeholder={"내용을 입력하세요."}
//           forwardedRef={quillRef} // dynamic import > forwardedRef props 필수
//           preserveWhitespace // 띄어쓰기 보존import { postData } from '@api/reqData';
//           onBlur={onBlurhandler}
//           onChange={handleQuillChange}
//           // value={body || ""}
//         />
//       )}
//     </>
//   );
// };

//  export default QuillEditor;

// * Quill > 사진사이즈 조절 모듈 추가 > 추후 업데이트 반영
// const loadQuill = async () => {
//   return new Promise(async (resolve, reject) => {
//     const Quill = await require("react-quill").Quill;
//     const ImageResize = (await require("quill-image-resize")).default;
//     resolve({ Quill, ImageResize });
//   })
//     .then(({ Quill, ImageResize }) => {
//       Quill.register("modules/ImageResize", ImageResize);
//       console.log(Quill);
//       return;
//     })
//     .then((value) => {
//       setEnableEditor(true);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
