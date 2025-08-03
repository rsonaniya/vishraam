import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Guests</h2>
      <div className="flex flex-col md:flex-row gap-5 p-6 bg-gray-200">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Adults
          <input
            type="number"
            className="border rounded w-full py-1 px-2 font-normal bg-white"
            {...register("adultCount", {
              required: "Number of Adults is required",
            })}
            placeholder="Enter Number Of Adults..."
            min={1}
          />
          {errors.adultCount && (
            <span className="text-red-500">{errors.adultCount.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Children
          <input
            type="number"
            className="border rounded w-full py-1 px-2 font-normal bg-white"
            {...register("childCount")}
            placeholder="Enter Number Of Children..."
            min={0}
          />
          {errors.childCount && (
            <span className="text-red-500">{errors.childCount.message}</span>
          )}
        </label>
      </div>
    </div>
  );
};

export default GuestsSection;
