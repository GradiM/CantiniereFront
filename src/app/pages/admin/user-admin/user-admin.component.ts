import { Route } from '@angular/compiler/src/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from '../../../shared/services/admin.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/interfaces/user';


@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {

  user: any;
  paramId: Params;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private userService: UserService) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.paramId = params['id'];
        this.get(+this.paramId)
      })
      
  }

  get(id: number): void {
    this.userService.user(id)
    .subscribe((data: any) => {
      this.user = data;
    })
  }

  onClick(): void {
    this.userService.update(this.user.id, this.user)
    .subscribe((data)=> {console.log(data)
      this.router.navigate(['/admin/users']);
    });
    
  }


}
