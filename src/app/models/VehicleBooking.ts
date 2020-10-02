export class Booking{
    id: number;
    startTime: Date| string;
    endTime: Date | string;
    confirmationCode: string ;
    totalCost: number;
    createdOn: Date| string;
    status:string;
    vehicleId:number;
    accountId:number;
    vehicle: any|string;
}