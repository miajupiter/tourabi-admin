
import FormCard from '@/components/FormCard'
import { v4 } from 'uuid'
import { useLanguage } from '@/hooks/i18n'
import Link from 'next/link'
import { TourItemType } from './page'
import { useState, useEffect } from 'react'
import { uploadToS3Bucket } from '@/lib/s3bucketHepler'

export interface ImageItemProps {
  src: string
  width?: number
  height?: number
  title?: string
  alt?: string
  index: number
}
export const TourImages = ({ item, setItem, saveItem }: { item: TourItemType | any, setItem: any, saveItem: any }) => {
  const { t } = useLanguage()
  const [focusText, setFocusText] = useState('')

  const deleteTourImages = (index: number) => {
    if (item && item.images && index > -1 && index < item.images.length) {

      if (confirm(t(`do you want delete?`))) {
        item.images.splice(index, 1)
        setItem(item)
        saveItem({ images: item.images }).then((resp: any) => {
          console.log('moveTourImages resp:', resp)
        })
          .catch((err: any) => console.log('moveTourImages err:', err))

      } 

    }
    return <></>
  }

  const moveTourImages = (fromIndex: number, count: number) => {
    if (item && item.images && item.images.length > 0) {
      const toIndex = fromIndex + count

      if (toIndex >= 0 || toIndex < item.images.length) {

        // const element = item.images[fromIndex]
        const element = item.images.splice(fromIndex, 1)[0]
        item.images.splice(toIndex, 0, element)

        setItem(item)
        saveItem({ images: item.images })
          .then((resp: any) => {
            console.log('moveTourImages resp:', resp)
          })
          .catch((err: any) => console.log('moveTourImages err:', err))

      }

    }
    return <></>
  }

  const ImageItem: React.FC<ImageItemProps> = ({ src,width,height,  title, alt, index }) => {

    return (<>
      <div key={index} className='relative flex items-start'>
        <div className=' flex flex-col  items-start w-16 mt-3 space-y-4'>
          <div className='ms-auto me-2 h-12 w-10'>
            {` `}
            {index > 0 &&
              <Link className={`hover:text-primary text-xl `} title={t('Move up')}
                href="#"
                onClick={(e => {
                  e.preventDefault()
                  moveTourImages(index, -1)
                })}
              >
                <i className="fa-solid fa-arrow-up"></i>
              </Link>
            }
          </div>
          <div className='ms-auto me-2 h-12 w-10'>
            {` `}
            {index < item.images.length - 1 &&
              <Link className={`hover:text-primary text-xl`} title={t('Move down')}
                href="#"
                onClick={(e => {
                  e.preventDefault()
                  moveTourImages(index, 1)
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
              deleteTourImages(index)
            }}
          >
            <i className="fa-regular fa-trash-can"></i>
          </Link>
        </div>

        <div className='w-full'>
          <img className='aspect-auto rounded-lg' src={src || ''} alt={alt || ''} title={title || ''} />
        </div>
      </div>
    </>)
  }

  useEffect(() => {
    console.log(item.images)
  }, [t, item])

  useEffect(() => {
    console.log('useEffect 2')
  }, [])
  
  useEffect(() => {
    console.log('useEffect 3')
  }, [])
  
  return (
    <FormCard id="tour-images" title={t('Tour images')}
      defaultOpen={false}
      icon={(<i className="fa-regular fa-images"></i>)}
    >
      {item && <>
        <div className="grid grid-cols-1 gap-5.5 p-5">
          <div >
            {item.images && item.images.map((imgItem: ImageItemProps, index: number) =>
              <div key={'tour-images-' + v4()}
                className={`w-full mt-3 rounded-[4px] p-4 bg-opacity-5 ${index % 2 == 0 ? 'bg-slate-600' : 'bg-amber-600'} `}>

                {/* {plan && <ImageItem key={index} index={index} title={plan.title || ''} description={plan.description || ''} />} */}
                {imgItem && imgItem.src &&
                  <>
                    {ImageItem({src:imgItem.src,width:imgItem.width || 150,height:imgItem.height || 150, index: index,title: item.title || '', alt: item.title || '' })}
                  </>
                }

              </div>
            )}
          </div>
          <div className='text-center'>
            <Link
              href="#"
              className="inline-flex items-center justify-center border rounded-md bg-primary px-4 py-4 text-center font-medium text-white hover:bg-opacity-90 "
              onClick={async (e) => {
                if (!item.images) item.images = []
                item.images.push({
                  title: `New plan title ${item.images.length + 1}`,
                  description: ''
                })
                setItem(item)
                await saveItem({ images: item.images })
              }}
            >
              {t('Add New Image')}
            </Link>
          </div>
        </div>
      </>}
    </FormCard>
  )
}

export default TourImages