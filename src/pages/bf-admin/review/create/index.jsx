import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { useRouter } from 'next/router';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import s from './create.module.scss';
import RatingStars from '/src/components/atoms/RatingStars';
import SelectTag from '/src/components/atoms/SelectTag';
import ToolTip from '/src/components/atoms/Tooltip';
import { transformToday } from '/util/func/transformDate';
import { global_reviewType } from '/store/TYPE/reviewType';
import { global_itemType } from '/store/TYPE/itemType';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { validate } from '/util/func/validation/validation_review';
import { valid_couponCode, valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { getData, postObjData } from '/api/reqData';
import CustomSelect from '/src/components/admin/form/CustomSelect';
import Spinner from '/src/components/atoms/Spinner';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { useModalContext } from '/store/modal-context';
import FileInput from '/src/components/admin/form/FileInput';
import GoodsFlowTest from "/src/pages/api/goodsFlow";

const initialFormValues = {
  // type: '', // str
  // id: null, // num // 정기 구독 상품 또는 일반 상품의 id
  type: global_reviewType.ITEM, // ! TESET
  id: 1, // ! TEST
  writtenDate: transformToday(), // str (yyyy-mm-dd)
  star: 5, // num
  contents: '', // str
  username: '', // str
  reviewImageIdList: [], // array : 리뷰 이미지 id 리스트
};

function CreateRewardPage() {
  const router = useRouter();
  const postFormValuesApiUrl = '/api/admin/reviews';
  const mct = useModalContext();
  const maxContentsLength = 1000;

  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});

  const defaultItemOptionList = [{ label: '상품 선택', value: '' }];
  const [itemOptionList, setItemOptionList] = useState(defaultItemOptionList);
  const [singleItemCategory, setSingleItemCategory] = useState(global_itemType.ALL);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // console.log(formValues);
  // console.log(formErrors)
  
  

  useEffect(() => {
    if (!formValues.type) return;
    const getRecipeListApiUrl = '/api/admin/reviews/recipes';
    const getItemListApiUrl = `/api/admin/reviews/items/${singleItemCategory}`;

    let apiUrl;
    let dataQuery;
    if (formValues.type === global_reviewType.SUBSCRIBE) {
      apiUrl = getRecipeListApiUrl;
      dataQuery = 'reviewRecipesDtoList';
    } else if (formValues.type === global_reviewType.ITEM) {
      apiUrl = getItemListApiUrl;
      dataQuery = 'reviewItemsDtoList';
    }
    const TEST_itemOptionList = [
      {
        label: `${formValues.type} > 아이템 1`,
        value: 1,
      },
      {
        label: `${formValues.type} > 아이템 2`,
        value: 2,
      },
      {
        label: `${formValues.type} > 아이템 3`,
        value: 3,
      },
    ];

    setItemOptionList(defaultItemOptionList.concat(TEST_itemOptionList));
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(apiUrl);
        const dataList = res.data?._embedded[dataQuery];
        if (!res.data || !dataList.length) return alert('데이터가 존재하지 않습니다.');
        console.log(data);
        const itemOptionList = dataList.map((data) => ({
          label: data.name,
          value: data.id,
        }));
        setItemOptionList(defaultItemOptionList.concat(itemOptionList));
      } catch (err) {
        console.error(err.response);
        // alert('데이터를 가져올 수 없습니다.');
      }

      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [formValues.type, singleItemCategory]);

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    console.log(id, value);

    setFormValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) {
      console.error('이미 제출된 양식입니다.');
      return onGlobalModalCallback();
    }

    const convertedFormValues = {
      ...formValues,
      id: Number(formValues.id),
    };
    console.log(formValues);
    console.log(convertedFormValues);
    const errObj = validate(convertedFormValues, { contents: maxContentsLength });
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return alert('유효하지 않은 항목이 있습니다.');

    return;
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const res = await postObjData(postFormValuesApiUrl, convertedFormValues);
      console.log(res);
      if (res.isDone) {
        onShowModalHandler('리뷰가 성공적으로 생성되었습니다.');
        setIsSubmitted(true);
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (err) {
      alert('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };
  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };

  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onGlobalModalCallback = () => {
    mct.alertHide();
    router.push('/bf-admin/review/normal');
  };

  return (
    <>
      <MetaTitle title="리뷰 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h2 className={s.title}>후기 생성</h2>
          <form className={`${s.form} cont`} encType="multipart/form-data" method="post">
            <div className={`${s.formGuide}`}>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="type">
                      상품카테고리
                    </label>
                    <ToolTip
                      message={'카테고리 선택 후 생성이 시작됩니다.'}
                      messagePosition={'center'}
                    />
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <CustomSelect
                        id="type"
                        options={[
                          { label: '선택', value: '' },
                          {
                            label: global_reviewType.KOR.SUBSCRIBE,
                            value: global_reviewType.SUBSCRIBE,
                          },
                          { label: global_reviewType.KOR.ITEM, value: global_reviewType.ITEM },
                        ]}
                        value={formValues.type}
                        setFormValues={setFormValues}
                      />
                      {formValues.type === global_reviewType.ITEM && (
                        <label htmlFor="singleItemCategory" className={s['addedCategory']}>
                          <SelectTag
                            id={'singleItemCategory'}
                            onChange={setSingleItemCategory}
                            options={[
                              { label: global_itemType.KOR.ALL, value: global_itemType.ALL },
                              { label: global_itemType.KOR.RAW, value: global_itemType.RAW },
                              {
                                label: global_itemType.KOR.TOPPING,
                                value: global_itemType.TOPPING,
                              },
                              { label: global_itemType.KOR.GOODS, value: global_itemType.GOODS },
                            ]}
                          />
                        </label>
                      )}
                      {isLoading.fetching && <Spinner />}
                      {formErrors.type && <ErrorMessage>{formErrors.type}</ErrorMessage>}
                    </div>
                  </div>
                </div>
              </div>

              {formValues.type && (
                <>
                  <section className="cont_divider">
                    <div className="input_row">
                      <div className="title_section fixedHeight">
                        <label className="title" htmlFor="id">
                          상품명
                        </label>
                      </div>
                      <div className="inp_section">
                        <div className="inp_box">
                          <CustomSelect
                            id="id"
                            options={itemOptionList}
                            value={formValues.id}
                            setFormValues={setFormValues}
                          />
                          {formErrors.id && <ErrorMessage>{formErrors.id}</ErrorMessage>}
                        </div>
                      </div>
                    </div>
                  </section>
                  {/* cont_divider */}
                  {formValues.id && (
                    <>
                      <section className="cont_divider">
                        <div className="input_row">
                          <div className="title_section fixedHeight">
                            <label className="title" htmlFor="writtenDate">
                              작성일자
                            </label>
                          </div>
                          <div className="inp_section">
                            <div className={`${s.inp_box} ${s.date} inp_box`}>
                              <input
                                id={'writtenDate'}
                                type="date"
                                value={formValues.writtenDate}
                                onChange={onInputChangeHandler}
                              />
                              {formErrors.writtenDate && (
                                <ErrorMessage>{formErrors.writtenDate}</ErrorMessage>
                              )}
                            </div>
                          </div>
                        </div>
                      </section>
                      {/* cont_divider */}
                      <section className="cont_divider">
                        <div className="input_row">
                          <div className="title_section fixedHeight">
                            <label className="title" htmlFor={'username'}>
                              유저 이름
                            </label>
                          </div>
                          <div className="inp_section">
                            <div className="inp_box">
                              <input
                                type="text"
                                id="username"
                                placeholder={'리뷰에 표기될 유저이름을 입력하세요.'}
                                className="fullWidth"
                                value={formValues.username}
                                onChange={onInputChangeHandler}
                              />
                              {formErrors.username && (
                                <ErrorMessage>{formErrors.username}</ErrorMessage>
                              )}
                            </div>
                          </div>
                        </div>
                      </section>
                      {/* cont_divider */}
                      <section className={s.how_was}>
                        <div className={s.text}>상품은 어떠셨나요?</div>
                        <div>
                          <RatingStars
                            id={'star'}
                            count={formValues.star}
                            margin={12}
                            size={25}
                            setFormValues={setFormValues}
                          />
                        </div>
                      </section>
                      <section className={s.body}>
                        <div className={s.flex}>
                          <div className={s.left_side}>
                            <label htmlFor={'contents'} className={s.text2}>
                              상세리뷰
                            </label>
                          </div>
                          <div className={s.right_side}>
                            <div className={s.input_wrap}>
                              <textarea
                                id={'contents'}
                                placeholder="50자 이상 작성시 300원이 적립됩니다.&#13;상품에 대한 견주님의 의견을 남겨주시면 큰 힘이 됩니다."
                                onChange={onInputChangeHandler}
                                value={formValues.contents}
                              />
                              <span className={s['textLength-indicator']}>
                                {formValues.contents.length}/{maxContentsLength}
                              </span>
                            </div>
                            {formErrors.contents && (
                              <ErrorMessage>{formErrors.contents}</ErrorMessage>
                            )}
                          </div>
                        </div>
                      </section>
                      <section className={s.picture_attach}>
                        <div className={s.flex}>
                          <div className={s.left_side}>
                            <label htmlFor={'reviewImageIdList'} className={s.text2}>
                              사진첨부
                            </label>
                            <div className={s.outer}>
                              <div className={s.red_text}>500원 추가적립!</div>
                            </div>
                          </div>
                          <div className={s.right_side}>
                            <FileInput
                              id={'reviewImageIdList'}
                              // apiUrl={postThumbFileApiUrl}
                              setFormValues={setFormValues}
                              formErrors={formErrors}
                              setFormErrors={setFormErrors}
                              // originImageDatas={originThumbDataList}
                              maxImageCount={10}
                              maxFileSize={20000000}
                              mode={'create'}
                              required={false}
                              theme={'modern'}
                            />
                          </div>
                        </div>
                      </section>
                      <section className={s['btn-section']}>
                        <button type={'button'} className={s.cancel} onClick={returnToPrevPage}>
                          취소
                        </button>
                        <button type={'button'} className={s.save} onClick={onSubmit}>
                          {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '등록'}
                        </button>
                      </section>
                    </>
                  )}
                </>
              )}
            </div>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

export default CreateRewardPage;

