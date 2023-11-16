import React from 'react';
import s from '/src/pages/account/signup/signup.module.scss';
import SignupInput from './SignupInput';
import Tooltip from '/src/components/atoms/Tooltip';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import dynamic from 'next/dynamic';
import filter_specialCharacter from "/util/func/filter_specialCharacter";
const WindowOpener = dynamic(() => import('/util/func/window-opener'), { ssr: false });

function SignInput_address(props) {
  
  const { formValues, setFormValues, formErrors, setFormErrors } = props;
  // // console.log(formValues)

  const onReceivePopupData = (err, data) => {
    // MEMO DATA from POSTCODE API
    // MEMO ERROR CASE- 'data type string': popup window close event & popup window open event
    if (typeof data === 'string' || !Object.keys(data).length) return;
    const { address, zonecode, sido } = data;
    if (err) {
      return setFormErrors((prevState) => ({
        ...prevState,
        address: err
      }));
    }
    setFormValues((prevState) => ({
      ...prevState,
      address: { street:address, zipcode:zonecode, city:sido },
    }));
  };

  const onDetailAddressHandler = (e) => {
    const { value } = e.currentTarget;
    const detailAddress = filter_specialCharacter(value);

    setFormValues((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        detailAddress: detailAddress
      },
    }));
  };


  return (
    <>
      <SignupInput
        type={'text'}
        required={true}
        id={'address'}
        title={'주소 검색'}
        placeholder={'기본주소'}
        addedClassName={[
          'add-btn-section',
          `${formValues.address.street ? 'active-address' : 'hide-input'}`,
        ]}
        disabled
        value={formValues.address.street || ''}
        setFormValues={setFormValues}
        icon={
          formValues.address.street && (
            <Tooltip
              className={s.addressToolTip}
              message={`${formValues.address.street}\n(우:${formValues.address.zipcode})`}
              messagePosition={'right'}
              theme={'white'}
              device={'mobile'}
            />
          )
        }
      >
        <WindowOpener url={'/popup/searchAddress'} bridge={onReceivePopupData}>
          <span className={`${s.btn} ${s.bigbtn}`}>
            {formValues.address.city ? '재검색' : '주소검색'}
          </span>
        </WindowOpener>
        {formErrors.address && <ErrorMessage>{formErrors.address}</ErrorMessage>}
        {formValues.address.street && (
          <label>
            <input
              type="text"
              id={'address-detailAddress'}
              placeholder={'상세주소'}
              value={formValues.address.detailAddress || ""}
              onChange={onDetailAddressHandler}
            />
            {formErrors.detailAddress && <ErrorMessage>{formErrors.detailAddress}</ErrorMessage>}
          </label>
        )}
      </SignupInput>
    </>
  );
}

export default SignInput_address;
