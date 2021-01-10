import { Component, OnInit, OnDestroy } from '@angular/core';
import { MealOUT } from '../../shared/interfaces/meal';
import { AdminService } from '../../shared/services/admin.service';
import { IngredientOUT } from '../../shared/interfaces/ingredient';
import { UserOUT } from '../../shared/interfaces/user';
import { User } from '../../shared/interfaces/user';
import { ImageOUT } from '../../shared/interfaces/image';

import { API_URL } from '../../shared/constants/api-url';
import { MealService } from 'src/app/shared/services/meal.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  meals: Array<MealOUT>;
  images: Array<ImageOUT>;
  ingredients: Array<IngredientOUT>;
  users: Array<UserOUT>
  meal: any;
  router: any;

  constructor(private adminService: AdminService,private mealService: MealService) {
   }

  ngOnInit(): void {
    this.list();
  }

  list(): void{
    this.adminService.list()
    .subscribe((data: Array<MealOUT>) => {
      this.meals = data; 
      this.meals.forEach((meal) => {
        this.mealService.getMealImage(meal.id).subscribe(
            (image) => {
              meal.imgUrl = `${API_URL}/`+image.imagePath;
            },
            (error) => {
              console.log(error);
            }
         );
      });
    })
  }

  listIng(): void{
    this.adminService.listIng()
    .subscribe((data: Array<IngredientOUT>) => {
      console.log(data)
      this.ingredients = data; 
    })
  }

  listUser(): void{
    this.adminService.listUser()
    .subscribe((data: Array<UserOUT>) => {
      console.log(data)
      this.users = data; 
    })
  }

  onDelete(id:number){
    this.adminService.delete(id).then(()=>{
      this.meals = this.meals.filter(meal=>meal.id!=id);
    })
  }
}
