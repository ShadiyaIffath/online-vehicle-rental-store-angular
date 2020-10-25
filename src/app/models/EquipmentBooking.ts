export class EquipmentBooking{
    id: number;
    startTime: Date| string;
    endTime: Date | string;
    createdOn: Date| string;
    status:string;
    equipmentId:number;
    vehicleBookingId:number;
    vehicleBooking: any | string;
    equipment: any|string;
}