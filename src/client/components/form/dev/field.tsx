import { FC } from 'react'
import { FormFieldProps } from '@client/utilities/form.types'

import {
  DevFormField,
  DevFormLabel,
  DevFormLabelText,
  DevFormLabelInput,
  DevFormFieldWarning,
} from '../dev-form-styled'

import { WarningSVG } from '@client/components/ui/svg'

const FormField: FC<FormFieldProps> = ({
  title,
  placeholder,
  register,
  errors,
}) => {
  const tag = title.toLowerCase()
  return (
    <DevFormField>
      <DevFormLabel htmlFor={tag}>
        <DevFormLabelText>{title}</DevFormLabelText>
      </DevFormLabel>
      <DevFormLabelInput
        {...register(tag)}
        id={tag}
        type="text"
        placeholder={placeholder ? placeholder : `valid ${tag}`}
        className={`
            ${errors[tag] && 'invalid'}
            `}
      />
      {errors[tag]?.message && (
        <DevFormFieldWarning>
          <WarningSVG />
          <span>{errors[tag]?.message?.toString()}</span>
        </DevFormFieldWarning>
      )}
    </DevFormField>
  )
}

export default FormField
