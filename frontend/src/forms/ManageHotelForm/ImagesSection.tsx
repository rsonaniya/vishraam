import type { HotelFormData } from "./ManageHotelForm";
import { useFormContext } from "react-hook-form";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        <input
          type="file"
          className="w-full text-gray-700 font-normal"
          multiple
          accept="image/*"
          {...register("imageFiles", {
            validate: (files: FileList) => {
              const totalLength = files.length;
              if (totalLength < 1 || totalLength > 6) {
                return "Number of images should be between 1-6";
              }

              const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

              for (const file of files) {
                if (file.size > maxSizeInBytes) {
                  return `${file.name} is larger than 5MB`;
                }
              }

              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;
