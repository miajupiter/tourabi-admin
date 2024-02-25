import React, { InputHTMLAttributes, useState } from "react"
import DateInput from './DateInput'
export interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {

  label?: string
  className?: string
  inputClassName?: string
  labelClassName?: string

}

export const DateInputWithLabel: React.FC<DateInputProps> = ({
  className = "",
  inputClassName = "",
  labelClassName = "",
  type = "text",
  label = "label",
  ...args
}) => {

  return (
    <div className={`${className}`}>
      <label className={`mb-3 block text-sm font-medium text-black dark:text-white ${labelClassName}`}>
        {label}
      </label>
      <DateInput type={type} placeholder={label}
        {...args}
      />
    </div>
  )
}


export default DateInputWithLabel
