import {postFileUpload, putObjData} from '/src/pages/api/reqData';

const uploadImageToApiServer = async (
  file,
  setFormValues,
  id,
  setFormErrors,
  postApiUrl,
  leakOrder,
  option={method:'POST', body: {}},
) => {
  let result = {
    id: '',
    url: '',
    leakOrder: undefined,
  };
  const formData = new FormData();
  formData.append('file', file);
  let response;
  if(option.method === 'POST') {
    response = await postFileUpload(postApiUrl, formData); // ! ORIGIN CODE
  } else if(option.method === 'PUT') {
    response = await putObjData(postApiUrl, option.body)
  }
  const imageId = response.data.id;
  const imageUrl = response.data.url;
  const isFailed = response.status !== 200 && response.status !== 201;
  
  result.response = response;
  result.id = imageId;
  result.url = imageUrl;
  result.leakOrder = leakOrder;
  if (setFormValues && typeof setFormValues === 'function') {
    setFormValues((prevState) => {
      return id ? {
        ...prevState,
        [id]: [...prevState[id], {id: imageId, leakOrder: leakOrder}],
      } : {id: imageId, leakOrder: leakOrder}
    });
  }
  
  if (setFormErrors && typeof setFormErrors === 'function') {
    setFormErrors((prevState) => ({
      ...prevState,
      [id]: isFailed && '업로드에 실패했습니다. 파일형식을 확인하세요.',
    }));
  }
  return result;
};

export default uploadImageToApiServer;