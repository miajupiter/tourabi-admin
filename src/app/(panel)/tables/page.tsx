import Breadcrumb from "@/widgets/Breadcrumbs/Breadcrumb"
import TableOne from "@/widgets/Tables/TableOne"
import TableThree from "@/widgets/Tables/TableThree"
import TableTwo from "@/widgets/Tables/TableTwo"

import { Metadata } from "next"
// import DefaultLayout from "@/app/(panel)/layout";

export const metadata: Metadata = {
  title: "Tables | TourAbi - Admin Panel",
  description:
    "This is Tables page for TourAbi Admin Panel",
}

const TablesPage = () => {
  return (
    // <DefaultLayout>
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </>
    // </DefaultLayout>
  )
}

export default TablesPage
