import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";





/*  
* Officaial Doc : https://quilljs.com/docs/api
 */



const quillFormats = [
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



const toolbarOptions = [
  [{ font: [] }],
  [{ header: [false, 6, 5, 4, 3, 2, 1] }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ color: [] }, { background: [] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ align: [] }],
  [
    { indent: "-1" },
    { indent: "+1" },
    { list: "ordered" },
    { list: "bullet" },
  ],
  ["link", "image"],
  ["clean"],
];






const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ} = await import("react-quill");
    return function comp({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);






const QuillEditor = ({ handleQuillChange }) => {
  const [enableEditor, setEnableEditor] = useState(false);

  const quillRef = useRef();
  // const [isError, setIsError] = useState(false);
  // const [isLoaded, setIsLoaded] = useState(false);

  const loadQuill = async () => {
    return new Promise(async (resolve, reject) => {
      const Quill = await require("react-quill").Quill;
      const ImageResize = (await require("quill-image-resize")).default;
      resolve({ Quill, ImageResize });
    })
      .then(({ Quill, ImageResize }) => {
        Quill.register("modules/ImageResize", ImageResize);
        console.log(Quill);
        return;
      })
      .then((value) => {
        setEnableEditor(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setEnableEditor(true);
    loadQuill();
  }, [setEnableEditor]);

  const onBlurhandler = (e) => {
    console.log("blur:", e);
  };

  const onChangehandler = (innerHTML) => {};

  const imageHandler = (e) => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    document.body.appendChild(input);

    input.click();

    input.onchange = async () => {
      const [file] = input.files;
      // * -------- 업로드하고 image url 받아오기
      // ! 주소 받아오기
      // const { preSignedPutUrl: presignedURL, readObjectUrl: imageURL } = (
      //   await getS3PresignedURL(file.name)
      // ).data;
      // await uploadImage(presignedURL, file);

      console.log(file);
      const range = quillRef.current.getEditorSelection();
      console.log(range);
      quillRef.current.getEditor();
      console.log(quillRef.current);
      quillRef.current
        .getEditor()
        .insertEmbed(
          range.index,
          "image",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp9eL42GbYri0fLCk2Eszu0YtdjYyVdq3jtpGvSEQzj4L2sIf7c3To1GqPP86JVmIDnx4&usqp=CAU"
        );
      quillRef.current.getEditor().setSelection(range.index + 1);
      document.body.querySelector(":scope > input").remove();
    };
  };

  const quillModules = {
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
  };

  return (
    <>
      {enableEditor && (
        <QuillNoSSRWrapper
          id={"quill-editor"}
          theme="snow"
          modules={quillModules}
          formats={quillFormats}
          placeholder={"내용을 입력하세요."}
          forwardedRef={quillRef} // dynamic import > forwardedRef props 필수
          preserveWhitespace // 띄어쓰기 보존
          onBlur={onBlurhandler}
          onChange={onChangehandler}
          value={""}
        />
      )}
    </>
  );
};


 export default QuillEditor;