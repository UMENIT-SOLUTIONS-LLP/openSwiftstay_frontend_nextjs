import classNames from "classnames";
import Link from "next/link";
import { ParsedUrlQueryInput } from "querystring";

interface BreadcrumbProps {
  pages?: Array<{
    name: string;
    url: string;
    active?: boolean;
    query?: ParsedUrlQueryInput;
  }>;
}
const Breadcrumb = ({ pages = [] }: BreadcrumbProps) => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav>
          <ol className="flex items-center gap-2 text-sm">
            {pages.map((val: any, index: number) => {
              const { active, name, url, query } = val;
              const Component = url !== null ? Link : "span";
              return (
                <li key={index}>
                  <Component href={{ pathname: url, query }}>
                    <span
                      className={classNames({
                        "text-black-2": active,
                      })}
                    >
                      {name} {index !== pages.length - 1 && " > "}
                    </span>
                  </Component>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
      <hr className="my-6 w-full text-bordercolor" />
    </>
  );
};

export default Breadcrumb;
