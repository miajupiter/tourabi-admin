import Calendar from "@/widgets/Calender"
import { Metadata } from "next"
// import DefaultLayout from "@/app/(panel)/layout";

export const metadata: Metadata = {
  title: "Calender | TourAbi - Admin Panel",
  description:
    "This is Calender page for TourAbi Admin Panel",
}

const CalendarPage = () => {
  return (
    <>
      <title>Calender | TourAbi - Admin Panel</title>
      <meta name="description" content="This is Calender page for TourAbi Admin Panel" />
      <Calendar />
    </>

  )
}

export default CalendarPage
