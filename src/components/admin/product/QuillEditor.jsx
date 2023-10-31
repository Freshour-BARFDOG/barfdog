import React, {useEffect, useState} from 'react';
import dynamic from "next/dynamic";

export default function QuillEditor() {

  const originImageList = ['1','197','200']; // 서버로부터 받은 이미지리스트
  const [tempImageIdList, setTempImageIdList] = useState(originImageList || []);
  const [body, setBody] = useState(""); // Quill 에디터의 innerHTML을 담는 state
  const [isLoadedEditor, setIsLoadedEditor] = useState(false);
  const [Editor, setEditor] = useState('');

  useEffect(() => {
    if (document) {
      const QuillEditor = dynamic(() =>
        import("/src/components/admin/form/QuillEditor")
      );
      setIsLoadedEditor(true);
      setEditor(QuillEditor);
    }
  }, []);

  // // console.log(body);



  return (
    <>
      {/* // * --------- QUILL EDITOR --------- * // */}
      {isLoadedEditor && (
        <Editor
          body={body}
          handleQuillChange={setBody}
          setTempImageIdList={setTempImageIdList}
          apiImageUploadURL={'BLOCK'}
        />
      )}
      {/* // * --------- QUILL EDITOR --------- * // */}
    </>
  )
};