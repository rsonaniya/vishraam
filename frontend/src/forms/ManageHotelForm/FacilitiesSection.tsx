import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";
import { hotelFacilities } from "../../config/hotel-facilities-config";

const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {hotelFacilities.map((facility) => (
          <label
            key={facility}
            className="text-sm flex  gap-1 text-gray-700 items-center"
          >
            <input
              type="checkbox"
              value={facility}
              {...register("facilities", {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) return true;
                  else return "At least one facility is required";
                },
              })}
            />
            <span>{facility}</span>
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-red-500 font-bold">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default FacilitiesSection;
