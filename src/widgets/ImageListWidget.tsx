
import FormCard from '@/components/FormCard'
import { v4 } from 'uuid'
import { useLanguage } from '@/hooks/i18n'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { uploadToS3Bucket } from '@/lib/s3bucketHepler'
import { ShowError, ShowMessage } from '@/widgets/Alerts'

export interface ImageItemProps {
  _id?: string
  title?: string
  src: string
  width?: number
  height?: number
  alt?: string
  thumbnail?: string
  style?: string
  index: number
}
export const ImageListWidget = ({ images, saveImages, uploadFolder, title, id = v4(), readOnly = false }: { images: ImageItemProps[], saveImages: any, uploadFolder: string, title?: string, id?: string, readOnly?: boolean }) => {
  const { t } = useLanguage()
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

  const ImageItem: React.FC<ImageItemProps> = ({ _id, src, width, height, title, alt, thumbnail, style, index = 0 }) => {

    return (<>
      <div key={index} className='relative flex items-start'>
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
          {src && <>
            <Image className='aspect-square rounded-lg' src={src} alt={alt || ''} title={title || ''} width={width} height={height} />
          </>}
          {!src && <>
            <div className='bg-slate-500 h-24 w-24 flex justify-center items-center'>
              <span>QWERTY Boş SRC</span>
            </div>
          </>}
        </div>
      </div>
    </>)
  }

  const handleUpload = (files: FileList) => {
    if (files.length == 0) return
    if (!images) {
      images = []
    }
    var i = 0
    const calistir = () => new Promise<void>((resolve, reject) => {
      if (i >= files.length) {
        resolve()
      } else {
        const file = files.item(i)!
        const folder = `${uploadFolder}/${file.name}`.replace(/\/\//g, '/')

        uploadToS3Bucket(file, folder)
          .then(fileUrl => {
            images.push({
              title: file.name,
              alt: file.name,
              src: fileUrl,
              thumbnail: fileUrl,
              width: 500,
              height: 500,
              index: images.length
            })
            i++
            setTimeout(() => calistir().then(resolve).catch(reject), 50)
          })
          .catch(reject)
      }
    })

    setUploading(true)
    calistir()
      .then(() => {
        saveImages(images)
        setUploading(false)
      })
      .catch((err) => {
        setUploading(false)
        ShowError(err)
      })
  }

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [t, images])


  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className='grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' >
          {(images || []).map((imgItem: ImageItemProps, index: number) => <>
            <div key={'image-' + v4()}
              className={`w-full max-w-screen-2xl mt-3 rounded-[4px] p-4 bg-opacity-5 ${index % 2 == 0 ? 'bg-slate-600' : 'bg-amber-600'} `}>
              {imgItem.src && <>
                <ImageItem {...imgItem} index={index} />
              </>}
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
              multiple={true}
              onChange={async (e) => {
                const files = e.target.files
                if (files) {
                  handleUpload(files)
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