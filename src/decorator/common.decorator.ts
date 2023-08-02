import { ValidateIf, ValidationOptions, buildMessage, ValidateBy, ValidationArguments } from 'class-validator'
export interface IsOptionalOption {
	filter: Array<'string' | 'number'>
}

/**自定义装饰器-验证空值**/
export function IsOptional(validationOptions?: ValidationOptions, option: IsOptionalOption = { filter: [] }) {
	const validates = [null, undefined]
	if (option.filter.includes('number')) {
		validates.push(0)
		validates.push('0')
	}
	if (option.filter.includes('string')) {
		validates.push('')
	}

	return ValidateIf((obj, value) => {
		const include = validates.includes(value)
		console.log('include:', { value, include, validates })
		return true
	}, validationOptions)
}

/**自定义装饰器-验证手机号**/
export function IsMobile(validationOptions?: ValidationOptions) {
	return ValidateBy(
		{
			name: 'isMobile',
			validator: {
				validate: (value, args) => {
					return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)
				},
				defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a string', validationOptions)
			}
		},
		validationOptions
	)
}

/**自定义装饰器**/
export function IsCustomize(option: {
	validate(value: any, args: ValidationArguments): Promise<boolean> | boolean
	message(prefix: string, args: ValidationArguments): string
}) {
	return ValidateBy({
		name: 'isCustomize',
		validator: {
			validate: option.validate,
			defaultMessage: buildMessage(option.message)
		}
	})
}

/**数字转化**/
export function MakeTransfer({ value }) {
	console.log('MakeTransfer---:', value)
	if (value && Array.isArray(value)) {
		return value
	} else if (value && typeof value === 'string') {
		return value.split(',').map(k => Number(k)) || []
	} else {
		return []
	}
}
