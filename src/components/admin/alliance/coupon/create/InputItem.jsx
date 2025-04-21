import ErrorMessage from "/src/components/atoms/ErrorMessage";
import CustomRadio from "/src/components/admin/form/CustomRadio";
import CustomSelect from "/src/components/admin/form/CustomSelect";
import InputWrapper from "./InputWrapper";
import { filterObjectKeys, filterObjectValues } from "/util/func/filter/filterTypeFromObejct";

const InputItem = ({
	type = 'text',
	label,
	id,
	handleChange,
	formValues,
	formErrors,
	options,
	setFormValues,
	subChildren,
	fullWidth,
	isDisabled,
}) => {
	switch (type) {
		case 'text':
			return (
				<InputWrapper
					id={id}
					label={label}
				>
					<div style={{ width: fullWidth ? '100%' : 'auto' }}>
						<div>
							<input
								id={id}
								type={type}
								name="create-coupon"
								className={fullWidth ? 'fullWidth' : 'text-align-right'}
								value={formValues[id]}
								onChange={(e) => handleChange(id, e.currentTarget.value)}
							/>
							{subChildren && subChildren}
						</div>
						{formErrors && formErrors[id] && (
							<ErrorMessage>{formErrors[id]}</ErrorMessage>
						)}
					</div>
				</InputWrapper>
			);
		case 'radio':
			return (
				<InputWrapper
					id={id}
					label={label}
				>
					<div>
						<CustomRadio
							setValue={setFormValues}
							name={id}
							idList={filterObjectKeys(options)}
							labelList={filterObjectValues(options.KOR)}
							value={formValues[id]}
						/>
						{formErrors && formErrors[id] && (
							<ErrorMessage>{formErrors[id]}</ErrorMessage>
						)}
					</div>
				</InputWrapper>
			)
		case 'select':
			return (
				<InputWrapper
					id={id}
					label={label}
				>
					<div>
						<div>
							<CustomSelect
								id={id}
								value={formValues[id]}
								options={options}
								setFormValues={setFormValues}
								dataType={typeof formValues[id]}
								disabled={isDisabled}
							/>
							{subChildren && subChildren}
						</div>
						{formErrors && formErrors[id] && (
							<ErrorMessage>{formErrors[id]}</ErrorMessage>
						)}
					</div>
				</InputWrapper>
			)
		default: return null;
	}
};

export default InputItem;