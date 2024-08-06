import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import Button from "@/components/UI/Button";

export default function Pagination({
  totalRecords = null,
  pageLimit = 10,
  moveBack = 0,
  onPageChange = null,
}: any) {
  const pageCount = Math.ceil(totalRecords / pageLimit) || 1;

  return (
    <div className="pagination">
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <Button
            iconRight="true"
            icon="/images/icon/next.svg"
            aria-hidden="true"
          >
            <span className="hidden sm:block">Next</span>
          </Button>
        }
        onPageChange={onPageChange}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        forcePage={moveBack ? 0 : undefined}
        pageCount={pageCount}
        previousClassName="sm:absolute sm:left-8"
        nextClassName="sm:absolute sm:right-8"
        previousLabel={
          <Button icon="/images/icon/prev.svg" aria-hidden="true">
            <span className="hidden sm:block">Prev</span>
          </Button>
        }
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
