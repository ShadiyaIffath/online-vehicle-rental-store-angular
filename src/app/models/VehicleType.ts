export class VehicleType{
    id:number;
    type:string;
    pricePerday:number;
    passengers: number;

    public constructor(init?: Partial<VehicleType>) {
        Object.assign(this, init);
    }
}