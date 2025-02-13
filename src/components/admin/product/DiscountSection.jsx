import {useEffect, useMemo, useState} from "react";
import styles from './discountSection.module.css';
import { discountUnitType } from "/store/TYPE/discountUnitType";
import CustomRadioTrueOrFalse from "../form/CustomRadioTrueOrFalse";
import DiscountOptions from "./DiscountOptions";
import CloseButton from "../../atoms/CloseButton";
import CustomSelect from "../form/CustomSelect";

// targetKey: 일반 할인  'general', 제휴사 할인 'alliance'
// allowMultiple: 일반 할인 false, 제휴사 할인 true
// items: 일반할인 'formValues', 제휴사 할인 'formValues.alliance 관련 객체 배열'
const DiscountSection = ({
	targetKey = 'general',
	title,
	items = [],
	setItems,
	originalPrice,
	categoryOptions = [],
	setAllianceCategory = () => {},
	formErrors = {},
	allowMultiple = false,
	initialActive,
}) => {
	// 일반 할인과 제휴사 할인의 데이터 명칭을 다르게 하기 위함
	const discountDegreeName = targetKey === 'general' ? 'discountDegree' : 'allianceDegree';
	const discountTypeName = targetKey === 'general' ? 'discountType' : 'allianceDiscountType';
	const salePriceName = targetKey === 'general' ? 'salePrice' : 'allianceSalePrice';

	// 수정시 할인 설정 여부 검증
	const [isActive, setIsActive] = useState(initialActive);

	useEffect(() => {
		setIsActive(initialActive);
	}, [initialActive]);

	// ----------------- targetKey === 'alliance' 의 경우에만 적용 -----------------
	const updateCategoryStock = (allianceId, inStock) => {
		const updatedCategoryOptions = categoryOptions.map(category =>
			category.value === allianceId ? { ...category, inStock } : category
		);
		setAllianceCategory(updatedCategoryOptions);
	}

	const handleAddItem = (allianceId) => {
		let newItem = {
			allianceId: Number(allianceId),
			[discountDegreeName]: 0,
			[discountTypeName]: discountUnitType.FLAT_RATE || discountUnitType.FIXED_RATE,
			[salePriceName]: 0,
		};
		setItems([...items, newItem]);
		updateCategoryStock(allianceId, false);
	};

	const handleRemoveItem = (allianceId) => {
		setItems(items.filter(item => item.allianceId !== allianceId));
		updateCategoryStock(allianceId, true);
	}
	// ------------------------------------------------------------------------

	// 할인 설정 N 선택시
	const handleResetItem = (value) => {
		setIsActive(value)
		if (!value) {
			setItems(targetKey === 'general' ? [{
				...items[0],
				salePrice: 0,
				discountDegree: 0,
				[discountTypeName]: discountUnitType.FLAT_RATE || discountUnitType.FIXED_RATE,
			}] : []);
			setAllianceCategory(prev => prev.map(category => category.value !== '' ? {...category, inStock: true} : category));
		}
	}
	return (
		<div className="cont_divider">
			<div className="input_row multipleLines">
				<div className="title_section fixedHeight">
					<label className="title">{title}</label>
				</div>
				<div className="inp_section">
					<div className={`inp_box ${styles.itemContainer}`}>
						<CustomRadioTrueOrFalse
							name={targetKey}
							value={isActive}
							setValue={(value) => handleResetItem(value)}
							labelList={['Y', 'N']}
							returnBooleanValue
						/>
						{isActive && allowMultiple && (
							<div className="inp_section">
								<div className="inp_box">
									<CustomSelect
										disabled={categoryOptions.every(category => !category.inStock)}
										options={categoryOptions}
										setFormValues={handleAddItem}
									/>
								</div>
							</div>
						)}
					</div>
					{isActive && items?.length > 0 && (
						items?.map((item, index) => (
							<div key={item.allianceId || index} className={styles.itemBox}>
								{allowMultiple && (
									<div className={styles.itemTop}>
											<span className={styles.itemLabel}>
												{categoryOptions.find(category => category.value === item.allianceId)?.label}
											</span>
										<CloseButton
											data-id={item.allianceId}
											onClick={() => handleRemoveItem(item.allianceId)}
											className={styles.closeButton}
										/>
									</div>
								)}
								<div>
									<DiscountOptions
										targetKey={targetKey}
										id={item.allianceId || targetKey}
										formValues={item}
										setFormValues={(updatedItem) => {
											setItems(items.map(value => value.allianceId === item.allianceId ? updatedItem : value));
										}}
										formErrors={formErrors[item.allianceId] || {}}
										originalPrice={originalPrice}
										discountDegreeName={discountDegreeName}
										discountTypeName={discountTypeName}
										salePriceName={salePriceName}
									/>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

const DiscountSettings = ({ formValues, setFormValues, formErrors, allianceList = [], isUpdate = false }) => {
  const [allianceCategory, setAllianceCategory] = useState(() => {
    const defaultCategory = [{ label: '선택', value: '' }];
    if (!allianceList.length) return defaultCategory;
		// getAllianceList 의 데이터 중복 방지
    return Array.from(
      new Map([...defaultCategory, ...allianceList].map(item => [item.value, item])).values()
    );
  });

	// 수정시 제휴사 할인 리스트를 감지하여 inStock 상태 업데이트
  useEffect(() => {
    setAllianceCategory((prevOptions) => {
      const outOfStockIds = new Set(formValues?.allianceDtoList?.map(item => item.allianceId));
      return prevOptions.map(category => ({
        ...category,
        inStock: outOfStockIds.has(category.value) || category.value === '' ? false : category.inStock ?? true,
      }));
    });
  }, [formValues.allianceDtoList]);

	return (
		<>
			<DiscountSection
				title='할인설정'
				targetKey='general'
				items={[formValues]}
				setItems={(updated) => setFormValues(updated[0])}
				formErrors={formErrors}
				initialActive={isUpdate ? formValues.salePrice !== formValues.originPrice && formValues.discountDegree === 0 : false}
			/>
			<DiscountSection
				title='제휴사 할인설정'
				targetKey='alliance'
				items={formValues.allianceDtoList}
				setItems={(updated) => setFormValues({ ...formValues, allianceDtoList: updated })}
				categoryOptions={allianceCategory}
				setAllianceCategory={setAllianceCategory}
				allowMultiple
				formErrors={formErrors.allianceDtoList || {}}
				originalPrice={formValues.originalPrice}
				initialActive={formValues.allianceDtoList?.length > 0}
			/>
		</>
	)
}

export default DiscountSettings;