import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import Loader from "../components/Loader";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const Detail = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();

  const { data: hotel, isLoading } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
      onError: (error: Error) => {
        showToast({
          message: error.message,
          type: "ERROR",
        });
      },
    }
  );
  if (!hotel) return <></>;
  return (
    <>
      <div className="space-y-6">
        <div className="">
          <span className="flex">
            {Array.from({ length: hotel?.starRating ?? 0 }).map(
              (_curr, index) => (
                <span key={index}>
                  {<AiFillStar className="fill-yellow-400" />}
                </span>
              )
            )}
          </span>
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {hotel.imageUrls.map((image, index) => (
            <div className="h-[300px]" key={index}>
              <img
                src={image}
                alt={`${hotel?.name + index}`}
                className="rounded-md w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {hotel.facilities.map((facility, index) => (
            <div key={index} className="border border-slate-300 rounded-sm p-3">
              {facility}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <div className="whitespace-pre-line">{hotel.description}</div>
          <div className="h-fit">
            <GuestInfoForm
              pricePerNight={hotel.pricePerNight}
              hotelId={hotel._id}
            />
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
};

export default Detail;
