import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import s from './dogInfo.module.scss';
import pc from '/src/components/atoms/pureCheckbox.module.scss';
import { useModalContext } from '/store/modal-context';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import {
  PopupCloseButton,
  PopupCloseButton_typeX,
} from '/src/components/popup/PopupCloseButton';
import { getData, putObjData, getDataSSR } from '/src/pages/api/reqData';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import { transformBirthDay } from '/util/func/transformBirthDay';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import transformDate from '../../../../../util/func/transformDate';
import transformLocalCurrency from '../../../../../util/func/transformLocalCurrency';
import SurveyStep1 from '../../../../components/survey/SurveyStep1';
import SurveyStep2 from '../../../../components/survey/SurveyStep2';
import SurveyStep3 from '../../../../components/survey/SurveyStep3';
import Spinner from '../../../../components/atoms/Spinner';
import Modal_confirm from '../../../../components/modal/Modal_confirm';
import Modal_global_alert from '../../../../components/modal/Modal_global_alert';
import { validate } from '/util/func/validation/validation_survey';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZero from '/util/func/filter_extraIntegerNumberZero';
import filter_ints from '/util/func/filter_ints';
import filter_demicals from '/util/func/filter_demicals';
import { useSubscribeInfo } from '/util/hook/useSubscribeInfo';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import { useSubscribePlanInfo } from '/util/hook/useSubscribePlanInfo';
import { useSubscribeRecipeInfo } from '/util/hook/useSubscribeRecipeInfo';
import { calcOneMealGramsWithRecipeInfo } from '/util/func/subscribe/calcOneMealGramsWithRecipeInfo';
import { calcSubscribePrice } from '/util/func/subscribe/calcSubscribePrices';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import { patchObjData, postObjData } from '../../../api/reqData';
import { ConfigProvider, DatePicker, Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { originSubscribeIdList } from '/util/func/subscribe/originSubscribeIdList';

export default function Popup_DogDetailPage({ DATA, dogIdx }) {
  // console.log('!!!!!!DATA!!!!!!!', DATA);

  const mct = useModalContext();
  const router = useRouter();
  const hasAlert = mct.hasAlert;
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [activeConfirmPlanChangeModal, setActiveConfirmPlanChangeModal] =
    useState(false);
  const [
    activeConfirmNextPaymentPriceChangeModal,
    setActiveConfirmNextPaymentPriceChangeModal,
  ] = useState(false);
  const [
    activeConfirmmGramPerRecipeChangeModal,
    setActiveConfirmGramPerRecipeChangeModal,
  ] = useState(false);

  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState({});
  const [tempValues, setTempValues] = useState({});
  const [modalMessage, setModalMessage] = useState('');
  const [submitState, setSubmitState] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isOriginSubscriber, setIsOriginSubscriber] = useState(false);
  const [nextPriceText, setNextPriceText] = useState(
    DATA?.subscribeDetailInfo.subscribeDto.nextPaymentPrice,
  );
  const [originalPrice, setOriginalPrice] = useState(
    DATA?.subscribeDetailInfo.subscribeDto.nextPaymentPrice.toLocaleString(),
    null,
  );
  const [originalGramPerRecipe, setOriginalGramPerRecipe] = useState({
    gram1:
      DATA?.subscribeDetailInfo.subscribeDto.oneMealGramsPerRecipe?.split(
        ', ',
      )[0],
    gram2:
      DATA?.subscribeDetailInfo.subscribeDto.oneMealGramsPerRecipe?.split(
        ', ',
      )[1],
  });
  const subscribeInfo = useSubscribeInfo(DATA?.dogDto.subscribeId);
  const currentPlanName = subscribeInfo?.info.planName;
  const subscribePlanInfo = useSubscribePlanInfo();
  const recipeInfo = useSubscribeRecipeInfo();

  // tooltip 활성화
  const [isActive, setIsActive] = useState({
    nextPaymentPrice: false,
    overDiscount: false,
  });

  const onMouseEnterHandler = (e, label) => {
    setIsActive((prevState) => ({
      ...prevState,
      [label]: true,
    }));
  };

  const onMouseLeaveHandler = (e, label) => {
    setIsActive((prevState) => ({
      ...prevState,
      [label]: false,
    }));
  };

  // console.log('subscribePlanInfo>>>>>', subscribePlanInfo);
  // console.log('recipeInfo>>>>>', recipeInfo);
  // console.log('subscribeInfo>>>>>', subscribeInfo);
  // console.log(' DATA?.subscribeDetailInfo>>>>>', DATA?.subscribeDetailInfo);
  // console.log('DATA.recipesDetailInfo>>>>>', DATA.recipesDetailInfo);
  // console.log('isOriginSubscriber>>>>>', isOriginSubscriber);
  // console.log('DATA.dogDto.subscribeId>>>>>', DATA.dogDto.subscribeId);

  const [oneMealGramsForm, setOneMealGramsForm] = useState({
    current: [],
    next: [],
  });

  const [selectedCategory, setSelectedCategory] = useState({
    plan: DATA.plan || '',
    recipeIdList: [],
    nextPaymentPrice: null,
    recipeNameList: DATA.recipes || [],
  });
  // console.log('selectedCategory>>>>>', selectedCategory);
  // console.log('DATA.recipes>>>>>', DATA);
  // console.log('recipeInfo>>>>>', recipeInfo);

  const currentOneMealGrams = useCallback(
    calcOneMealGramsWithRecipeInfo({
      selectedRecipeIds: selectedCategory.recipeIdList,
      allRecipeInfos: recipeInfo?.data || [],
      oneDayRecommendKcal: DATA.surveyInfoData.foodAnalysis.oneDayRecommendKcal,
      isOriginSubscriber,
    }).map((recipe) => recipe.oneMealGram),
    [recipeInfo.loading, subscribePlanInfo.loading, DATA],
  );

  useEffect(() => {
    if (oneMealGramsForm.current.length === 0) {
      setOneMealGramsForm((prevState) => ({
        ...prevState,
        current: currentOneMealGrams,
      }));
    }
  }, [currentOneMealGrams]);

  // * ------ [ GET ] Member, Recipes ------ *
  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));

        let initialValues = [];

        const getMemberInfoApiUrl = `/api/admin/members/${DATA.dogDto.memberId}`;
        const memberResponse = await getData(getMemberInfoApiUrl);
        const MEMBER_DATA = memberResponse.data.memberDto;
        // console.log('MEMBER_DATA', MEMBER_DATA);

        const matchedRecipeIds = DATA.recipes.map(
          (recipeName) =>
            DATA.recipesDetailInfo.find((recipe) => recipe.name === recipeName)
              ?.id,
        );

        // 초기값 설정
        setSelectedCategory((prevState) => ({
          ...prevState,
          recipeIdList: matchedRecipeIds,
          nextPaymentPrice:
            DATA.subscribeDetailInfo.subscribeDto.nextPaymentDate,
        }));

        initialValues = {
          id: DATA.dogDto.id,
          address: {
            zipcode: MEMBER_DATA.address?.zipcode,
            city: MEMBER_DATA.address?.city,
            street: MEMBER_DATA.address?.street,
            detailAddress: MEMBER_DATA.address?.detailAddress,
          },
          phoneNumber: transformPhoneNumber(MEMBER_DATA.phoneNumber),
          birthday: transformBirthDay(MEMBER_DATA.birthday),
          memberName: MEMBER_DATA.name,
          email: MEMBER_DATA.email,
          subscribeId: DATA.dogDto.subscribeId,
          subscribeCount: DATA.subscribeDetailInfo.subscribeDto.subscribeCount,
          subscribeStatus:
            DATA.subscribeDetailInfo.subscribeDto.subscribeStatus,
          subscribeCount: DATA.subscribeDetailInfo.subscribeDto.subscribeCount,
          discountGrade: DATA.subscribeDetailInfo.subscribeDto.discountGrade,
          discountCoupon: DATA.subscribeDetailInfo.subscribeDto.discountCoupon,
          overDiscount: DATA.subscribeDetailInfo.subscribeDto.overDiscount,
          nextPaymentDate:
            DATA.subscribeDetailInfo.subscribeDto.nextPaymentDate,
          nextPaymentPrice:
            DATA.subscribeDetailInfo.subscribeDto.nextPaymentPrice,
          name: DATA.dogDto.name,
          gender: DATA.dogDto.gender,
          birth: DATA.dogDto.birth,
          oldDog: DATA.dogDto.oldDog,
          dogType: DATA.dogDto.dogType,
          dogSize: DATA.dogDto.dogSize,
          weight: DATA.dogDto.weight,
          neutralization: true,
          activityLevel: DATA.dogDto.activityLevel,
          walkingCountPerWeek: DATA.dogDto.walkingCountPerWeek,
          walkingTimePerOneTime: DATA.dogDto.walkingTimePerOneTime,
          dogStatus: DATA.dogDto.dogStatus,
          snackCountLevel: DATA.dogDto.snackCountLevel,
          inedibleFood: DATA.dogDto.inedibleFood,
          inedibleFoodEtc: DATA.dogDto.inedibleFoodEtc,
          recommendRecipeId: DATA.dogDto.recommendRecipeId,
          oneMealRecommendGram: DATA.dogDto.oneMealRecommendGram,
          caution: DATA.dogDto.caution,
        };
        setFormValues(initialValues);
        //! [추가] 기존 구독자인지 확인
        originSubscribeIdList.includes(DATA.dogDto.subscribeId) &&
          setIsOriginSubscriber(true);
      } catch (err) {
        console.error(err);
        console.error(err.response);
        alert('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [dogIdx, DATA]);

  //*** 구독플랜 금액 계산
  const calcSubscribePlanPaymentPrice = useCallback(
    (planName) => {
      if (!selectedCategory.recipeIdList[0] || !planName || !recipeInfo.data) {
        return {
          perPack: 0,
          originPrice: 0,
          salePrice: 0,
        };
      }
      const discountPercent = subscribePlanInfo.planDiscountPercent[planName];
      const oneDayRecommendKcal =
        DATA.surveyInfoData.foodAnalysis.oneDayRecommendKcal;
      // console.log('oneDayRecommendKcal>>>', oneDayRecommendKcal);

      const pricePerGrams = DATA.recipesDetailInfo
        ?.filter(
          (recipe) => selectedCategory.recipeIdList.indexOf(recipe.id) >= 0,
        )
        .map((recipe) => recipe.pricePerGram);

      const currentRecipeInfos = DATA.recipesDetailInfo
        ?.filter(
          (recipe) => selectedCategory.recipeIdList.indexOf(recipe.id) >= 0,
        )
        .map((recipe) => recipe.name);

      // console.log('currentRecipeInfos>>>', currentRecipeInfos);

      const nextOneMealGrams = calcOneMealGramsWithRecipeInfo({
        selectedRecipeIds: selectedCategory.recipeIdList,
        allRecipeInfos: recipeInfo.data,
        oneDayRecommendKcal: oneDayRecommendKcal,
        isOriginSubscriber,
      }).map((recipe) => recipe.oneMealGram);

      const isSameArray = valid_isTheSameArray(
        oneMealGramsForm.next,
        nextOneMealGrams,
      );

      // // console.log(oneMealGramsForm.next, nextOneMealGrams, "\n", isSameArray);
      if (!isSameArray) {
        setOneMealGramsForm((prevState) => ({
          ...prevState,
          next: nextOneMealGrams,
        }));
      }

      return calcSubscribePrice({
        discountPercent,
        oneMealGrams: nextOneMealGrams,
        planName,
        pricePerGrams,
        isOriginSubscriber,
        recipeNameList: currentRecipeInfos,
      });
    },
    [
      selectedCategory.plan,
      selectedCategory.recipeIdList,
      selectedCategory.recipeNameList,
      recipeInfo,
      subscribePlanInfo,
      DATA,
    ],
  );

  const onInputChange = (value) => {
    setTempValues((prevState) => {
      return {
        ...prevState,
        nextPaymentDate: value ? dayjs(value) : null,
      };
    });
  };

  if (isLoading.fetching) {
    return <FullScreenLoading />;
  }

  // * ------ SURVEY ------ *

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    // console.log('value', value);
    // console.log('filteredType', filteredType);

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        filteredValue = filter_onlyNumber(filteredValue);
      }
      if (filteredType.indexOf('ints') >= 0) {
        filteredValue = filter_extraIntegerNumberZero(filteredValue);
        const thisFilteredType = filteredType
          .split(',')
          .filter((type) => type.indexOf('ints') >= 0)[0];
        const intNum = Number(thisFilteredType.split('-')[1]);
        filteredValue = intNum
          ? filter_ints(filteredValue, intNum)
          : filteredValue;
      }
      if (filteredType.indexOf('demicals') >= 0) {
        filteredValue = filter_extraIntegerNumberZero(filteredValue);
        const thisFilteredType = filteredType
          .split(',')
          .filter((type) => type.indexOf('demicals') >= 0)[0];
        const demicalNum = Number(thisFilteredType.split('-')[1]);
        filteredValue = demicalNum
          ? filter_demicals(filteredValue, demicalNum)
          : filteredValue;
      }
      if (filteredType.indexOf('currency') >= 0) {
        filteredValue = Number(filteredValue);
        setOriginalPrice(Number(filteredValue).toLocaleString());
      }
      if (filteredType.indexOf('gramsPerRecipe') >= 0) {
        return setOriginalGramPerRecipe((prevState) => ({
          ...prevState,
          [id]: filteredValue,
        }));
      }
    }

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onStartValidate = () => {
    if (submitState === true) return;
    const errObj = validate(formValues, 'ALL');
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) {
      let errorMessages = ['- 오류 안내 -\n'];
      let count = 0;
      for (const key in errObj) {
        const errorMessage = errObj[key];
        errorMessage && errorMessages.push(`${++count}. ${errorMessage}\n`);
      }
      onShowModal(errorMessages);
      setSubmitState(null);
      // - prevent to the Next step when validation failed
    } else {
      setActiveConfirmModal(true);
      setSubmitState('READY');
    }
  };

  //*** 다음 결제일 변경 버튼
  const onChangeNextPaymentDate = () => {
    if (
      !tempValues.nextPaymentDate ||
      formValues.nextPaymentDate.substring(0, 16) ===
        dayjs(tempValues.nextPaymentDate).format('YYYY-MM-DDTHH:mm')
    ) {
      alert('다음 결제일이 기존과 동일합니다.');
    } else if (confirm('구독 결제일을 정말 변경하시겠습니까?')) {
      (async () => {
        try {
          const apiUrl = `/api/admin/nextPaymentDate/${formValues.subscribeId}`;
          let newNextPaymentDate = dayjs(tempValues.nextPaymentDate).format(
            'YYYY-MM-DD-HH-mm',
          );
          // 다음 결제일 포맷변환 (0000-00-00-00-00)
          const match = newNextPaymentDate.match(
            /(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})/,
          );
          let yyyymmddhhmm = '';
          if (match) {
            const year = match[1];
            const month = match[2];
            const day = match[3];
            const hour = match[4];
            const minute = match[5];
            yyyymmddhhmm = `${year}-${month}-${day}-${hour}-${minute}`;
          } else {
            console.log('날짜 형식이 올바르지 않습니다.');
          }
          const data = {
            nextPaymentDate: yyyymmddhhmm,
          };
          // console.log('PUT 요청 !', data);
          const res = await putObjData(apiUrl, data);
          // console.log(res);
          // const resData = res.data.data;
          if (res.isDone) {
            alert('구독 결제일 변경이 완료되었습니다.');
            setFormValues((prevState) => ({
              ...prevState,
              nextPaymentDate: newNextPaymentDate,
            }));
            setTempValues((prevState) => ({
              ...prevState,
              nextPaymentDate: null,
            }));
            window.location.reload();
          }
        } catch (err) {
          console.error('API통신 오류 : ', err);
          onShowModal(
            'API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.',
          );
        }
      })();
    }
  };

  //*** 다음 결제 원금 변경
  const onSubmitNextPaymentPriceChange = async (confirm) => {
    if (!confirm) {
      return setActiveConfirmNextPaymentPriceChangeModal(false);
    }

    const body = {
      newPaymentPrice: Number(formValues.nextPaymentPrice),
    };

    try {
      setSubmitted(true);

      const url = `/api/admin/${formValues.subscribeId}/nextPaymentPrice`;
      const res = await patchObjData(url, body);

      if (res.isDone) {
        // mct.alertShow(
        //   '변경이 완료되었습니다.',
        onSuccessChangeSubscribeOrder();
        // );
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
        setSubmitted(false);
      }
      setActiveConfirmModal(false);
    } catch (err) {
      console.error('err: ', err);
    }
  };

  const onChangeNextPaymentPriceHandler = async () => {
    if (submitted) return;

    // validation
    if (formValues.nextPaymentPrice === '') {
      mct.alertShow('다음 결제 원금을 입력해주세요.');
      return;
    } else if (Number(formValues.nextPaymentPrice) < 100) {
      mct.alertShow('다음 결제 원금은 100원 이상이어야 합니다.');
      return;
    } else {
      setActiveConfirmNextPaymentPriceChangeModal(true);
    }
  };

  //** 구독 그램수 변경 (모달창 '확인'버튼 누른 후) */
  const onSubmitGramPerRecipeChange = async (confirm) => {
    if (!confirm) {
      return setActiveConfirmGramPerRecipeChangeModal(false);
    }
    const body = {
      grams: originalGramPerRecipe['gram2']
        ? `${originalGramPerRecipe['gram1']}, ${originalGramPerRecipe['gram2']}`
        : originalGramPerRecipe['gram1'],
    };
    try {
      setSubmitted(true);
      const url = `/api/admin/subscribes/${formValues.subscribeId}/oneMealGramsPerRecipe`;
      const res = await patchObjData(url, body);
      if (res.isDone) {
        onSuccessChangeSubscribeOrder();
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
        setSubmitted(false);
      }
      setActiveConfirmModal(false);
    } catch (err) {
      console.error('err: ', err);
    }
  };

  const onChangeGramsPerRecipeHandler = async () => {
    if (submitted) return;
    // 시작은 숫자여야 하고, 소수점은 하나만 포함될 수 있으며, 연속된 소수점이 올 수 없음
    const gramRegex = /^(\d+(\.\d+)?)$/;
    // validation
    if (
      originalGramPerRecipe['gram1'] === '' ||
      originalGramPerRecipe['gram2'] === ''
    ) {
      mct.alertShow('구독 그램수를 입력해주세요.');
      return;
    } else if (
      originalGramPerRecipe['gram1'] === '0' ||
      originalGramPerRecipe['gram2'] === '0'
    ) {
      mct.alertShow('구독 그램수는 0g 이상이어야 합니다.');
      return;
    } else if (
      !gramRegex.test(originalGramPerRecipe['gram1']) ||
      (originalGramPerRecipe['gram2'] &&
        !gramRegex.test(originalGramPerRecipe['gram2']))
    ) {
      mct.alertShow('구독 그램수를 다시 확인해주세요.');
      return;
    } else {
      setActiveConfirmGramPerRecipeChangeModal(true);
    }
  };

  //*** 반려견 정보 수정하기 버튼
  const onSubmit = async (confirm) => {
    if (!confirm || submitState === true) {
      return setActiveConfirmModal(false);
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      let modalMessage;
      const apiUrl = `/api/admin/dogs/${dogIdx}`;
      const {
        phoneNumber,
        email,
        address,
        birthday,
        id,
        memberName,
        oneMealRecommendGram,
        nextPaymentDate,
        nextPaymentPrice,
        subscribeCount,
        subscribeId,
        subscribeStatus,
        discountGrade,
        discountCoupon,
        overDiscount,
        ...dataToSend
      } = formValues;

      // console.log('dataToSend>>>>', dataToSend);
      const res = await putObjData(apiUrl, dataToSend);

      console.log(res);
      const resData = res.data.data;

      if (res.isDone) {
        modalMessage = '설문조사가 성공적으로 수정되었습니다.';
        setSubmitState('UPDATED');
      } else if (resData?.errors?.length > 0) {
        const errorArr = resData?.errors || [];
        modalMessage = errorArr.map((err) => err.defaultMessage).join(', ');
        setSubmitState(false);
      } else {
        modalMessage = '내부 통신장애입니다. 잠시 후 다시 시도해주세요.';
        setSubmitState(false);
      }
      onShowModal(modalMessage);
      setActiveConfirmModal(false);
    } catch (err) {
      console.error('API통신 오류 : ', err);
      onShowModal('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }

    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onFinishUpdateSurvey = () => {
    router.push('/bf-admin/dog');
    window.location.reload();
  };

  const onShowModal = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onHideModal = () => {
    mct.alertHide();
    setModalMessage('');
  };

  /////////////////////////////

  const onClickHandler = (e, planName) => {
    setSelectedCategory((prevState) => ({
      ...prevState,
      plan: planName,
    }));
  };

  const onChangeHandler = (e, label) => {
    let updatedRecipeNameList = [...selectedCategory.recipeNameList];
    let updatedRecipeIdList = [...selectedCategory.recipeIdList];
    const labelIndex = updatedRecipeNameList.indexOf(label);
    const matchedRecipeId = DATA.recipesDetailInfo.find(
      (recipe) => recipe.name === label,
    )?.id;

    if (labelIndex === -1) {
      updatedRecipeNameList.push(label);
      updatedRecipeIdList.push(matchedRecipeId);
    } else {
      updatedRecipeNameList.splice(labelIndex, 1);
      updatedRecipeIdList = updatedRecipeIdList.filter(
        (recipeId) => recipeId !== matchedRecipeId,
      );
    }

    setSelectedCategory((prevState) => ({
      ...prevState,
      recipeNameList: updatedRecipeNameList,
      recipeIdList: updatedRecipeIdList,
    }));
  };
  const onSuccessChangeSubscribeOrder = () => {
    setIsLoading({ reload: true });
    window.location.reload();
  };
  if (isLoading.reload || subscribePlanInfo.isLoading) {
    return <FullScreenLoading opacity={1} />;
  }

  //*** 레시피 / 플랜 변경하기
  const onSubmitPlanChange = async (confirm) => {
    if (!confirm) {
      return setActiveConfirmPlanChangeModal(false);
    }

    const body = {
      plan: selectedCategory.plan,
      nextPaymentPrice: nextPriceText,
      // nextPaymentPrice: subscribeInfo.price[selectedCategory.plan].salePrice, // 선택된 플랜의 판매가격
      recipeIdList: selectedCategory.recipeIdList,
    };

    if (!body.nextPaymentPrice)
      return mct.alertShow('결제금액 계산오류가 발생하였습니다.');

    try {
      setSubmitted(true);

      const url = `/api/subscribes/${DATA?.dogDto.subscribeId}/planRecipes`;
      const res = await postObjData(url, body);

      if (res.isDone) {
        // mct.alertShow(
        //   '플랜 변경이 완료되었습니다.',
        onSuccessChangeSubscribeOrder();
        // );
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
        setSubmitted(false);
      }
      setActiveConfirmModal(false);
    } catch (err) {
      console.error('err: ', err);
    }
  };

  const onChangePlanRecipeHandler = async () => {
    if (submitted) return;

    // validation
    const currentRecipeCount = selectedCategory.recipeIdList.length;
    if (
      subscribePlanType[selectedCategory.plan].maxRecipeCount <
      currentRecipeCount
    ) {
      mct.alertShow(
        '구독 중인 레시피 개수가 변경될 플랜의 최대 선택 가능한 레시피 개수보다 많습니다.',
      );
      return;
    } else if (currentRecipeCount === 0) {
      mct.alertShow('레시피를 선택해주세요.');
      return;
    } else {
      // 최종계산된가격
      const nextPaymentPrice = calcSubscribePlanPaymentPrice(
        selectedCategory.plan,
      ).salePrice;
      setNextPriceText(nextPaymentPrice);
      setActiveConfirmPlanChangeModal(true);
    }
  };

  // 오늘 이전의 날짜 비활성화
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  // 현재 시간으로부터 5분 뒤까지의 시간 비활성화
  const disabledDateTime = () => {
    const now = dayjs();
    const fiveMinutesLater = now.add(5, 'minute');
    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          if (i < fiveMinutesLater.hour()) {
            hours.push(i);
          }
        }
        return hours;
      },
      disabledMinutes: (selectedHour) => {
        const minutes = [];
        if (selectedHour === fiveMinutesLater.hour()) {
          for (let i = 0; i <= fiveMinutesLater.minute(); i++) {
            minutes.push(i);
          }
        }
        return minutes;
      },
    };
  };

  // console.log('formValues', formValues);
  // console.log('tempValues', tempValues);
  // console.log('setSelectedCategory', selectedCategory);
  // console.log('formValues.subscribeStatus', formValues.subscribeStatus);
  // console.log('NextPriceText', nextPriceText);
  // console.log('original', originalGramPerRecipe);

  return (
    <>
      <div id={s.popup}>
        <PopupWrapper style={{ width: 1000 }}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s['popup-title']}>반려견정보 조회</h1>
                <PopupCloseButton_typeX />
              </div>
            </div>
          </header>
          <main className={s.body}>
            <div className={s.row}>
              <section className={s.table}>
                <ul>
                  <li className={s['table-list']}>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>회원 정보</h4>
                    </div>
                    <ul className={s['t-body']}>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>이름</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.memberName}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>생일</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>
                              {tempValues.birthday || formValues.birthday}
                            </span>
                            <span></span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>아이디</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.email}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>연락처</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.phoneNumber}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']} ${s['fullWidth']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>주소</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.address?.street}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <br />

                  {/* ------ SUBSCRIBE------ */}
                  <li className={s['table-list']}>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>구독 정보</h4>
                    </div>
                    <ul className={s['t-body']}>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>구독 상태</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>
                              {formValues.subscribeStatus === 'BEFORE_PAYMENT'
                                ? '구독 전'
                                : formValues.subscribeStatus ===
                                  'SURVEY_COMPLETED'
                                ? '설문 완료'
                                : formValues.subscribeStatus ===
                                  'SUBSCRIBE_WILL_CANCEL'
                                ? '구독 취소 예정'
                                : formValues.subscribeStatus ===
                                  'SUBSCRIBE_CANCEL'
                                ? '구독 취소'
                                : formValues.subscribeStatus === 'SUBSCRIBING'
                                ? '구독 중'
                                : formValues.subscribeStatus ===
                                  'SUBSCRIBE_PENDING'
                                ? '구독 보류'
                                : '관리자 구독'}
                            </span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>구독 회차</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.subscribeCount} 회</span>
                          </div>
                        </div>
                      </li>

                      {(formValues.subscribeStatus ===
                        'SUBSCRIBE_WILL_CANCEL' ||
                        formValues.subscribeStatus === 'SUBSCRIBE_CANCEL') && (
                        <li className={`${s['t-row']} ${s['fullWidth']}`}>
                          <div className={s['t-box']}>
                            <div className={`${s.innerBox} ${s.label}`}>
                              <span>구독 취소 이유</span>
                            </div>
                            <div className={`${s.innerBox} ${s.cont}`}>
                              <span>
                                {DATA.subscribeDetailInfo.subscribeDto
                                  .cancelReason
                                  ? DATA.subscribeDetailInfo.subscribeDto
                                      .cancelReason
                                  : '없음'}
                              </span>
                            </div>
                          </div>
                        </li>
                      )}
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>다음 결제일</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            {formValues.nextPaymentDate ? (
                              <>
                                {/* <span>
                                  <input
                                    type="date"
                                    value={
                                      tempValues.nextPaymentDate ||
                                      formValues.nextPaymentDate
                                    }
                                    onChange={onInputChange}
                                  />
                                </span> */}

                                <span>
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: '#ca1011',
                                      },
                                    }}
                                  >
                                    <DatePicker
                                      showTime={{
                                        format: 'HH:mm',
                                      }}
                                      format="YYYY-MM-DD HH:mm"
                                      onChange={onInputChange}
                                      value={
                                        tempValues.nextPaymentDate === null ||
                                        tempValues.nextPaymentDate
                                          ? tempValues.nextPaymentDate
                                          : dayjs(formValues.nextPaymentDate)
                                      }
                                      disabledDate={disabledDate}
                                      disabledTime={disabledDateTime}
                                    />
                                  </ConfigProvider>
                                </span>

                                <button
                                  className="admin_btn line point basic_s"
                                  onClick={() => {
                                    onChangeNextPaymentDate(
                                      formValues.nextPaymentDate,
                                    );
                                  }}
                                >
                                  변경
                                </button>
                              </>
                            ) : (
                              '-'
                            )}
                          </div>
                        </div>
                        <div
                          className={s['t-box']}
                          style={{ overflow: 'unset' }}
                        >
                          <div
                            className={`${s.innerBox} ${s.label} ${s.tooltip}`}
                          >
                            <span>다음 결제 원금 </span>
                            {/* tooltip */}
                            <em>
                              <i
                                onMouseEnter={(e) =>
                                  onMouseEnterHandler(e, 'nextPaymentPrice')
                                }
                                onMouseLeave={(e) =>
                                  onMouseLeaveHandler(e, 'nextPaymentPrice')
                                }
                                style={{
                                  cursor: isActive.nextPaymentPrice
                                    ? 'pointer'
                                    : 'default',
                                }}
                              >
                                i
                              </i>
                              {isActive.nextPaymentPrice && (
                                <pre>
                                  * 이 값은 플랜할인이 적용된 원금이며,<br />
                                  등급할인과 쿠폰할인이 포함되어있지 않습니다.<br />
                                  다음결제원금 변경 시 <b>플랜할인을 적용하여 변경</b>해주세요.<br />
                                  (실제 결제금액 계: 원금 - 쿠폰할인 - 등급할인)
                                </pre>
                              )}
                            </em>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <input
                              type="text"
                              id="nextPaymentPrice"
                              value={
                                originalPrice || formValues.nextPaymentPrice
                              }
                              onChange={onInputChangeHandler}
                              data-input-type={'number, demicals, currency'}
                              className={`${s.nextPaymentPriceInput}`}
                            ></input>
                            <span>원</span>
                            <button
                              className={`admin_btn line point basic_s ${s.recipe_change_btn}`}
                              onClick={() => {
                                onChangeNextPaymentPriceHandler();
                              }}
                            >
                              변경
                            </button>
                          </div>
                        </div>
                      </li>

                      <li className={`${s['t-row']} ${s['threeCells']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>등급 할인량</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.discountGrade} 원</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>쿠폰 할인량</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.discountCoupon} 원</span>
                          </div>
                        </div>
                        <div
                          className={s['t-box']}
                          style={{ overflow: 'unset' }}
                        >
                          <div
                            className={`${s.innerBox} ${s.label}  ${s.tooltip}`}
                          >
                            <span>초과 할인금</span>
                            {/* tooltip */}
                            <em>
                              <i
                                onMouseEnter={(e) =>
                                  onMouseEnterHandler(e, 'overDiscount')
                                }
                                onMouseLeave={(e) =>
                                  onMouseLeaveHandler(e, 'overDiscount')
                                }
                                style={{
                                  cursor: isActive.overDiscount
                                    ? 'pointer'
                                    : 'default',
                                }}
                              >
                                i
                              </i>
                              {isActive.overDiscount && (
                                <pre className={s.tooltip_text}>
                                  * 다음 결제원금 보다 큰 할인이 적용되어 <br />
                                  초과된 할인금 (최소결제금액 : 100원)
                                </pre>
                              )}
                            </em>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.overDiscount} 원</span>
                          </div>
                        </div>
                      </li>

                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>추천 그램수</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.oneMealRecommendGram} g</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>구독 그램수</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            {/* <span>
                              {DATA?.subscribeDetailInfo.subscribeDto.oneMealGramsPerRecipe
                                ?.split(', ')
                                .map((value) => `${value} g`)
                                .join(' , ')}
                            </span> */}

                            {DATA?.subscribeDetailInfo.subscribeDto
                              .oneMealGramsPerRecipe ? (
                              <>
                                <input
                                  type="text"
                                  id="gram1"
                                  value={originalGramPerRecipe['gram1'] || ''}
                                  onChange={onInputChangeHandler}
                                  data-input-type={'number, gramsPerRecipe'}
                                  className={`${s.GramsPerRecipeInput}`}
                                ></input>
                                <span>g</span>

                                {DATA?.subscribeDetailInfo.subscribeDto.oneMealGramsPerRecipe?.split(
                                  ', ',
                                )[1] && (
                                  <>
                                    <input
                                      type="text"
                                      id="gram2"
                                      value={
                                        originalGramPerRecipe['gram2'] || ''
                                      }
                                      onChange={onInputChangeHandler}
                                      data-input-type={'number, gramsPerRecipe'}
                                      className={`${s.GramsPerRecipeInput}`}
                                    ></input>
                                    <span>g</span>
                                  </>
                                )}

                                <button
                                  className={`admin_btn line point basic_s ${s.recipe_change_btn}`}
                                  onClick={() => {
                                    onChangeGramsPerRecipeHandler();
                                  }}
                                >
                                  변경
                                </button>
                              </>
                            ) : (
                              '-'
                            )}
                          </div>
                        </div>
                      </li>

                      <li className={`${s['t-row']} ${s['fullWidth']}`}>
                        <div className={`${s['t-box']}`}>
                          <div
                            className={`${s.innerBox} ${s.label} ${s.plan_table}`}
                          >
                            <span>플랜 / 레시피</span>
                          </div>

                          <div
                            className={`${s.innerBox} ${s.cont} ${s.plan_table} ${s.plan_content}`}
                          >
                            <div className={`${s.plan_checkbox}`}>
                              <p>플랜</p>
                              {DATA.recipesDetailInfo.length > 0 && (
                                <ul
                                  className={'grid-checkbox-wrap'}
                                  style={{ maxWidth: '400px' }}
                                >
                                  {Object.keys(
                                    subscribePlanInfo.planDiscountPercent,
                                  ).map((plan, index) => {
                                    return (
                                      <div
                                        className={`${s['checkbox-wrap']}`}
                                        key={index}
                                      >
                                        <label
                                          htmlFor={plan}
                                          className={`${s.checkbox}`}
                                          onClick={(e) =>
                                            onClickHandler(e, plan)
                                          }
                                        >
                                          <input
                                            type="radio"
                                            id={plan}
                                            value={
                                              selectedCategory.plan === plan
                                            }
                                            style={{ display: 'none' }}
                                            checked={
                                              selectedCategory.plan === plan
                                            }
                                            onChange={(e) =>
                                              onClickHandler(e, plan)
                                            }
                                          />
                                          <span className={s.fakeCheckBox} />
                                          <span>{plan}</span>
                                        </label>
                                      </div>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>

                            <div className={`${s.plan_checkbox}`}>
                              <p>레시피</p>
                              {DATA.recipesDetailInfo.length > 0 && (
                                <ul
                                  className={'grid-checkbox-wrap'}
                                  style={{ maxWidth: '400px' }}
                                >
                                  {DATA.recipesDetailInfo.map(
                                    (recipe, index) => {
                                      const isChecked =
                                        selectedCategory.recipeNameList.includes(
                                          recipe.name,
                                        );
                                      return (
                                        <div
                                          className={`${pc['checkbox-wrap']}`}
                                          key={index}
                                        >
                                          <label
                                            htmlFor={recipe.name}
                                            className={`${pc.checkbox}`}
                                          >
                                            <input
                                              onChange={(e) =>
                                                onChangeHandler(e, recipe.name)
                                              }
                                              type="checkbox"
                                              id={recipe.name}
                                              checked={isChecked}
                                            />
                                            <span className={pc.fakeCheckBox} />
                                            <span>{recipe.name}</span>
                                          </label>
                                        </div>
                                      );
                                    },
                                  )}
                                </ul>
                              )}
                            </div>

                            <button
                              className={`admin_btn line point basic_s ${s.recipe_change_btn}`}
                              onClick={() => {
                                onChangePlanRecipeHandler();
                              }}
                            >
                              변경
                            </button>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>

                  <br />
                  <li>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>반려견 정보</h4>
                    </div>
                    <div className={s['survey-page']}>
                      <SurveyStep1
                        formValues={formValues}
                        setFormValues={setFormValues}
                        onInputChangeHandler={onInputChangeHandler}
                      />
                      <SurveyStep2
                        formValues={formValues}
                        setFormValues={setFormValues}
                        onInputChangeHandler={onInputChangeHandler}
                      />
                      <SurveyStep3
                        formValues={formValues}
                        setFormValues={setFormValues}
                        onInputChangeHandler={onInputChangeHandler}
                      />
                      <div className={`${s['btn-section']} ${s['in-mypage']}`}>
                        <button
                          className={s.submit}
                          type={'button'}
                          onClick={onStartValidate}
                        >
                          {isLoading.submit ? (
                            <Spinner style={{ color: '#fff' }} />
                          ) : (
                            '수정하기'
                          )}
                        </button>
                      </div>
                      <section className={s['btn-section']}>
                        <PopupCloseButton />
                      </section>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
          </main>
          {activeConfirmModal && (
            <Modal_confirm
              theme={'userPage'}
              isConfirm={onSubmit}
              positionCenter
              text={'반려견 정보를 수정하시겠습니까?'}
              caution={
                <>
                  구독 중인 반려견의 한 끼당 g수가 변경되면,
                  <br />
                  다음 예약 결제금액이 자동으로 변경됩니다
                </>
              }
            />
          )}
          {activeConfirmPlanChangeModal && (
            <Modal_confirm
              theme={'userPage'}
              isConfirm={onSubmitPlanChange}
              positionCenter
              text={'플랜 및 레시피를 변경하시겠습니까?'}
              caution={
                <>
                  다음 구독 주문부터 변경사항이 적용됩니다.
                  <br />
                  <br />
                  1. 플랜 및 레시피 <br />
                  2. 구독 그램수 : 변경된 레시피에 맞게 새로 계산
                  <br />
                  3. 다음 결제 원금 :{' '}
                  <strong>{formValues.nextPaymentPrice}원</strong> --&gt;&nbsp;
                  <strong>{nextPriceText}원</strong> <br />
                  <br />
                </>
              }
            />
          )}
          {activeConfirmNextPaymentPriceChangeModal && (
            <Modal_confirm
              theme={'userPage'}
              isConfirm={onSubmitNextPaymentPriceChange}
              positionCenter
              text={'다음 결제 원금을 변경하시겠습니까?'}
              caution={
                <>
                  <strong>
                    {DATA?.subscribeDetailInfo.subscribeDto.nextPaymentPrice.toLocaleString()}
                    원
                  </strong>
                  --&gt;&nbsp;
                  <strong>
                    {formValues.nextPaymentPrice.toLocaleString()}원
                  </strong>
                  <br />
                  다음 결제 원금이 변경됩니다.
                </>
              }
            />
          )}
          {activeConfirmmGramPerRecipeChangeModal && (
            <Modal_confirm
              theme={'userPage'}
              isConfirm={onSubmitGramPerRecipeChange}
              positionCenter
              text={'구독 그램수를 변경하시겠습니까?'}
              caution={
                <>
                  <strong>
                    {
                      DATA?.subscribeDetailInfo.subscribeDto.oneMealGramsPerRecipe.split(
                        ', ',
                      )[0]
                    }
                    g
                  </strong>
                  --&gt;&nbsp;
                  <strong>{originalGramPerRecipe['gram1']}g</strong>
                  <br />
                  {originalGramPerRecipe['gram2'] && (
                    <>
                      <strong>
                        {' '}
                        {
                          DATA?.subscribeDetailInfo.subscribeDto.oneMealGramsPerRecipe.split(
                            ', ',
                          )[1]
                        }
                        g
                      </strong>
                      --&gt;&nbsp;
                      <strong>{originalGramPerRecipe['gram2']}g</strong>
                    </>
                  )}
                  <br />
                  <br />
                  결제완료, 생산중, 예약결제 상태인 항목에 대해서만 <br />
                  변경된 값이 적용됩니다.
                </>
              }
            />
          )}

          {hasAlert && (
            <Modal_global_alert
              message={modalMessage}
              onClick={
                submitState === 'UPDATED' ? onFinishUpdateSurvey : onHideModal
              }
              background
            />
          )}
        </PopupWrapper>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { id: dogIdx } = query;
  let DATA = null;
  let isMyDog = true;

  // DATA: this Dog
  const getOneDogInfoApiUrl = `/api/dogs/${dogIdx}`;
  const dogInfoRes = await getDataSSR(req, getOneDogInfoApiUrl);
  const dogData = dogInfoRes?.data || null;
  const dogDto = dogData?.dogDto || null;
  const plan = dogData?.plan || null;
  const recipes = dogData?.recipes || null;
  // console.log('dogInfoRes', dogInfoRes);

  // DATA: Recipes
  const getRecipeInfoApiUrl = `/api/recipes`;
  const recipeInfoRes = await getDataSSR(req, getRecipeInfoApiUrl);
  const recipeInfoData = recipeInfoRes?.data;

  // DATA: Survey Report
  const getSurveyInfoApiUrl = `/api/dogs/${dogIdx}/surveyReportResult`;
  const surveyInfoRes = await getDataSSR(req, getSurveyInfoApiUrl);
  const surveyInfoData = surveyInfoRes?.data;

  // DATA: Subscribe
  const subscribeApiurl = `/api/subscribes/${dogData?.dogDto.subscribeId}`;
  const subscribeInfoRes = await getDataSSR(req, subscribeApiurl);
  const subscribeDetailInfo = subscribeInfoRes?.data;

  if (dogData && recipeInfoData) {
    const recipeIdList =
      recipeInfoData._embedded?.recipeListResponseDtoList?.map((l) => l.id) ||
      [];
    const recipesDetailInfo = [];
    for (const recipeId of recipeIdList) {
      const apiUrl = `/api/recipes/${recipeId}`;
      const res = await getDataSSR(req, apiUrl);
      const data = res.data;
      // console.log('recipeDatas>>>> ', data);
      if (data) {
        recipesDetailInfo.push({
          ...data,
          kcalPerGram: data.gramPerKcal, // gramPerKcal(X) -> KcalPerGram(O) : 고객사에서 전달받은 무게상수의 단위를 그대로 사용하였으나, 오류가 있어서 수정함.
        });
      }
    }

    DATA = {
      dogDto,
      plan,
      recipes,
      recipesDetailInfo,
      surveyInfoData,
      subscribeDetailInfo,
    };
  } else if (!dogData || !isMyDog) {
    return {
      props: { DATA: null },
    };
  } else {
    dogData.dogIdx = Number(dogIdx); // form submit 에 사용
  }

  return { props: { DATA, dogIdx } };
}
