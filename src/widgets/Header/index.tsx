import Link from "next/link"
import DarkModeSwitcher from "../../components/others/DarkModeSwitcher"
import DropdownMessage from "./DropdownMessage"
import DropdownNotification from "./DropdownNotification"
import DropdownUser from "./DropdownUser"
import Image from "next/image"

// const Header = ({...props}) => {
const Header = (props: {
  sidebarOpen: string | boolean | undefined
  setSidebarOpen: (arg0: boolean) => void
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full drop-shadow-1 bg-slate-100 dark:bg-[#0b1121] dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation()
              props.setSidebarOpen(!props.sidebarOpen)
            }}
            className="z-99999 block rounded-sm border px-2  border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark da11rk:bg-box11dark lg:hidden"
          >
            <i className="fa-solid fa-bars text-2xl"></i>
          </button>

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image src={"/img/web-icon.png"} alt="Logo" width={32} height={32} />
          </Link>
        </div>

        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>

              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <div className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
          </div>

          <DropdownUser />
        </div>
      </div>
    </header>
  )
}

export default Header
