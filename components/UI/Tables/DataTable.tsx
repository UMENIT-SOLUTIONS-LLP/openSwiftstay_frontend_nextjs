import Pagination from "../Pagination";
import Button from "@/components/UI/Button";
import Image from "next/image";
import Link from "next/link";

const DataRender = ({ item, column }: any) => {
  if (column?.render) {
    return column?.render(item);
  }

  return item?.[column?.key] || "";
};

const DataTable = ({
  columns = [],
  data = [],
  totalRecords = 0,
  onPageChange,
  title = false,
  idName = "",
  moveBack = 0,
  onSearch,
}: any) => {
  return (
    <div className="">
      <div className="max-w-full overflow-x-auto rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left dark:bg-meta-4">
              {columns
                ?.filter((column: any) => column)
                ?.map((column: any, index: number) => (
                  <th
                    key={index}
                    className="py-4 px-4 text-sm border-b border-[#eee]"
                  >
                    {column?.title}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data?.length === 0 && (
              <tr>
                <td
                  colSpan={columns?.length}
                  className="py-4 px-4 text-black border border-[#eee] text-center"
                >
                  No data found
                </td>
              </tr>
            )}
            {data?.map((item: any, index: number) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-bodybackground hover:bg-gray"
                    : "bg-white hover:bg-gray"
                }`}
              >
                {columns
                  ?.filter((column: any) => column)
                  ?.map((column: any, index: number) => (
                    <td
                      key={index}
                      className="py-4 px-4 border-b border-[#eee] truncate"
                    >
                      {title && column?.key != "action" ? (
                        <Link
                          className="font-medium"
                          href={`/${title}/${
                            idName ? item[idName]._id : item._id
                          }`}
                        >
                          <DataRender key={index} item={item} column={column} />
                        </Link>
                      ) : (
                        <DataRender key={index} item={item} column={column} />
                      )}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>

        {totalRecords > 0 && (
          <Pagination
            totalRecords={totalRecords}
            onPageChange={(e: any) => {
              if (onPageChange) {
                onPageChange(e.selected + 1);
              }
            }}
            moveBack={moveBack}
          />
        )}
      </div>
    </div>
  );
};

export default DataTable;
