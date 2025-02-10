import { useEffect, useState } from "react";
import styles from './discountSection.module.css';
import { discountUnitType } from "/store/TYPE/discountUnitType";
import CustomRadioTrueOrFalse from "../form/CustomRadioTrueOrFalse";
import DiscountOptions from "./DiscountOptions";
import CloseButton from "../../atoms/CloseButton";
import CustomSelect from "../form/CustomSelect";

const DiscountSection = ({
	targetKey = 'general', // 일반 할인  'general', 제휴사 할인 'alliance'
	title,
	items = [],
	setItems,
	originalPrice,
	categoryOptions = [],
	setCategoryOptions = () => {},
	formErrors = {},
	allowMultiple = false, // 일반 할인 false, 제휴사 할인 true
}) => {
	const initialActive = items?.length > 0 ? items?.some(item => Number(item.discountDegree) !== 0) : false;
	const [isActive, setIsActive] = useState(initialActive);

	useEffect(() => {
		setIsActive(initialActive)
	}, []);

	const handleAddItem = (value) => {
		const newItem = {
			code: value,
			discountType: discountUnitType.FLAT_RATE || discountUnitType.FIXED_RATE,
			discountDegree: 0,
			salePrice: 0,
		};
		setItems([...items, newItem]);
		setCategoryOptions(categoryOptions.map(category =>
			category.value === value ? {...category, inStock: false} : category
		))
	};

	const handleRemoveItem = (code) => {
		setItems(items.filter(item => item.code !== code));
		setCategoryOptions(categoryOptions.map(category =>
			category.value === code ? {...category, inStock: true} : category
		))
	}

	const handleResetItem = (value) => {
		setIsActive(value)
		if (!value) {
			setItems(targetKey === 'general' ? [{
				...items[0],
				salePrice: 0,
				discountDegree: 0,
				discountType: discountUnitType.FLAT_RATE || discountUnitType.FIXED_RATE,
			}] : []);
			setCategoryOptions(categoryOptions.map(category => category.value !== '' ? {...category, inStock: true} : category));
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
							<div key={item.code || index} className={styles.itemBox}>
								{allowMultiple && (
									<div className={styles.itemTop}>
											<span className={styles.itemLabel}>
												{categoryOptions.find(category => category.value === item.code)?.label}
											</span>
										<CloseButton
											data-id={item.code}
											onClick={() => handleRemoveItem(item.code)}
											className={styles.closeButton}
										/>
									</div>
								)}
								<div>
									<DiscountOptions
										targetKey={targetKey}
										id={item.code || targetKey}
										formValues={item}
										setFormValues={(updatedItem) => {
											setItems(items.map(i => (i.code === item.code ? updatedItem : i)));
										}}
										formErrors={formErrors[item.code] || {}}
										originalPrice={originalPrice}
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

const DiscountSettings = ({ formValues, setFormValues, formErrors }) => {
	const [allianceCategory, setAllianceCategory] = useState([
		{ label: '선택', value: '' },
		{ label: '콕뱅크', value: 'cb', inStock: true, },
		{ label: 'SKT 우주패스', value: 'skt', inStock: true, },
	])
	return (
		<>
			<DiscountSection
				title='할인설정'
				targetKey='general'
				items={[formValues]}
				setItems={(updated) => setFormValues(updated[0])}
				formErrors={formErrors}
			/>
			<DiscountSection
				title='제휴사 할인설정'
				targetKey='alliance'
				items={formValues.alliance}
				setItems={(updated) => setFormValues({ ...formValues, alliance: updated })}
				categoryOptions={allianceCategory}
				setCategoryOptions={setAllianceCategory}
				allowMultiple
				formErrors={formErrors.alliance || {}}
				originalPrice={formValues.originalPrice}
			/>
		</>
	)
}

export default DiscountSettings;