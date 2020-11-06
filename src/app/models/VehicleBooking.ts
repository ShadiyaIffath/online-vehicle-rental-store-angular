export class VehicleBooking{
    id: number;
    startTime: Date| string;
    endTime: Date | string;
    confirmationCode: string ;
    totalCost: number;
    createdOn: Date| string;
    status:string;
    vehicleId:number;
    accountId:number;
    late: boolean;
    account : any;
    vehicle: any|string;
}