import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import LineChart, { data } from '/src/components/admin/dashboard/LineChart';
import s from './dashboard.module.scss';
import ToolTip from '/src/components/atoms/Tooltip';
import SelectTag from '/src/components/atoms/SelectTag';

function DashboardPage() {
  return (
    <>
      <MetaTitle title="대시보드" admin={true} />
      <AdminLayout>
        <AdminContentWrapper className={s.wrapper}>
          <h1 className={`${s['title']} title_main`}>대시보드</h1>
          <section className={`${s['cont-top']} cont`}>
            <div className={s['title-section']}>
              <h2 className={s.title}>주문현황 <ToolTip
                message={'배송완료 및 주문완료된 주문을 제외한 주문리스트'}
                theme={'white'}
                messagePosition={'left'}
                className={s.tooltip}
              /></h2>
            </div>
            <div className={s['cont-section']}>
              <ul className={s.box}>
                <li>
                  <span>
                    결제완료
                  </span>
                  <span>
                    <b>0</b> 건
                  </span>
                </li>
                <li>
                  <span>
                    결제실패

                  </span>
                  <span>
                    <b>0</b> 건
                  </span>
                </li>
                <li>
                  <span>
                    구독보류

                  </span>
                  <span>
                    <b>0</b> 건
                  </span>
                </li>
              </ul>
              <ul className={s.box}>
                <li>
                  <span>
                    배송중

                  </span>
                  <span>
                    <b>0</b> 건
                  </span>
                </li>
              </ul>
              <ul className={s.box}>
                <li>
                  <span>
                    반품요청

                  </span>
                  <span>
                    <b>0</b> 건
                  </span>
                </li>
                <li>
                  <span>
                    교환요청

                  </span>
                  <span>
                    <b>0</b> 건
                  </span>
                </li>
                <li>
                  <span>
                    취소요청

                  </span>
                  <span>
                    <b>0</b> 건
                  </span>
                </li>
              </ul>
            </div>
          </section>
          <section className={`cont ${s['cont-left']}`}>
            <div className={s['title-section']}>
              <h2 className={s.title}>통계
              </h2>
            </div>
            <div className={s['cont-section']}>
              <ul className={s.box}>
                <li>
                  <span>신규주문</span>
                  <div>
                    <span>
                      <b>0</b>건
                    </span>
                    <SelectTag
                      name={'period'}
                      id={'new-order'}
                      className={s['select-period']}
                      // onChange={onCategoryHandler}
                      options={[
                        { label: '최근 1일', value: 1 },
                        { label: '최근 3일', value: 3 },
                        { label: '최근 7일', value: 7 },
                        { label: '최근 30일', value: 30 },
                      ]}
                      style={{ width: '90px', minWidth: 'auto' }}
                    />
                  </div>
                </li>
                <li>
                  <span>신규가입</span>
                  <div>
                    <span>
                      <b>0</b>건
                    </span>
                    <SelectTag
                      name={'period'}
                      id={'new-join'}
                      className={s['select-period']}
                      // onChange={onCategoryHandler}
                      options={[
                        { label: '최근 1일', value: 1 },
                        { label: '최근 3일', value: 3 },
                        { label: '최근 7일', value: 7 },
                        { label: '최근 30일', value: 30 },
                      ]}
                      style={{ width: '90px', minWidth: 'auto' }}
                    />
                  </div>
                </li>
                <li>
                  <span>방문자수</span>
                  <div>
                    <span>
                      <b>0</b>건
                    </span>
                    <SelectTag
                      name={'period'}
                      id={'visitor'}
                      className={s['select-period']}
                      // onChange={onCategoryHandler}
                      options={[
                        { label: '최근 1일', value: 1 },
                        { label: '최근 3일', value: 3 },
                        { label: '최근 7일', value: 7 },
                        { label: '최근 30일', value: 30 },
                      ]}
                      style={{ width: '90px', minWidth: 'auto' }}
                    />
                  </div>
                </li>
              </ul>
            </div>
          </section>
          <section className={`cont ${s['cont-right']}`}>
            <div className={s['title-section']}>
              <h2 className={s.title}>신규주문                <ToolTip
                message={'Google Analytics 데이터를 기반으로 한 통계입니다.'}
                theme={'white'}
                messagePosition={'left'}
                className={s.tooltip}
              /></h2>
            </div>
            <div className={s['cont-section']}>
              <div className={s['payment-info']}>
                <ul>
                  <li>
                    <span>일반결제</span>
                    <span>
                    <b>0</b>건
                  </span>
                  </li>
                  <li>
                    <span>정기결제</span>
                    <span>
                    <b>0</b>건
                  </span>
                  </li>
                </ul>
              </div>
              <LineChart chartData={data} />
            </div>

          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default DashboardPage;
