
import FormCard from '@/components/FormCard'
import { v4 } from 'uuid'
import { useLanguage } from '@/hooks/i18n'
import Link from 'next/link'
import { TourItemType } from './page'
import { useState, useEffect } from 'react'

export interface PlanItemProps {
  title: string
  description: string
  index: number
}
export const TravelPlan = ({ item, setItem, saveItem, readOnly }: { item: TourItemType | any, setItem: any, saveItem: any, readOnly?: boolean }) => {
  const { t } = useLanguage()
  const [deletingIndex, setDeletingIndex] = useState(-1)
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')

  const deleteTravelPlan = (index: number) => {
    if (item && item.travelPlan && index > -1 && index < item.travelPlan.length) {
      setDeletingIndex(index)

      if (confirm(t(`do you want delete?`))) {
        setDeletingIndex(-1)
        item.travelPlan.splice(index, 1)
        setItem(item)
        saveItem({ travelPlan: item.travelPlan }).then((resp: any) => {
          console.log('moveTravelPlan resp:', resp)
        })
          .catch((err: any) => console.log('moveTravelPlan err:', err))

      } else {
        setDeletingIndex(-1)
      }

    }
    return <></>
  }

  const moveTravelPlan = (fromIndex: number, count: number) => {
    if (item && item.travelPlan && item.travelPlan.length > 0) {
      const toIndex = fromIndex + count

      if (toIndex >= 0 || toIndex < item.travelPlan.length) {

        // const element = item.travelPlan[fromIndex]
        const element = item.travelPlan.splice(fromIndex, 1)[0]
        item.travelPlan.splice(toIndex, 0, element)

        setItem(item)
        saveItem({ travelPlan: item.travelPlan })
          .then((resp: any) => {
            console.log('moveTravelPlan resp:', resp)
          })
          .catch((err: any) => console.log('moveTravelPlan err:', err))

      }

    }
    return <></>
  }

  const PlanItem: React.FC<PlanItemProps> = ({ title, description, index }) => {

    return (<>
      <div className='relative flex items-start'>
        <div className=' flex flex-col  items-start w-24 mt-3 space-y-4'>
          <div className="flex items-center">
            <span className='text-2xl me-2'> {index + 1}. </span>
            <span className='text-sm'>{t('day')}</span>
          </div>
          {!readOnly &&
            <>
              <div className='ms-auto me-2 h-12 w-10'>
                {` `}
                {index > 0 &&
                  <Link className={`hover:text-primary text-xl `} title={t('Move up')}
                    href="#"
                    onClick={(e => {
                      e.preventDefault()
                      moveTravelPlan(index, -1)
                    })}
                  >
                    <i className="fa-solid fa-arrow-up"></i>
                  </Link>
                }
              </div>
              <div className='ms-auto me-2 h-12 w-10'>
                {` `}
                {index < item.travelPlan.length - 1 &&
                  <Link className={`hover:text-primary text-xl`} title={t('Move down')}
                    href="#"
                    onClick={(e => {
                      e.preventDefault()
                      moveTravelPlan(index, 1)
                    })}
                  >
                    <i className="fa-solid fa-arrow-down"></i>
                  </Link>
                }
              </div>
              <Link className="absolute bottom-0 start-0 text-red disabled:text-opacity-25 :not(:disabled):hover:text-primary" title={t('Delete')}
                // disabled={!((plan.title || '').trim() == '' && (plan.destination || '').trim() == '')}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  deleteTravelPlan(index)
                }}
              >
                <i className="fa-regular fa-trash-can"></i>
              </Link>
            </>}
        </div>

        <div className='w-full'>
          <input
            readOnly={readOnly}
            type="text"
            placeholder={t('Title')}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-transparent dark:text-white dark:focus:border-primary"
            defaultValue={title || ''}
            onFocus={(e) => { e.preventDefault(); setFocusText(e.target.value) }}
            onChange={(e) => {
              if (item.travelPlan && item.travelPlan[index] && item.travelPlan[index].title != undefined) {
                item.travelPlan[index].title = e.target.value
                setItem(item)
              }
            }}
            onBlur={(e) => {
              if (focusText != e.target.value) {
                saveItem({ travelPlan: item.travelPlan })
              }
            }}
          />
          <textarea
            readOnly={readOnly}
            rows={5}
            placeholder={t('Description')}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-slate-500 dark:bg-transparent dark:text-white dark:focus:border-primary"
            defaultValue={description || ''}
            onFocus={(e) => { e.preventDefault(); setFocusText(e.target.value) }}
            onChange={(e) => {
              if (item.travelPlan && item.travelPlan[index] && item.travelPlan[index].description != undefined) {
                item.travelPlan[index].description = e.target.value
                setItem(item)
              }
            }}
            onBlur={(e) => {

              if (focusText != e.target.value) {
                saveItem({ travelPlan: item.travelPlan })
              }
            }}
          ></textarea>
        </div>
      </div>
    </>)
  }

  useEffect(() => {

  }, [t, item])
  return (
    <FormCard id="tours-travelplan" title={t('Travel plan')}
      defaultOpen={false}
      icon={(<i className="fa-solid fa-list-ol"></i>)}
    >
      {item && <>
        <div className="grid grid-cols-1 gap-5.5 p-5">
          <div >
            {item.travelPlan && item.travelPlan.map((plan: any, index: number) =>
              <div key={'tours-travel-plan' + v4()}
                className={`w-full mt-3 rounded-[4px] p-4 bg-opacity-5 ${index % 2 == 0 ? 'bg-slate-600' : 'bg-amber-600'} `}>

                {/* {plan && <PlanItem key={index} index={index} title={plan.title || ''} description={plan.description || ''} />} */}
                {plan &&
                  <>
                    {PlanItem({ index: index, title: plan.title || '', description: plan.description || '' })}
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
                    if (!item.travelPlan) item.travelPlan = []
                    item.travelPlan.push({
                      title: `New plan title ${item.travelPlan.length + 1}`,
                      description: ''
                    })
                    setItem(item)
                    await saveItem({ travelPlan: item.travelPlan })
                  }}
                >
                  {t('Add Travel Plan')}
                </Link>
              </div>
            </>
          }
        </div>
      </>}
    </FormCard>
  )
}

export default TravelPlan