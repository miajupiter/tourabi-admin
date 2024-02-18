// import { Package } from "@/types/package";

const tourData = [
  {
    name: "Free package",
    price: 0.0,
    invoiceDate: `Jan 13,2023`,
    status: "Paid",
  },
  {
    name: "Standard Package",
    price: 59.0,
    invoiceDate: `Jan 13,2023`,
    status: "Paid",
  },
  {
    name: "Business Package",
    price: 99.0,
    invoiceDate: `Jan 13,2023`,
    status: "Unpaid",
  },
  {
    name: "Standard Package",
    price: 59.0,
    invoiceDate: `Jan 13,2023`,
    status: "Pending",
  },
];

const TableThree = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-2 py-2 font-medium text-black dark:text-white xl:pl-7">
                Title
              </th>
              <th className="min-w-[150px] px-2 py-2 font-medium text-black dark:text-white">
                Duration
              </th>
              <th className="min-w-[120px] px-2 py-2 font-medium text-black dark:text-white">
                Places
              </th>
              <th className="w-[100px] px-2 py-2 font-medium text-black dark:text-white text-center">
                #
              </th>
            </tr>
          </thead>
          <tbody>
            {tourData.map((item, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-2 py-2 pl-6 dark:border-strokedark xl:pl-7">
                  <h5 className="font-medium text-black dark:text-white">
                    {item.name}
                  </h5>
                  <p className="text-sm">${item.price}</p>
                </td>
                <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.invoiceDate}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                      item.status === "Paid"
                        ? "bg-success text-success"
                        : item.status === "Unpaid"
                          ? "bg-danger text-danger"
                          : "bg-warning text-warning"
                    }`}
                  >
                    {item.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                  <div className="flex justify-center items-center space-x-3.5">
                    <button className="hover:text-primary">
                      <i className="fa-regular fa-eye"></i>
                    </button>
                    <button className="hover:text-primary">
                    <i className="fa-regular fa-trash-can"></i>
                    </button>
                    <button className="hover:text-primary">
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
