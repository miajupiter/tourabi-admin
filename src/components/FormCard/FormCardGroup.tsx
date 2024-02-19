"use client"
import { ReactNode, useState } from "react"

interface FormCardGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode
  activeCondition: boolean,
  id:string,
}

const FormCardGroup = ({
  children,
  activeCondition,
  id,
}: FormCardGroupProps) => {
  const storageKey = `formCard-expanded-${id}`
  const [open, setOpen] = useState<boolean>(activeCondition)

  const handleClick = () => {
    localStorage.setItem(storageKey, !open?'true':'false')
    setOpen(!open)
    
  }

  return <>{children(handleClick, open)}</>
}

export default FormCardGroup
