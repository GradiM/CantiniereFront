import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from '../../../shared/services/admin.service';
import { IngredientOUT } from '../../../shared/interfaces/ingredient';
import { MealService } from '../../../shared/services/meal.service';
import { MealOUT } from '../../../shared/interfaces/meal';
import { User } from '../../../shared/interfaces/user';


@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css']
})
export class ManageAdminComponent implements OnInit {
  
  meal: any;
  paramId: Params;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.paramId = params['id'];
        this.get(+this.paramId)
      })
      
  }

  get(id: number): void {
    this.adminService.getMeal(id)
    .subscribe((data: any) => {
      this.meal = data;
    })
  }

  onClick(): void {
    this.adminService.updateMeal(this.meal.id, this.meal)
    .subscribe((data)=> {
      this.router.navigate(['/admin/meals']);
    });
    
  }

}
