import Link from "next/link"
interface PageHeaderProps {
  pageTitle: string
  breadcrumbList: any[],
 
}
const PageHeader = ({
  pageTitle,
  breadcrumbList = [{
    href: '/',
    pageTitle: 'DashBoard'
  }]
}: PageHeaderProps) => {
  // const {} = usePathname()
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageTitle}
      </h2>
      <nav>
        <ul className="flex items-center gap-2">
          {breadcrumbList && breadcrumbList.map((e: any, index: number) => (
            <li key={index}>
              {index == breadcrumbList.length - 1 && <>
                <span className="font-medium text-secondary">{e.pageTitle}</span>
              </>}
              {index < breadcrumbList.length - 1 &&
                <Link className="font-medium hover:text-primary" href={e.href}>
                  {e.pageTitle} /
                </Link>
              }
            </li>
          ))}
        </ul>
      </nav>

    </div >
  )
}

export default PageHeader
