import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from '../../../shared/services/admin.service';
import { IngredientOUT } from '../../../shared/interfaces/ingredient';
import { IngredientService } from '../../../shared/services/ingredient.service';
import { MealOUT } from '../../../shared/interfaces/meal';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css']
})

export class IngredientComponent implements OnInit {
  ingredient: any;
  paramId: Params;
  ingredients: Array<IngredientOUT>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingredientService: IngredientService,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.listIng();
  }

  listIng(): void{
    this.adminService.listIng()
    .subscribe((data: Array<IngredientOUT>) => {
      console.log(data)
      this.ingredients = data; 
    })
  }

}

