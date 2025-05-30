import React, {useEffect, useState} from 'react';
import ErrorMessage from "../../atoms/ErrorMessage";
import CustomRadio from '/src/components/admin/form/CustomRadio';
import CustomRadioTrueOrFalse from "./CustomRadioTrueOrFalse";
import SelectUserAges from "./SelectUserAges";
import SelectUserGrades from "./SelectUserGrades";
import {global_areaType} from "/store/TYPE/areaType";


export default function SearchGroupForm ({ formValues, setFormValues, formErrors})  {

  return (
    <>
      <div className="optional-section">
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="name">
                회원등급
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <SelectUserGrades id={'gradeList'} setFormValues={setFormValues} />
                {formErrors?.gradeList && (
                  <ErrorMessage>{formErrors.gradeList}</ErrorMessage>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="name">
                연령
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <SelectUserAges setFormValues={setFormValues} fromId={'birthYearFrom'} toId={'birthYearTo'} />
                {(formErrors?.birthYearFrom ||  formErrors?.birthYearTo) && (
                  <ErrorMessage>{formErrors.birthYearFrom || formErrors.birthYearTo}</ErrorMessage>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="name">
                지역
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomRadio
                  setValue={setFormValues}
                  name="area"
                  value={formValues?.area}
                  idList={[global_areaType.ALL, global_areaType.METRO, global_areaType.NON_METRO]}
                  labelList={['전체', '수도권', '비수도권']}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="name">
                구독유무
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomRadioTrueOrFalse
                  name="subscribe"
                  setValue={setFormValues}
                  value={formValues.subscribe}
                  labelList={['Y', 'N']}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="name">
                장기미접속
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomRadioTrueOrFalse
                  name="longUnconnected"
                  setValue={setFormValues}
                  value={formValues.longUnconnected}
                  labelList={['Y', 'N']}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};