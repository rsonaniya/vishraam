import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({
        type: "SUCCESS",
        message: "Hotel Saved!",
      });
    },
    onError: (error: Error) => {
      showToast({
        type: "ERROR",
        message: error.message,
      });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };
  return <ManageHotelForm isLoading={isLoading} onSave={handleSave} />;
};

export default AddHotel;
