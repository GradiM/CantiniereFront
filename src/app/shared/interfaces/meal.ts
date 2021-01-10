import { ImageIN } from './image';
import { IngredientOUT } from './ingredient';

export interface MealOUT {
    id: number;
    description: string;
    label: string;
    priceDF: number;
    status: number;
    imageId: number;
    availableForWeeks: number[];
    category: number;
    ingredients: IngredientOUT[];
    imgUrl: string;
}

export interface MealIN {
    description?: string;
    label: string;
    image?: ImageIN;
    priceDF: number;
    availableForWeeks?: number[];
    ingredientsId?: number[];
    category: number;
}
