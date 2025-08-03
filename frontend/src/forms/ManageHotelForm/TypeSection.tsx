import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import type { HotelFormData } from "./ManageHotelForm";

const TypeSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Type</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {hotelTypes.map((type) => (
          <label
            key={type}
            className={`${
              watch("type") === type ? "bg-blue-300" : "bg-gray-200"
            } px-4 py-2 font-semibold rounded-full flex items-center text-sm cursor-pointer`}
          >
            <input
              type="radio"
              value={type}
              {...register("type", {
                required: "Hotel type is required",
              })}
              className="hidden"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500 font-bold">{errors.type.message}</span>
      )}
    </div>
  );
};

export default TypeSection;
