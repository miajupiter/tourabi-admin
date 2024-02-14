import ECommerce from "@/components/Dashboard/E-commerce"
import { Metadata } from "next"
import Head from 'next/head'
// import DefaultLayout from "@/app/(panel)/layout";

// export const metadata: Metadata = {
//   title: "Dashboard | TourAbi - Admin Panel",
//   description:
//     "This is  Dashboard page for TourAbi Admin Panel",
// };

const DashboardPage = () => {
  return (
    <>
      <Head>
        <title content='Dashboard | TourAbi - Admin Panel' />
        <meta name='description' content='This is  Dashboard page for TourAbi Admin Panel' />
      </Head>
      <ECommerce />
    </>
  )
}

export default DashboardPage
