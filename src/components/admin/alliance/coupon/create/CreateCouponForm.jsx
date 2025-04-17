import * as s from '../allianceCoupon.module.scss';
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import InputItem from "/src/components/admin/alliance/coupon/create/InputItem";
import InputWrapper from "/src/components/admin/alliance/coupon/create/InputWrapper";
import UnitBox from "../../../../atoms/UnitBox";
import Tooltip from "../../../../atoms/Tooltip";
import { DateTimeInput } from "../../../form/DateTimeInput";
import { discountUnitType, unitSettings } from "/store/TYPE/discountUnitType";
import { couponUseType } from "/store/TYPE/couponType";

const couponLengthOptions = Array.from({ length: 16 - 8 + 1 }, (_, i) => ({
	label: i + 8,
	value: i + 8
}));

const CreateCouponForm = ({
	formValues,
	formErrors,
	allianceList,
	allianceEventList,
	setFormValues,
	setFormErrors,
	handleChange,
}) => {
	return (
		<div className="cont_body">
			<InputItem
				type='select'
				label='제휴사'
				id='allianceId'
				formValues={formValues}
				formErrors={formErrors}
				options={[{label: '선택', value: null}, ...allianceList]}
				setFormValues={setFormValues}
			/>
			<InputItem
				type='select'
				label='행사'
				id='eventName'
				formValues={formValues}
				formErrors={formErrors}
				options={[{label: '선택', value: null}, ...allianceEventList]}
				setFormValues={setFormValues}
				isDisabled={allianceEventList.length === 0}
				subChildren={<span className={s.pointCaption} style={{ marginLeft: '12px' }}>제휴사의 행사가 등록되어야 쿠폰 발급이 가능합니다.</span>
				}
			/>
			<InputItem
				label='쿠폰 이름'
				id='name'
				formValues={formValues}
				formErrors={formErrors}
				handleChange={handleChange}
				fullWidth
			/>
			<InputItem
				label='쿠폰 설명'
				id='description'
				formValues={formValues}
				formErrors={formErrors}
				handleChange={handleChange}
				fullWidth
			/>
			<InputItem
				type='radio'
				label='사용처'
				id='couponTarget'
				formValues={formValues}
				formErrors={formErrors}
				setFormValues={setFormValues}
				options={couponUseType}
			/>
			<InputWrapper
				id='discountDegree'
				label={`할인${formValues.discountType === discountUnitType.FIXED_RATE ? '률' : '금액'}`}
			>
				<div>
					<div className='inp_box'>
						<input
							id='discountDegree'
							className='text-align-right'
							name="create-coupon"
							type="text"
							value={formValues.discountDegree || '0'}
							onChange={(e) => handleChange('discountDegree', e.target.value)}
						/>
						<UnitBox
							name='discountType'
							value={formValues.discountType}
							setValue={setFormValues}
							unitList={unitSettings}
						/>
					</div>
					{formErrors.discountDegree && (
						<ErrorMessage>{formErrors.discountDegree}</ErrorMessage>
					)}
				</div>
			</InputWrapper>
			<InputItem
				label='최대 할인금액'
				id='availableMaxDiscount'
				formValues={formValues}
				formErrors={formErrors}
				handleChange={handleChange}
				subChildren={<span> 원 할인</span>}
			/>
			<InputItem
				label='최소 사용금액'
				id='availableMinPrice'
				formValues={formValues}
				formErrors={formErrors}
				handleChange={handleChange}
				subChildren={<span> 원 이상</span>}
			/>
			<InputItem
				label={
					<>
					<span>쿠폰 개수</span>
					<Tooltip
						message='입력한 개수만큼 난수쿠폰이 생성됩니다'
						messagePosition={'left'}
					/>
					</>
				}
				id='createCouponCount'
				formValues={formValues}
				formErrors={formErrors}
				handleChange={handleChange}
				subChildren={<span> 개</span>}
			/>
			<InputItem
				type='select'
				label={
					<>
						<span>쿠폰 코드 자릿수</span>
						<Tooltip
							message='선택한 자릿수만큼 쿠폰 코드가 생성됩니다'
							messagePosition={'left'}
						/>
					</>
				}
				id='codeLength'
				formValues={formValues}
				formErrors={formErrors}
				options={couponLengthOptions}
				setFormValues={setFormValues}
				subChildren={<span> 자리</span>}
			/>
			<InputWrapper
				label='쿠폰 사용 기간'
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<div>
						<DateTimeInput
							id='useStartDate'
							form={formValues}
							setForm={setFormValues}
							setErrors={setFormErrors}
						/>
						{formErrors.useStartDate && (
							<ErrorMessage>{formErrors.useStartDate}</ErrorMessage>
						)}
					</div>
					<i> ~ </i>
					<div>
						<DateTimeInput
							id='useExpiredDate'
							form={formValues}
							setForm={setFormValues}
							setErrors={setFormErrors}
							minDate={new Date().toISOString().slice(0, 10)}
						/>
						{formErrors.useExpiredDate && (
							<ErrorMessage>{formErrors.useExpiredDate}</ErrorMessage>
						)}
					</div>
				</div>
			</InputWrapper>
		</div>
	);
};

export default CreateCouponForm;