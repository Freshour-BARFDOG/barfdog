import { useEffect, useState } from "react";
import { format } from "date-fns";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import Spinner from "/src/components/atoms/Spinner";
import CreateCouponForm from "/src/components/admin/alliance/coupon/create/CreateCouponForm";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import { valid_currency, valid_hasFormErrors, valid_isEmpty, valid_isNumberEmpty } from "/util/func/validation/validationPackage";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import transformClearLocalCurrency from "/util/func/transformClearLocalCurrency";
import filter_onlyNumber from "/util/func/filter_onlyNumber";
import { filterDateTimeSeperator } from "/util/func/filter_dateAndTime";
import { downloadBlobFile } from "/util/func/downloadBlobFile";
import { discountUnitType } from "/store/TYPE/discountUnitType";
import { useModalContext } from "/store/modal-context";
import { createAllianceCoupon, downloadExcelAllianceCoupon, getAllianceEventList } from "/service/admin";

// 쿠폰 발급 form validation
const validate = (obj) => {
  let errors = {};
  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'allianceId':
        errors[key] = valid_isNumberEmpty(val);
        break;
      case 'eventName':
        errors[key] = valid_isEmpty(val);
        break;
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'description':
        errors[key] = valid_isEmpty(val);
        break;
      case 'couponTarget':
        errors[key] = valid_isEmpty(val);
        break;
      case 'discountDegree':
        const unit = obj['discountType'];
        const options = {
          unit: unit,
          mode: 'strict',
        };
        const availableMaxDiscount = obj['availableMaxDiscount']
        errors[key] = valid_currency(val, options, availableMaxDiscount);
        break;
      case 'availableMaxDiscount':
        errors[key] = valid_currency(val, { mode: 'strict' });
        break;
      case 'availableMinPrice':
        errors[key] = valid_currency(val, { mode: 'strict' });
        break;
      case 'createCouponCount':
        errors[key] = valid_isNumberEmpty(val);
        break;
      case 'codeLength':
        errors[key] = valid_isNumberEmpty(val);
        break;
      case 'useStartDate':
        errors[key] = valid_isEmpty(val);
        break;
      case 'useExpiredDate':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  return errors;
};

const transformFormValuesToRequestBody = (formValues) => ({
  ...formValues, // string
  allianceId: Number(formValues.allianceId), // number
  discountDegree: transformClearLocalCurrency(formValues.discountDegree), // currency -> number
  availableMaxDiscount: transformClearLocalCurrency(formValues.availableMaxDiscount), // currency -> number
  availableMinPrice: transformClearLocalCurrency(formValues.availableMinPrice), // currency -> number
  createCouponCount: Number(formValues.createCouponCount), // number
  codeLength: Number(formValues.codeLength), // number
  useStartDate: filterDateTimeSeperator(formValues.useStartDate, " ",  "T"), // 2025-04-17T00:00
  useExpiredDate: filterDateTimeSeperator(formValues.useExpiredDate, " ",  "T"), // 2025-04-17T00:00
});

// 쿠폰 발급 form 초기값 설정
const initialFormValues = {
  allianceId: 0, // 제휴사 id
  allianceEventId: 0, // 행사 id
  name: '', // 쿠폰 이름
  description: '', // 쿠폰 설명
  couponTarget: 'ALL', // 사용처 (전체/정기구독/일반상품)
  discountDegree: 0, // 할인율
  discountType: discountUnitType.FIXED_RATE, // 할인타입
  availableMaxDiscount: 0, // 최대 할인금액
  availableMinPrice: 0, // 최소 사용금액
  createCouponCount: 0, // 발행 쿠폰 개수
  codeLength: 8, // 발행 쿠폰 코드 자리 수
  useStartDate: '', // 사용 시작일
  useExpiredDate: '', // 사용 마지막일
};

