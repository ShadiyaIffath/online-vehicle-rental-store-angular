import { User } from './User';
import { VehicleBooking } from './VehicleBooking';

export class DashboardCardView{
    totalVehicles: number;
    bookings: number;
    completedBookins: number;
    cancelledBookings: number;
    collectedBookings: number;
    confirmedBookings: number;
    smallTownCar: number;
    hatchback: number;
    saloon: number;
    estate: number;
    vans: number;
    accounts: User[];
    vehicleBookings: VehicleBooking[];
}