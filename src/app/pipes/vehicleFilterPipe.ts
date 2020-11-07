import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from 'app/models/Vehicle';

@Pipe({
    name: 'filterVehicle'
})
export class FilterVehiclePipe implements PipeTransform {
    transform(vehicles: Vehicle[], searchText: string): any[] {
        if (!vehicles || !searchText) {return vehicles};
        return vehicles.filter(vehicle => {
            return vehicle.model.toLowerCase().includes(searchText.toLocaleLowerCase());
        });
    }
}