const Index = ({ allianceList }) => {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 제휴사별 이벤트 리스트 추출
  const allianceEventList = formValues.allianceId && allianceList
    .find(alliance => Number(alliance.value) === Number(formValues.allianceId))?.eventInfos
    || [];

  // discountType unitBox 변경시 discountDegree 제어
  useEffect(() => {
    if (formValues.discountType === discountUnitType.FIXED_RATE) {
      setFormValues({
        ...formValues,
        discountDegree: applyDiscountDegree(formValues.discountDegree)
      });
    }
  }, [formValues.discountType])

  // 할인 타입 FIXED_RATE(%) 의 경우 100% 제한 및 통화 적용
  const applyDiscountDegree = (value) => {
    const numericValue = transformClearLocalCurrency(value); // 숫자 형식 포맷

    if (formValues.discountType === discountUnitType.FIXED_RATE) {
      return numericValue > 100 ? '100' : value; // 100% 제한
    }

    return transformLocalCurrency(filter_onlyNumber(value)); // FIXED_RATE 이외의 경우 통화 포맷 적용
  };

  const handleChange = (id, value) => {
    let newValue = value;

    const formattedCurrency = transformLocalCurrency(filter_onlyNumber(value));
    const currencyField = ['availableMaxDiscount', 'availableMinPrice', 'couponTotalCount'];

    // 통화 형식
    if (currencyField.includes(id)) {
      newValue = formattedCurrency;
    }
    // 100% 제한 및 통화 적용
    if (id === 'discountDegree') {
      newValue = applyDiscountDegree(value);
    }

    setFormValues({...formValues, [id]: newValue});
  }

  const handleSubmit = async () => {
    const body = transformFormValuesToRequestBody(formValues);

    const errObj = validate(body);
    setFormErrors(errObj);

    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return mct.alertShow('입력하지 않은 항목이 있습니다.\n모든 항목을 입력해 주세요');

    try {
      const response = await createAllianceCoupon(body);
      const couponBundle = response?.data?.allianceCouponBundle;

      setIsLoading(true);
      if (couponBundle) {
        // 난수 쿠폰 엑셀 다운로드
        try {
          await handleExcelDownload(couponBundle);
          alert('쿠폰 생성이 완료됐습니다.');
        } catch (downloadErr) {
          console.error('다운로드 중 에러 발생', downloadErr);
          alert('쿠폰은 생성되었지만 엑셀 다운로드에 실패했습니다.');
        }
      }
    }  catch (err) {
      alert(err.code || '쿠폰 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleExcelDownload = async (couponBundle) => {
    // 난수 쿠폰 엑셀 다운로드시 필요값 정의
    const formatDateForRequestBody = (dateStr) => format(new Date(dateStr), 'yyyy-MM-dd');
    const body = {
      bundle: couponBundle,
      useStartDate: formatDateForRequestBody(formValues.useStartDate),
      useExpiredDate: formatDateForRequestBody(formValues.useExpiredDate),
      couponPublishCount: Number(formValues.createCouponCount),
    }

    try {
      const blob = await downloadExcelAllianceCoupon(body);
      if (blob) {
        const formatDateForFilename = (dateStr) => format(new Date(dateStr), 'yyyyMMdd');
        const formatStartDate = formatDateForFilename(body.useStartDate);
        const formatEndDate = formatDateForFilename(body.useExpiredDate);

        const filename = `바프독_${formatStartDate}_${formatEndDate}_${transformLocalCurrency(body.couponPublishCount)}건.xlsx`;
        downloadBlobFile(blob, filename)
      }
    } catch (err) {
      console.error('다운로드 중 에러 발생', err);
    }
  }

  return (
    <div>
      <MetaTitle title="난수 쿠폰 발급" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">
            난수 쿠폰 발급
          </h1>
          <section className="cont">
            <CreateCouponForm
              formValues={formValues}
              formErrors={formErrors}
              setFormValues={setFormValues}
              setFormErrors={setFormErrors}
              handleChange={handleChange}
              allianceList={allianceList}
              allianceEventList={allianceEventList}
            />
          </section>
          <div className="btn_section outer">
            <button
              type="button"
              id="btn-create"
              className={`admin_btn confirm_l solid ${!formValues.allianceEventId ? 'disabled' : ''}`}
              onClick={handleSubmit}
              disabled={!formValues.allianceEventId}
            >
              {isLoading ? (
                <Spinner style={{ color: '#fff' }} />
              ) : (
                '쿠폰 생성하기'
              )}
            </button>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && (
        <Modal_global_alert onClick={() => mct.alertHide()} background />
      )}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { req } = ctx;
  const allianceList = await getAllianceEventList(req);

  return {
    props: {
      allianceList,
    }
  };
}

export default Index;