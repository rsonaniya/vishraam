export type Props = {
  page: number;
  pages: number;
  onPagechange: (page: number) => void;
};

const Pagination = ({ onPagechange, page, pages }: Props) => {
  const pageNumber = [];
  for (let i = 1; i <= pages; i++) {
    pageNumber.push(i);
  }

  if (pages <= 1) return null;
  return (
    <div className="flex justify-center">
      <ul className="flex border border-slate-300 ">
        {pageNumber.map((num) => (
          <li
            key={num}
            className={`px-2 py-1 ${page === num ? "bg-gray-200" : ""}`}
          >
            <button
              className="cursor-pointer"
              onClick={() => onPagechange(num)}
            >
              {num}
            </button>{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
