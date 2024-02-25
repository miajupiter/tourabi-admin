import React, { FC, SelectHTMLAttributes, useState } from "react"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
  sizeClass?: string
}

const Select: FC<SelectProps> = ({
  className = "",
  sizeClass = "h-11",
  children,
  ...args
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false)
  return (
    <div className="relative bg-transparent dark:bg-form-input">
      <select
        // className={`nc-Select block w-full text-sm rounded-[4px] border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900  ${sizeClass} ${className}`}
        className={`nc-Select block w-full appearance-none rounded-[4px] border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""
          }`}
        {...args}
      >
        {children}
      </select>
      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <i className="fa-solid fa-chevron-down"></i>
        </span>
    </div>
  )
}

export default Select
