import type { HotelType } from "../../../backend/src/shared/types";
type Props = {
  hotel: HotelType;
  numberOfNights: number;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
};

const BookingDetailsSummary = ({
  hotel,
  numberOfNights,
  adultCount,
  checkIn,
  checkOut,
  childCount,
}: Props) => {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div className="border-b border-slate-300 py-2">
        Location:
        <div className="text-sm font-bold">{`${hotel.name},${hotel?.city}, ${hotel.country}`}</div>
      </div>
      <div className="border-b border-slate-300 flex items-center justify-between">
        <div className="py-2">
          Check-in:
          <div className="text-sm font-bold">{checkIn.toDateString()}</div>
        </div>
        <div className="py-2">
          Check-out:
          <div className="text-sm font-bold">{checkOut.toDateString()}</div>
        </div>
      </div>
      <div className="border-b border-slate-300 py-2">
        Total Length of stay:
        <div className="text-sm font-bold">
          {numberOfNights}
          {numberOfNights > 1 ? " nights" : " night"}
        </div>
      </div>

      <div className="py-2">
        Guests:
        <div className="text-sm font-bold">
          {adultCount} adults & {childCount} children
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsSummary;
