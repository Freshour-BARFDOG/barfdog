import styles from './allianceSetting.module.scss';
import tableStyle from "../../../popup/admin_ProductInfo/popup_sell.module.scss";

const AllianceDetailInfo = ({ infoList }) => {
  const fullWidth = (fullWidth) => fullWidth ? { gridColumn: 'span 2' } : {}
  return (
    <div className={`${styles.detailTable} ${tableStyle['table-list']}`}>
      {infoList.map(info => (
        <div key={info.label}>
          <div className={tableStyle["t-header"]}>
            <h4 className={tableStyle.title}>{info.label}</h4>
          </div>
          <ul className={tableStyle["t-body"]}>
            <li className={`${tableStyle["t-row"]} ${info.fullWidth ? tableStyle.fullWidth : ''}`}>
              {info.items.map(item => (
                <div key={item.label} className={tableStyle["t-box"]} style={fullWidth(item.fullWidth)}>
                  <div className={`${tableStyle.innerBox} ${tableStyle.label}`} style={{ height: '100%' }}>
                    <span>{item.label}</span>
                  </div>
                  <div className={`${tableStyle.innerBox} ${tableStyle.cont}`} style={{ height: '100%' }}>
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AllianceDetailInfo;