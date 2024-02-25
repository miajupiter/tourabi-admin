
import FormCard from '@/components/FormCard'
import { v4 } from 'uuid'
import { useLanguage } from '@/hooks/i18n'
import Link from 'next/link'
import Image from 'next/image'
import { DestinationItemType } from './page'
import { useState, useEffect } from 'react'
import { uploadToS3Bucket } from '@/lib/s3bucketHepler'
import { ShowError, ShowMessage } from '@/widgets/Alerts'

export interface ImageItemProps {
  src: string
  width?: number
  height?: number
  title?: string
  alt?: string
  index: number
}
export const DestinationImages = ({ item, setItem, saveItem, readOnly = false }: { item: DestinationItemType | any, setItem: any, saveItem: any, readOnly?: boolean }) => {
  const { t } = useLanguage()
  const [uploading, setUploading] = useState(false)

  const deleteDestinationImages = (index: number) => {
    if (item && item.images && index > -1 && index < item.images.length) {

      if (confirm(t(`do you want delete?`))) {
        item.images.splice(index, 1)
        setItem(item)
        saveItem({ images: item.images }).then((resp: any) => {
          console.log('moveDestinationImages resp:', resp)
        })
          .catch((err: any) => console.log('moveDestinationImages err:', err))

      }

    }
    return <></>
  }

  const moveDestinationImages = (fromIndex: number, count: number) => {
    if (item && item.images && item.images.length > 0) {
      const toIndex = fromIndex + count

      if (toIndex >= 0 || toIndex < item.images.length) {

        const element = item.images[fromIndex]
        item.images.splice(fromIndex, 1)
        item.images.splice(toIndex, 0, element)

        setItem(item)
        saveItem({ images: item.images })
          .then((resp: any) => {
            console.log('moveDestinationImages resp:', resp)
          })
          .catch((err: any) => console.log('moveDestinationImages err:', err))

      }

    }
    return <></>
  }

  const ImageItem: React.FC<ImageItemProps> = ({ src, width, height, title, alt, index }) => {

    return (<>
      <div key={index} className='relative flex items-start'>
        {!readOnly && <div className=' flex flex-col  items-start w-16 mt-3 space-y-4'>
          <div className='ms-auto me-2 h-12 w-10'>
            {` `}
            {index > 0 &&
              <Link className={`hover:text-primary text-xl `} title={t('Move up')}
                href="#"
                onClick={(e => {
                  e.preventDefault()
                  moveDestinationImages(index, -1)
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
                  moveDestinationImages(index, 1)
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
              deleteDestinationImages(index)
            }}
          >
            <i className="fa-regular fa-trash-can"></i>
          </Link>
        </div>
        }
        <div className='w-full'>
          <Image className='aspect-square rounded-lg' src={src || ''} alt={alt || ''} title={title || ''} width={width} height={height} />
        </div>
      </div>
    </>)
  }

  const handleUpload = async (file: File) => {

    if (!file) {
      ShowError('Please select a file to upload.')
      return
    }

    setUploading(true)
    uploadToS3Bucket(file, `tour-images002/${file.name}`)
      .then(fileUrl => {
        if (!item.images) {
          item.images = []
        }
        item.images.push({
          image: fileUrl,
          thumbnail: fileUrl
        })
        setItem(item)
        saveItem({ images: item.images })
          .then(() => {
            setUploading(false)
          })
          .catch((err: any) => {
            setUploading(false)
            ShowError(err)
          })

      })
      .catch(err => {
        setUploading(false)
        ShowError(err)
      })

  }

  useEffect(() => {
  }, [t, item])


  return (
    <FormCard id="destination-images" title={t('Destination images')}
      defaultOpen={false}
      icon={(<i className="fa-regular fa-images"></i>)}
    >
      {item && <>
        <div className="grid grid-cols-1 gap-5.5 p-5">
          <div >
            {item.images && item.images.map((imgItem: any, index: number) => {
              return (<div key={'destination-images-' + v4()}
                className={`w-full max-w-screen-2xl mt-3 rounded-[4px]p-4 bg-opacity-5 ${index % 2 == 0 ? 'bg-slate-600' : 'bg-amber-600'} `}>

                {imgItem && imgItem.image &&
                  <>
                    {ImageItem({ src: imgItem.image, width: 300, height: 300,  index, title: 'title', alt: 'alt' })}
                  </>
                }

              </div>)
            }
            )}
          </div>
          {!readOnly &&
            <div className='text-center'>
              <input
                disabled={uploading}
                type="file"
                //className="absolute inset-0 opacity-0 cursor-pointer"
                className="inline-flex items-center justify-center border rounded-md bg-primary px-4 py-4 text-center font-medium text-white hover:bg-opacity-90 "
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    handleUpload(files[0])

                  }
                }}
              />

            </div>
          }
        </div>
      </>}
    </FormCard>
  )
}

export default DestinationImages