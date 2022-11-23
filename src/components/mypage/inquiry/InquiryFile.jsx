import s from 'src/pages/bf-admin/community/inquiry/[id]/adminInquiry[id].module.scss';
import { FiPaperclip } from 'react-icons/fi';
import React from 'react';
import { getData } from '/src/pages/api/reqData';

export const InquiryFile = ({ file }) => {
  const onDownload = async () => {
    const id = 5 || file.id;
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
  const blobFileConfig = {
    xhrFields: { responseType: 'blob' },
  };
  const res = await getData(apiUrl, null, blobFileConfig);
  console.log(res);
  if (res?.status !== 200) return;
  const file = await res.blob();
  const downloadUrl = window.URL.createObjectURL(file); // 해당 file을 가리키는 url 생성

  const a = document.createElement('a');
  document.body.appendChild(a);
  a.download = filename; // a tag에 download 속성을 줘서 클릭할 때 다운로드가 일어날 수 있도록 하기
  a.href = downloadUrl; // href에 url 달아주기

  a.click(); // 코드 상으로 클릭을 해줘서 다운로드를 트리거

  document.body.removeChild(a); // cleanup - 쓰임을 다한 a 태그 삭제
  window.URL.revokeObjectUrl(downloadUrl); // cleanup - 쓰임을 다한 url 객체 삭제
}
