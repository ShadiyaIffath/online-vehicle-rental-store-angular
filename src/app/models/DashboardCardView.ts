import { User } from './User';
import { VehicleBooking } from './VehicleBooking';

export class DashboardCardView{
    totalVehicles: number;
    vehicleBookings: number;
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
    vehicleBooking: VehicleBooking[];
}