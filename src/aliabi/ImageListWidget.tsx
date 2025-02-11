
import FormCard from '@/aliabi/FormCard'
import { v4 } from 'uuid'
import { useLanguage } from '@/hooks/i18n'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, FC } from 'react'
import { ImageResizeFitType, uploadMultiToS3AliAbi } from '@/lib/s3bucketHepler'
import { ShowError, ShowMessage } from '@/widgets/Alerts'
import { useLogin } from '@/hooks/useLogin'

export interface ImageItemProps {
  _id?: string
  src: string,
  width?: number,
  height?: number,
  size?: number,
  alt?: string,
  mimetype?: string,
  fit: { type: String, index: true },
  img800: {
    src: string,
    width: number,
    height: number,
    size: number,
  },
  img400: {
    src: string,
    width: number,
    height: number,
    size: number,
  },
  img200: {
    src: string,
    width: number,
    height: number,
    size: number,
  },
  img100: {
    src: string,
    width: number,
    height: number,
    size: number,
  },
  tags?: string,
  createdDate?: string
  index?: number
}

export interface ImageListWidgetProps {
  images: ImageItemProps[],
  saveImages: any,
  uploadFolder: string,
  title?: string,
  id?: string,
  readOnly?: boolean
  tags?: string,
  fit?: string,
}




export const ImageListWidget: FC<ImageListWidgetProps> = ({ images, saveImages, uploadFolder, title, id = v4(), readOnly = false, tags }) => {
  const { t } = useLanguage()
  const { token } = useLogin()

  const [uploading, setUploading] = useState(false)

  const deleteImage = (index: number) => {
    if (images && index > -1 && index < images.length) {

      if (confirm(t(`do you want to delete image?`))) {
        images.splice(index, 1)
        saveImages(images)
      }
    }
    return <></>
  }

  const moveImage = (fromIndex: number, count: number) => {
    if (images && images.length > 0) {
      const toIndex = fromIndex + count
      if (toIndex >= 0 || toIndex < images.length) {
        const element = images[fromIndex]
        images.splice(fromIndex, 1)
        images.splice(toIndex, 0, element)
        saveImages(images)
      }
    }
    return <></>
  }

  const ImageItem: React.FC<ImageItemProps> = ({ ...props }) => {
    const index=props.index || 0
    return (<>
      <div className='relative flex items-start'>
        {!readOnly && <div className=' flex flex-col  items-start w-16 mt-3 space-y-4'>
          <div className='ms-auto me-2 h-12 w-10'>
            {` `}
            {index > 0 &&
              <Link className={`hover:text-primary text-xl `}
                title={t('Move up')}
                href="#"
                onClick={(e => {
                  e.preventDefault()
                  moveImage(index, -1)
                })}
              >
                <i className="fa-solid fa-arrow-up"></i>
              </Link>
            }
          </div>
          <div className='ms-auto me-2 h-12 w-10'>
            {` `}
            {index < images.length - 1 &&
              <Link className={`hover:text-primary text-xl`} title={t('Move down')}
                href="#"
                onClick={(e => {
                  e.preventDefault()
                  moveImage(index, 1)
                })}
              >
                <i className="fa-solid fa-arrow-down"></i>
              </Link>
            }
          </div>
          <Link className="absolute bottom-0 start-0 text-red disabled:text-opacity-25 :not(:disabled):hover:text-primary" title={t('Delete')}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              deleteImage(index)
            }}
          >
            <i className="fa-regular fa-trash-can"></i>
          </Link>
        </div>
        }
        <div className='w-full'>
          {!props.img400.src && props.src && <>
            <Image className='aspect-square rounded-lg' src={props.src || ''} alt={props.alt || ''} title={title || ''} width={props.width} height={props.height} />
          </>}
          {props.img400.src && <>
            <Image className='aspect-square rounded-lg' src={props.img400.src || ''} alt={props.alt || ''} title={title || ''} width={props.img400.width} height={props.img400.height} />
          </>}
        </div>
      </div>
    </>)
  }

  const handleUpload = (files: FileList) => {
    if (files.length == 0) return


  }

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [t, images])


  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className='grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' >
          {images && (images || []).map((imgItem: ImageItemProps, index: number) => <>
            <div key={index}
              className={`w-full max-w-screen-2xl mt-3 rounded-[4px] p-4 bg-opacity-5 ${index % 2 == 0 ? 'bg-slate-600' : 'bg-amber-600'} `}>
              {imgItem.src && <ImageItem index={index} {...imgItem} />}
            </div>
          </>)}
        </div>
        {!readOnly &&
          <div className='text-center'>
            <input
              disabled={uploading}
              type="file"
              className="inline-flex items-center justify-center border rounded-md bg-primary px-4 py-4 text-center font-medium text-white hover:bg-opacity-90 "
              accept="image/*"
              multiple={false}
              onChange={async (e) => {
                const files = e.target.files
                if (files) {
                  setUploading(true)
                  uploadMultiToS3AliAbi(files, uploadFolder, ImageResizeFitType.cover, token, 'tours, silk road, asia, fitifitifitif fitifit')
                    .then(result => {
                      if (!images) images = []
                      images.push(result)
                      saveImages(images)
                      console.log('uploadToS3AliAbi result:', result)
                    })
                    .catch((err) => console.log('uploadToS3AliAbi err:', err))
                    .finally(() => {
                      setUploading(false)
                    })
                }
              }}
            />

          </div>
        }
      </div>
    </>
  )
}

export default ImageListWidget