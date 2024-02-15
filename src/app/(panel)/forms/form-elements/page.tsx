import React from "react";
import FormElements from "@/widgets/FormElements";
import { Metadata } from "next";
// import DefaultLayout from "@/app/(panel)/layout";

export const metadata: Metadata = {
  title: "Form Elements | TourAbi - Admin Panel",
  description:
    "This is Form Elements page for TourAbi Admin Panel",
};

const FormElementsPage = () => {
  return (
    // <DefaultLayout>
      <FormElements />
    // </DefaultLayout>
  );
};

export default FormElementsPage;
