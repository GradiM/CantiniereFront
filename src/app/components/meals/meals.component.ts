import { Component, OnInit } from '@angular/core';

import { API_URL } from '../../shared/constants/api-url';
import { MealService } from '../../shared/services/meal.service';
import { OrderService } from '../../shared/services/order.service';
import { AuthService } from '../../shared/auth/auth.service';

import { MealOUT } from '../../shared/interfaces/meal';
import { ImageOUT } from '../../shared/interfaces/image';
import { QuantityIN, QuantityOUT } from '../../shared/interfaces/quantity';
import { User /*UserOUT*/} from '../../shared/interfaces/user';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {

  meals!: MealOUT[];
  mealsImages: ImageOUT[] = [];
  loading!: boolean;

  constructor(
    private mealService: MealService,
    private orderService: OrderService,
    public authService: AuthService) {}

  ngOnInit(): void {
    this.loading = true;
    this.getMealsForThisWeek();
  }

  getMealsForThisWeek(): void {
    this.mealService.getMealsForThisWeek().subscribe(
      (meals) => {
        this.meals = meals;
        this.loading = false;
        this.meals.forEach((meal) => {
          //this.mealService.getMealImage(meal.imageId)
          this.mealService.getMealImage(meal.id).subscribe(
            (image) => {
              //this.mealsImages.push(image);
              meal.imgUrl = `${API_URL}/${image.imagePath}`;
            },
            (error) => {
              console.log(error);
            }
          );
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  orderMaker(mealId: number): void {
    if (confirm('Etes-vous sûr de vouloir ajouter ce plat au panier ?')) {

      this.loading = true;
      const user: User = this.authService.userLogged();
      if (user) {
        this.orderService.orderMaker(user.id, 'meal', mealId);
      }

    }
  }

}
