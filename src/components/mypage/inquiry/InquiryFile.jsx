import s from 'src/pages/bf-admin/community/inquiry/[id]/adminInquiry[id].module.scss';
import { FiPaperclip } from 'react-icons/fi';
import React from 'react';
import { getData } from '/src/pages/api/reqData';

export const InquiryFile = ({ file }) => {
  const onDownload = async () => {
    const id = file.id;
    const apiUrl = `/api/questions/file/${id}`;
    await handleFileDownload(apiUrl, file.filename);
  };
  return (
    <button className={s['download-button']} download onClick={onDownload}>
      <FiPaperclip />
      <span className={s['file-name']}>{file.filename}</span>
    </button>
  );
};


async function handleFileDownload(apiUrl, filename = 'barfdog-files') {

  const res = await getData(apiUrl, null);
  if (res?.status !== 200) return;
  const binaryImageString = res.data.imageData;
  const file = new Blob([binaryImageString], {type: 'image/png'});
  console.log(file)
  // const downloadUrl = URL.createObjectURL(file); // 해당 file을 가리키는 url 생성
  const downloadUrl = `data:image/png;base64,${binaryImageString}`; // 중요

  const a = document.createElement('a');
  document.body.appendChild(a);
  
  a.href = downloadUrl;
  a.download = filename;
  a.click(); // Download Event Trigger
  
  document.body.removeChild(a); // cleanup
  // window.URL.revokeObjectUrl(downloadUrl); // cleanup - 쓰임을 다한 url 객체 삭제

}
