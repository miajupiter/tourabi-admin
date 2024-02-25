import React, { InputHTMLAttributes, useState } from "react"
import Input from './Input'
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {

  label?: string
  placeholder?: string
  className?: string
  inputClassName?: string
  labelClassName?: string

}

export const InputWithLabel: React.FC<InputProps> = ({
  className = "",
  inputClassName = "",
  labelClassName = "",
  type = "text",
  label,
  placeholder,
  ...args
}) => {

  return (
    <div className={`${className}`}>
      <label className={`mb-3 block text-sm font-medium text-black dark:text-white ${labelClassName}`}>
        {label || placeholder}
      </label>
      <Input type={type} placeholder={placeholder || label || ""}
        {...args}
      />
    </div>
  )
}


export default InputWithLabel
