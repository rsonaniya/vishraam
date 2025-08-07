import { hotelFacilities } from "../config/hotel-facilities-config";

type Props = {
  selectedFacilities: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const FacilitiesFilter = ({ onChange, selectedFacilities }: Props) => {
  return (
    <div className="border-b border-slate-500 pb-5">
      <h4 className="text-md font-semibold mb-2">Facilities</h4>
      {hotelFacilities.map((hotelFacilitie) => (
        <label
          key={hotelFacilitie}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            className="rounded"
            value={hotelFacilitie}
            checked={selectedFacilities.includes(hotelFacilitie)}
            onChange={onChange}
          />
          <span>{hotelFacilitie}</span>
        </label>
      ))}
    </div>
  );
};

export default FacilitiesFilter;
