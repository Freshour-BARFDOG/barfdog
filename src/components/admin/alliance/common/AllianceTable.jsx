import s from "./allianceCommon.module.scss";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";

const AllianceTable = ({
  itemList,
  tableTitle,
  buttons,
  tableHeader,
  tableBody,
  className,
}) => {
  return (
    <>
      <div className="cont_header clearfix">
        <h4 style={{ marginBottom: '12px' }}>{tableTitle}</h4>
        <div className={s.allianceTableActions}>
          {buttons}
        </div>
      </div>
      <div className={`${s.cont_viewer}`}>
        <div className={`${s.table} ${className || ''}`}>
          <ul className={`${s.table_header}`}>
            {tableHeader}
          </ul>
          {itemList?.length > 0 ? (
            <ul className={s.table_body}>
              {tableBody}
            </ul>
          ) : <AmdinErrorMessage text="조회된 데이터가 없습니다." />
          }
        </div>
      </div>
    </>
  );
};

export default AllianceTable;