type Props = {
  selectedMaxPrice?: number;
  onChange: (value?: number) => void;
};

const priceArr = [500, 1000, 2000, 5000, 10000, 20000, 50000];
const MaxPriceFilter = ({ onChange, selectedMaxPrice }: Props) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>

      <label className="flex items-center space-x-2 cursor-pointer">
        <select
          className="rounded-md w-full border border-slate-300 p-2 focus:outline-none"
          onChange={(e) =>
            onChange(e.target.value ? parseInt(e.target.value) : undefined)
          }
          value={selectedMaxPrice}
        >
          <option value="">Select Max Price</option>
          {priceArr.map((price) => (
            <option key={price} value={price}>
              ₹ {price}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default MaxPriceFilter;
