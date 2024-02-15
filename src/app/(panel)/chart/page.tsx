import Chart from "@/widgets/Charts/page";
import { Metadata } from "next";
// import DefaultLayout from "@/app/(panel)/layout";
import React from "react";

export const metadata: Metadata = {
  title: "Chart | TourAbi - Admin Panel",
  description:
    "This is Chart page for TourAbi Admin Panel",
};

const BasicChartPage: React.FC = () => {
  return (
    // <DefaultLayout>
      <Chart />
    // </DefaultLayout>
  );
};

export default BasicChartPage;
