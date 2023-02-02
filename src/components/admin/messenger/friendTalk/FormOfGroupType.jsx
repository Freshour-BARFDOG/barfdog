import React, {useCallback} from 'react';
import CustomSelectGroup from './CustomSelectGroup';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import ToolTip from '/src/components/atoms/Tooltip';
import calcedAgeList from '/util/func/calcedAgeList';
import {global_areaType} from "/store/TYPE/areaType";
import {gradeTypeOptions} from "/store/TYPE/gradeType";
import ErrorMessage from "../../../atoms/ErrorMessage";




const FormOfGroupType = ({formValues, setFormValues,formErrors}) => {
  return (
    <>
      <div className="cont_divider">
        <div className="input_row">
          <div className="title_section fixedHeight">
            <label className="title" htmlFor="releaseTarget">
              회원등급
            </label>
          </div>
          <div className="inp_section">
            <div className="inp_box">
              <CustomSelectGroup
                formValues={formValues}
                setFormValues={setFormValues}
                groupOptions={{
                  fromName: 'gradeStart',
                  toName: 'gradeEnd',
                  options: gradeTypeOptions(),
                  optionType: 'grade'
                }}
              />
            </div>
            {(formErrors.gradeStart || formErrors.gradeEnd) && (
              <ErrorMessage>{formErrors.gradeStart || formErrors.gradeEnd}</ErrorMessage>)
            }
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="releaseTarget">
                구독유무
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomRadio
                  value={formValues.subscribe}
                  setValue={setFormValues}
                  name="subscribe"
                  idList={['subscribe-Y', 'subscribe-N']}
                  labelList={['Y', 'N']}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="releaseTarget">
                출생연도
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomSelectGroup
                  formValues={formValues}
                  setFormValues={setFormValues}
                  groupOptions={{
                    fromName: 'birthYearFrom',
                    toName: 'birthYearTo',
                    options: calcedAgeList({typeofValue: 'string'}),
                    optionType: 'birthYear'
                  }}
                />
              </div>
              {(formErrors.birthYearFrom || formErrors.birthYearTo) && (
                <ErrorMessage>{formErrors.birthYearFrom || formErrors.birthYearTo}</ErrorMessage>)
              }
            </div>
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="releaseTarget">
                지역
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomRadio
                  setValue={setFormValues}
                  name="area"
                  value={formValues.area}
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
              <label className="title" htmlFor="releaseTarget">
                장기 미접속
              </label>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomRadio
                  value={formValues.longUnconnected}
                  setValue={setFormValues}
                  name="longUnconnected"
                  idList={['term-YES', 'term-NO']}
                  labelList={['Y', 'N']}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default FormOfGroupType;
