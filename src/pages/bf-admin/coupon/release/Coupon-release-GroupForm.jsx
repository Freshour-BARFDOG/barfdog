import React from 'react';
import CustomSelectGroup from '/src/components/admin/messenger/friendTalk/CustomSelectGroup';
import calcedAgeList from '/util/func/calcedAgeList';
import CustomRadio from '/src/components/admin/form/CustomRadio';


export default function CouponReleaseGroupForm (props)  {
  const {setFormValues} = props;


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
                <CustomSelectGroup
                  setFormValues={setFormValues}
                  groupOptions={{
                    startName: 'grade-start',
                    endName: 'grade-end',
                    options: [
                      { label: '선택', value: '' },
                      { label: '브론즈', value: 'BRONZE' },
                      { label: '실버', value: 'SILVER' },
                      { label: '골드', value: 'GOLD' },
                      { label: '플래티넘', value: 'PLATINUM' },
                      { label: '다이아', value: 'DIA' },
                      { label: '더바프', value: 'THEBARF' },
                    ],
                  }}
                />
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
                <CustomSelectGroup
                  setFormValues={setFormValues}
                  groupOptions={{
                    startName: 'age-start',
                    endName: 'age-end',
                    options: calcedAgeList(),
                  }}
                />
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
                  idList={['ALL', 'METRO', 'NON-METRO']}
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
                <CustomRadio
                  setValue={setFormValues}
                  name="subscribe"
                  idList={['TRUE', 'FALSE']}
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
                <CustomRadio
                  setValue={setFormValues}
                  name="longUnconnected"
                  idList={['TRUE', 'FALSE']}
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