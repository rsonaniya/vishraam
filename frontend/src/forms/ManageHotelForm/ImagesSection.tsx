import { BiTrash } from "react-icons/bi";
import type { HotelFormData } from "./ManageHotelForm";
import { useFormContext } from "react-hook-form";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  const existingImageUrls = watch("imageUrls");

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} className="min-h-full object-cover" />
                <button
                  onClick={(e) => handleDelete(e, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 text-white "
                >
                  <BiTrash className="text-white cursor-pointer" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          className="w-full text-gray-700 font-normal"
          multiple
          accept="image/*"
          {...register("imageFiles", {
            validate: (files: FileList) => {
              const totalLength = files.length + existingImageUrls?.length || 0;
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
