import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import TypeFilter from "../components/TypeFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import MaxPriceFilter from "../components/MaxPriceFilter";
import Loader from "../components/Loader";
import Sort from "../components/Sort";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<
    number | undefined
  >();
  const [selectedSort, setSelectedSort] = useState<string>("");

  const searchParams: apiClient.SearchParams = {
    destination: search.destination,
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedMaxPrice?.toString(),
    sortOptions: selectedSort,
  };

  const { showToast } = useAppContext();
  const { data: hotelData, isLoading } = useQuery(
    ["searchHotels", searchParams],
    () => apiClient.searchHotels(searchParams),
    {
      onError: (error: Error) => {
        showToast({
          message: error.message,
          type: "ERROR",
        });
      },
    }
  );

  const handleChangeStars = (e: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = e.target.value;

    // if (selectedStars.includes(starRating)) {
    //   setSelectedStars(
    //     selectedStars.filter((star: string) => star !== starRating)
    //   );
    // } else {
    //   setSelectedStars((prev) => [...prev, starRating]);
    // }
    setSelectedStars((prevStars) =>
      e.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hotelType = e.target.value;
    setSelectedHotelTypes((prevTypes) =>
      e.target.checked
        ? [...prevTypes, hotelType]
        : prevTypes.filter((type) => type !== hotelType)
    );
  };

  const facilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFacility = e.target.value;
    setSelectedFacilities((prevFacilities) =>
      e.target.checked
        ? [...prevFacilities, selectedFacility]
        : prevFacilities.filter((facility) => facility !== selectedFacility)
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
        <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
          <div className="space-y-5 ">
            <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
              Filter By:
            </h3>
            <StarRatingFilter
              onChange={handleChangeStars}
              selectedStars={selectedStars}
            />
            <TypeFilter
              onChange={handleTypeChange}
              selectedHotelTypes={selectedHotelTypes}
            />
            <FacilitiesFilter
              onChange={facilityChange}
              selectedFacilities={selectedFacilities}
            />

            <MaxPriceFilter
              selectedMaxPrice={selectedMaxPrice}
              onChange={(value?: number) => setSelectedMaxPrice(value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              {hotelData?.pagination.total} Hotels found
              {search.destination ? ` in ${search.destination}` : ""}
            </span>
            <Sort
              selectedSort={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            />
          </div>
          {hotelData?.data.map((hotel) => (
            <SearchResultCard key={hotel._id} hotel={hotel} />
          ))}
          <div className="">
            <Pagination
              page={hotelData?.pagination?.page || 1}
              pages={hotelData?.pagination.pages || 1}
              onPagechange={(page: number) => setPage(page)}
            />
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
};

export default Search;
