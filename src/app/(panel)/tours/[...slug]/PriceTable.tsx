
import FormCard from '@/components/FormCard'
import { v4 } from 'uuid'
import { useLanguage } from '@/hooks/i18n'
import Link from 'next/link'
import { TourItemType } from './page'
import { useState, useEffect } from 'react'
import DateInputWithLabel from '@/components/DateInputWithLabel'
import SelectWithLabel from '@/components/SelectWithLabel'
import InputWithLabel from '@/components/InputWithLabel'

export enum PriceItemStatus {
  avail = 'avail',
  closed = 'closed',
  cancelled = 'cancelled',
}
export interface PriceItemProps {
  dateFrom: string
  dateTo: string
  deadline: string
  status: PriceItemStatus | string
  price: number
  index: number

}
export const PriceTable = ({ item, setItem, saveItem, readOnly }: { item: TourItemType | any, setItem: any, saveItem: any, readOnly?: boolean }) => {
  const { t } = useLanguage()
  const [deletingIndex, setDeletingIndex] = useState(-1)
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')

  const deletePriceTable = async (index: number) => {
    if (item && item.priceTable && index > -1 && index < item.priceTable.length) {
      setDeletingIndex(index)

      if (confirm(t(`do you want delete?`))) {
        setDeletingIndex(-1)
        item.priceTable.splice(index, 1)
        setItem({ ...item, priceTable: item.priceTable })
        saveItem({ priceTable: item.priceTable })

      } else {
        setDeletingIndex(-1)
      }

    }
    return <></>
  }

  const movePriceTable = async (fromIndex: number, count: number) => {
    if (item && item.priceTable && item.priceTable.length > 0) {
      const toIndex = fromIndex + count

      if (toIndex >= 0 || toIndex < item.priceTable.length) {
        const element = item.priceTable.splice(fromIndex, 1)[0]
        item.priceTable.splice(toIndex, 0, element)

        setItem({ ...item, priceTable: item.priceTable })
        saveItem({ priceTable: item.priceTable })
      }

    }
    return <></>
  }

  const PriceItem: React.FC<PriceItemProps> = ({ dateFrom, dateTo, deadline, status, price, index }) => {

    return (<>
      <div className='relative flex items-start'>
        <div className=' flex flex-col  items-start w-24 mt-0 space-y-2'>
          {!readOnly &&
            <>
              <div className='ms-auto me-2 h-8 w-10'>
                {` `}
                {index > 0 &&
                  <Link className={`hover:text-primary text-xl `} title={t('Move up')}
                    href="#"
                    onClick={(e => {
                      e.preventDefault()
                      movePriceTable(index, -1)
                    })}
                  >
                    <i className="fa-solid fa-arrow-up"></i>
                  </Link>
                }
              </div>
              <div className='ms-auto me-2 h-8 w-10'>
                {` `}
                {index < item.travelPlan.length - 1 &&
                  <Link className={`hover:text-primary text-xl`} title={t('Move down')}
                    href="#"
                    onClick={(e => {
                      e.preventDefault()
                      movePriceTable(index, 1)
                    })}
                  >
                    <i className="fa-solid fa-arrow-down"></i>
                  </Link>
                }
              </div>
              <Link className="absolute bottom-1 start-0 text-red disabled:text-opacity-25 :not(:disabled):hover:text-primary" title={t('Delete')}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  deletePriceTable(index)
                }}
              >
                <i className="fa-regular fa-trash-can"></i>
              </Link>
            </>}
        </div>
        <div className='w-full'>
          <div className='grid grid-cols-5 gap-4'>
            <DateInputWithLabel readOnly={readOnly}
              label={t('From')}
              defaultValue={dateFrom}
              onBlur={async (e) => {
                if (item.priceTable[index].dateFrom != e.target.value) {
                  item.priceTable[index].dateFrom = e.target.value
                  setItem({ ...item, priceTable: item.priceTable })
                  await saveItem({ priceTable: item.priceTable })
                }
              }}
            />
            <DateInputWithLabel readOnly={readOnly}
              label={t('To')}
              defaultValue={dateTo}
              onBlur={async (e) => {
                if (item.priceTable[index].dateTo != e.target.value) {
                  item.priceTable[index].dateTo = e.target.value
                  setItem({ ...item, priceTable: item.priceTable })
                  await saveItem({ priceTable: item.priceTable })
                }
              }}
            />
            <DateInputWithLabel readOnly={readOnly}
              label={t('Deadline')}
              defaultValue={deadline}
              onBlur={async (e) => {
                if (item.priceTable[index].deadline != e.target.value) {
                  item.priceTable[index].deadline = e.target.value
                  setItem({ ...item, priceTable: item.priceTable })
                  await saveItem({ priceTable: item.priceTable })
                }
              }}
            />
            <SelectWithLabel readOnly={readOnly}
              label={t('Status')}
              defaultValue={status || PriceItemStatus.avail}
              onBlur={async (e) => {
                if (item.priceTable[index].status != e.target.value) {
                  item.priceTable[index].status = e.target.value
                  setItem({ ...item, priceTable: item.priceTable })
                  await saveItem({ priceTable: item.priceTable })
                }
              }}>
              {Object.keys(PriceItemStatus).map((e, index) => <>
                <option key={index} value={e} className=''>{e}</option>
              </>)}
            </SelectWithLabel>
            <InputWithLabel readOnly={readOnly}
              label={t('Price')}
              type="number"
              defaultValue={price || 0}
              onBlur={async (e) => {
                if (item.priceTable[index].price != Number(e.target.value)) {
                  item.priceTable[index].price = Number(e.target.value)
                  setItem({ ...item, priceTable: item.priceTable })
                  await saveItem({ priceTable: item.priceTable })
                }
              }}
            />
          </div>
        </div>
      </div>
    </>)
  }

  useEffect(() => {

  }, [t, item])
  return (<>
    {item && <>
      <div className="grid grid-cols-1 gap-4">
        <div >
          {item.priceTable && item.priceTable.map((priceItem: PriceItemProps, index: number) =>
            <div key={'tours-price-table-' + index.toString()}
              className={`w-full mt-3 rounded-[4px] p-4 bg-opacity-5 ${index % 2 == 0 ? 'bg-slate-600' : 'bg-amber-600'} `}>
              {priceItem &&
                <>
                  {PriceItem({ ...priceItem, index })}
                </>
              }

            </div>
          )}
        </div>
        {!readOnly &&
          <>
            <div className='text-center'>
              <Link
                href="#"
                className="inline-flex items-center justify-center border rounded-md bg-primary px-4 py-4 text-center font-medium text-white hover:bg-opacity-90 "
                onClick={async (e) => {
                  if (!item.priceTable) item.priceTable = []
                  item.priceTable.push({
                    dateFrom: new Date().toISOString().substring(0, 10),
                    dateTo: new Date().toISOString().substring(0, 10),
                    deadline: new Date().toISOString().substring(0, 10),
                    status: PriceItemStatus.avail,
                    price: 0
                  })
                  setItem({ ...item, priceTable: item.priceTable })
                  await saveItem({ priceTable: item.priceTable })
                }}
              >
                {t('Add Price Plan')}
              </Link>
            </div>
          </>
        }
      </div>
    </>}
  </>)
}

export default PriceTable