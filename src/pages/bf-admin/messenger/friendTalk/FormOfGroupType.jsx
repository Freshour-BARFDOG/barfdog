import calcedAgeList from "./calcedAgeList";
import CustomSelectGroup from "./CustomSelectGroup";
import CustomRadio from "/src/components/admin/form/CustomRadio";
import ToolTip from "/src/components/atoms/Tooltip";
import React from "react";



const FormOfGroupType = ({setFormValues}) => {


  const ageList = calcedAgeList();
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
              <CustomSelectGroup setFormValues={setFormValues} groupOptions={{
                startName: 'grade-start',
                endName: 'grade-end',
                options: [
                  {label: "-선택-", value: ""},
                  {label: "브론즈", value: "BRONZE"},
                  {label: "실버", value: "SILVER"},
                  {label: "골드", value: "GOLD"},
                  {label: "플래티넘", value: "PLATINUM"},
                  {label: "다이아", value: "DIA"},
                  {label: "더바프", value: "THEBARF"},
                ]
              }}/>
            </div>
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
                  setValue={setFormValues}
                  name="subscribe-yn"
                  idList={["subscribe-Y", "subscrib-N"]}
                  labelList={["Y", "N"]}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="cont_divider">
          <div className="input_row">
            <div className="title_section fixedHeight">
              <label className="title" htmlFor="releaseTarget">
                연령
              </label>
              <span style={{marginLeft: '4px', position: 'relative', top: '-2px'}}>
                <ToolTip message={'출생연도 기준'}/>
              </span>
            </div>
            <div className="inp_section">
              <div className="inp_box">
                <CustomSelectGroup setFormValues={setFormValues} groupOptions={{
                  startName: 'age-start',
                  endName: 'age-end',
                  options: ageList
                }}/>
              </div>
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
                  name="location"
                  idList={["ALL", "METRO", 'NON-METRO']}
                  labelList={["전체", "수도권", '비수도권']}
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
                  setValue={setFormValues}
                  name="unconnected-term"
                  idList={["term-YES", "term-NO"]}
                  labelList={["Y", "N"]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default FormOfGroupType;