import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from 'app/models/Vehicle';


@Pipe({
    name: 'filterVehicleType'
})
export class FilterVehicleTypePipe implements PipeTransform {
    transform(vehicles: Vehicle[], searchText: string): any[] {
        if (!vehicles || !searchText) {return vehicles};
        return vehicles.filter(vehicle => {
            return vehicle.type.id.includes(searchText);
        });
    }
}