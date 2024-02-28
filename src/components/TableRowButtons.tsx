import Link from 'next/link'
import React, { FC } from "react"
import { useLanguage } from '@/hooks/i18n'

export interface ActionButtonProps {
  className?: string
  href?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => void
}
export interface TableRowButtonsProps {
  className?: string
  viewButton?: ActionButtonProps
  removeButton?: ActionButtonProps
  editButton?: ActionButtonProps
}

export const TableRowButtons: FC<TableRowButtonsProps> = ({
  className = "flex justify-center items-center space-x-3.5 text-xl",
  viewButton,
  removeButton,
  editButton
}) => {
  const { t } = useLanguage()

  return <>
    <div className={`${className}`}>

      {viewButton &&
        <Link
          title={t('View')}
          className={viewButton.className || "text-amber-700 hover:text-primary"}
          href={viewButton.href || '#'}
          onClick={(e) => {
            if (typeof viewButton.onClick == 'function') {
              e.preventDefault()
              viewButton.onClick(e)
            }
          }}
        >
          <i className="fa-regular fa-eye"></i>
        </Link>
      }
      {removeButton &&
        <Link
          title={t('Delete')}
          className={removeButton.className || "text-red hover:text-primary"}
          href={removeButton.href || '#'}
          onClick={(e) => {
            if (typeof removeButton.onClick == 'function') {
              e.preventDefault()
              removeButton.onClick(e)
            }
          }}
        >
          <i className="fa-regular fa-trash-can"></i>
        </Link>
      }

      {editButton &&
        <Link
          title={t('Edit')}
          className={editButton.className || "text-blue-600 hover:text-primary"}
          href={editButton.href || '#'}
          onClick={(e) => {
            if (typeof editButton.onClick == 'function') {
              e.preventDefault()
              editButton.onClick(e)
            }
          }}
        >
          <i className="fa-regular fa-pen-to-square"></i>
        </Link>
      }
    </div>
  </>
}

export default TableRowButtons