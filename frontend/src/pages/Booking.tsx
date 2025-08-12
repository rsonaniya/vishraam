import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import BookingForm from "../forms/BookingForm/BookingForm";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { useParams } from "react-router-dom";
import { useSearchContext } from "../contexts/SearchContext";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";

const Booking = () => {
  const { showToast, stripePromise } = useAppContext();
  const search = useSearchContext();

  const { hotelId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser,
    {
      onError: (error: Error) => {
        showToast({
          message: error.message,
          type: "ERROR",
        });
      },
    }
  );
  const { data: hotel } = useQuery(
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

  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(
        hotelId as string,
        numberOfNights.toString()
      ),
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  );

  useEffect(() => {
    const differenceInDays = (d1: Date, d2: Date) => {
      const start = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
      const end = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
      return Math.abs(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
    };
    if (search.checkIn && search.checkOut) {
      const nights = differenceInDays(search.checkOut, search.checkIn);
      setNumberOfNights(nights);
    }
  }, [search.checkIn, search.checkOut]);

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-3">
      {hotel && (
        <BookingDetailsSummary
          hotel={hotel}
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          adultCount={search.adultCount}
          childCount={search.childCount}
          numberOfNights={numberOfNights}
        />
      )}
      {currentUser && paymentIntentData && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: paymentIntentData.clientSecret }}
        >
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
