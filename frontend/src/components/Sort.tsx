type Props = {
  selectedSort: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const sortArr = [
  { label: "Star Rating", value: "starRating" },
  {
    label: "Price Per Night (Low To High)",
    value: "pricePerNightAsc",
  },
  {
    label: "Price Per Night (High To Low)",
    value: "pricePerNightDesc",
  },
];
const Sort = ({ onChange, selectedSort }: Props) => {
  return (
    <div>
      <label className="flex items-center space-x-2 cursor-pointer">
        <select
          className="rounded-md w-full border border-slate-200 p-2 focus:outline-none"
          onChange={onChange}
          value={selectedSort}
        >
          <option value="">Sort By</option>
          {sortArr.map((sort, index) => (
            <option key={index} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Sort;
