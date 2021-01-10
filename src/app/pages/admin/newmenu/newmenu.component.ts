import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-newmenu',
  templateUrl: './newmenu.component.html',
  styleUrls: ['./newmenu.component.css']
})
export class NewmenuComponent implements OnInit {

  submitted = false;
  menuForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder, 
    private adminService: AdminService,
    private router: Router) {
       
      this.menuForm = this.formBuilder.group({
        label: ['', Validators.required],
        priceDF: ['', Validators.required],
        description: ['', Validators.required],
        mealsId: this.formBuilder.array([]),
        availableForWeeks: this.formBuilder.array([])  
      })
    }

  ngOnInit(): void {
  }

      // créer une méthode qui retourne  ingredientsId et availableForWeeks
      getMealsId(): FormArray {
        return this.menuForm.get('mealsId') as FormArray;
      }
      getAvailableForWeeks(): FormArray {
        return this.menuForm.get('availableForWeeks') as FormArray;
      }
    
      //créer la méthode qui permet d'ajouter un  FormControl  à ingredientsId et à availableForWeeks
      onAddMealsId() {
        const newmealsId = this.formBuilder.control(null, Validators.required);
        this.getMealsId().push(newmealsId);
      }
      onAddAvailableForWeeks() {
        const newavailableForWeeks = this.formBuilder.control(null, Validators.required);
        this.getAvailableForWeeks().push(newavailableForWeeks);
      }

      onSubmit(){
        if (this.menuForm.valid) {
          this.adminService.saveMenus(this.menuForm.value).subscribe(
            (data) => {
              this.router.navigate([`/admin/menus`]);
            },
            (error) => {
              if (error.status === 400) {
                console.log("Votre menu n'est pas valide");
              }
              if (error.status === 401) {
                console.log("Vous n'êtes pas connecté ou n'avez pas le droit");
              }
            }
          );
        }
      }

}
