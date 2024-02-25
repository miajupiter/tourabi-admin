"use client"
import React, { useState } from "react"

const SelectGroupOne: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false)

  const changeTextColor = () => {
    setIsOptionSelected(true)
  }

  return (
    <div className="mb-4.5">
      <label className="mb-2.5 block text-black dark:text-white">
        {" "}
        Subject{" "}
      </label>

      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value)
            changeTextColor()
          }}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""
            }`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            Select your subject
          </option>
          <option value="USA" className="text-body dark:text-bodydark">
            USA
          </option>
          <option value="UK" className="text-body dark:text-bodydark">
            UK
          </option>
          <option value="Canada" className="text-body dark:text-bodydark">
            Canada
          </option>
        </select>

        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <i className="fa-solid fa-chevron-down"></i>

        </span>
      </div>
    </div>
  )
}

export default SelectGroupOne
