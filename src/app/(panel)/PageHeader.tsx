import Link from "next/link"
interface PageHeaderProps {
  pageTitle: string
  breadcrumbList: any[],
  onSave?: any
  onCancel?: any
}
const PageHeader = ({
  pageTitle,
  breadcrumbList = [{
    href: '/',
    pageTitle: 'DashBoard'
  }],
  onSave,
  onCancel
}: PageHeaderProps) => {
  // const {} = usePathname()
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <div >
        <nav>
          <ol className="flex items-center gap-2">
            {breadcrumbList && breadcrumbList.map((e: any, index: number) => (
              <li>
                {index == breadcrumbList.length - 1 && <>
                  <span className="font-medium text-primary">{e.pageTitle}</span>
                </>}
                {index < breadcrumbList.length - 1 && <Link className="font-medium" href={e.href}>
                  {e.pageTitle} /
                </Link>}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageTitle}
      </h2>
      <div className='flex justify-end items-center gap-x-3'>
        <Link href="#"
          className="inline-flex items-center justify-center rounded-md border border-primary px-3 py-2 text-center "
          onClick={(e) => { alert('save button click') }}
        >
          <i className="fa-solid fa-check"></i>
        </Link>
        <Link href="#"
          className="inline-flex items-center justify-center rounded-md border border-secondary px-3 py-2 text-center "
          onClick={(e) => {
            if (breadcrumbList.length >= 2) {
              if (confirm('Do you want to cancel:')) {
                console.log(breadcrumbList[breadcrumbList.length - 2].href)
                // redirect(breadcrumbList[breadcrumbList.length - 2].href)
                setTimeout(()=>{
                  location.href= breadcrumbList[breadcrumbList.length - 2].href
                },100)
              }
            }
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </Link>
      </div>
    </div >
  )
}

export default PageHeader
