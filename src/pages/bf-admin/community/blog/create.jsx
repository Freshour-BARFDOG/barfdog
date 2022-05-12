import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import "react-quill/dist/quill.snow.css";

/* 

https://velog.io/@khy226/Next.js-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90-React-Quill%ED%85%8D%EC%8A%A4%ED%8A%B8-%EC%97%90%EB%94%94%ED%84%B0-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0


https://jaddong.tistory.com/entry/Nextjs%EC%97%90%EC%84%9C-Quill-Editor-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
*/

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});





/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */






  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      // ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "background",
    "color",
    "link",
    "image",
    "video",
    "width",
  ];



const CreateBlogPage = () => {
  const [body, setBody] = useState("내용을"); // Quill 에디터의 innerHTML을 담는 state
  const [mountBody, setMountBody] = useState(false); // 리렌더링 용도 state
  function rerenderBody() {
    setMountBody((mb) => !mb);
  }

  // const quillRef = useRef(null);
  // useEffect(() => {
  //   const handleImage = () => {};

  //   if (quillRef.current) {
  //     console.log(quillRef.current.retry);
  //     const { getEditor } = quillRef.current;
  //     // console.log(getEditor);
  //     // const toolbar = quillRef.current.getEditor().getModule("toolbar");
  //     // toolbar.addHandler("image", handleImage);
  //   }
  // }, [quillRef]);
  // const onChangeHandler = (innerValues) => {
  //   // setInnerHTML(innerValues);
  //   console.log(innerValues);
  // };

  return (
    <>
      <MetaTitle title="블로그 작성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <QuillEditor
            // {...rest}
            // ref={quillRef}
            // // value={innerHTML}

            // theme="snow"
            // modules={modules}
            // formats={formats}
            // placeholder={placeholder}
            // preserveWhitespace
            // onChange={onChangeHandler}
            body={body}
            handleQuillChange={setBody}
            mountBody={mountBody}
          />
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
};;

export default CreateBlogPage;

let firstRender = true;




function QuillEditor({ body, handleQuillChange, mountBody }) {
    const quillElement = useRef();
    const quillInstance = useRef();

    const [isError, setIsError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      console.log('Render')
      if (!firstRender) return;
      console.log(quillElement.current);
      console.log(quillElement.current.innerHTML);
      if (isLoaded) {
        /* isLoaded가 true인 상태에서 rerenderBody를 통해 body 적용시 Quill 초기화 없이
               innerHTML만 body로 바꿉니다. 이 조건이 없을 시 툴바가 중복되어 여러 개 나타나게
               됩니다. */
        const quill = quillInstance.current;
        console.log(quill);
        quill.root.innerHTML = body;
        return;
      }

      if (quillElement.current && window.Quill) {
        /* isLoaded가 false일 때는 Quill을 초기화합니다. */

        /* Quill 옵션을 원하는 대로 수정하세요. */
        const toolbarOptions = {
          container: [
            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ align: [] }],
            ["bold", "italic", "underline", "strike"], // toggled buttons
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction
            ["clean"], // remove formatting button
            ["blockquote", "link", "code-block", "formula", "image", "video"], // media
          ],
        };

        quillInstance.current = new window.Quill(quillElement.current, {
          modules: {
            history: {
              delay: 2000,
              maxStack: 500,
              userOnly: true,
            },
            syntax: true,
            toolbar: toolbarOptions,
          },
          placeholder: "본문 입력",
          theme: "snow",
        });

        const quill = quillInstance.current;

        quill.root.setAttribute("spellcheck", "false");

        // 초기 body state 적용
        quill.root.innerHTML = body;

        /* quill에서 text-change 이벤트 발생시에 setBody(innerHTML)을 통해 body를 업데이트합니다.
               body가 업데이트되어도 useEffect 발생 조건 인자([isError, mountBody])에 body가 없으므로
               QuillEditor 컴포넌트는 다시 렌더링되지 않습니다. 이는 입력 중 커서가 맨 앞으로 이동하는
               문제를 방지합니다. 대신 외부에서 body가 수정되어도 rerenderBody가 호출되지 않으면 변경된
               body가 적용되지 않습니다. */
        quill.on("text-change", () => {
          handleQuillChange(quill.root.innerHTML);
        });
        setIsLoaded(true);
      } else {
        /* quill.min.js가 로드되어 있지 않아 window.Quill이 undefined이면 isError가
               계속 변경되면서 재시도합니다. */
        setIsError((prevIsError) => !prevIsError);
      }
      firstRender = false;
    }, [firstRender, body, isError]);


    return (
        <div ref={quillElement}></div>
    );
}