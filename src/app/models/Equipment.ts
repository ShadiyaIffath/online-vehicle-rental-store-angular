import { EquipmentCategory } from './EquipmentCategory';

export class Equipment{
    id: number;
    name: string;
    purchasedPrice: number;
    dayAdded:string|Date;
    category: EquipmentCategory;
    categoryId: number;
    features: string;
}