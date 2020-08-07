export class Booking{
    id: number;
    startTime: Date| string;
    endTime: Date | string;
    confirmationCode: string ;
    totalCost: number;
    createdOn: Date| string;
    vehicleId:number;
    vehicle: any|string;
}