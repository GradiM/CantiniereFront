import { Component, OnInit } from '@angular/core';
import { MenuOUT } from '../../../shared/interfaces/menu';
import { MenuService } from '../../../shared/services/menu.service';

import { API_URL } from '../../../shared/constants/api-url';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {
  menus: Array<MenuOUT>;
  menu: any;

  constructor(private menuService: MenuService,private adminService: AdminService) { }

  ngOnInit(): void {
    this.listMenu();
  }

  listMenu(): void{
    this.menuService.listMenu()
    .subscribe((data: Array<MenuOUT>) => {
      this.menus = data; 
      this.menus.forEach((menu) => {
        this.menuService.getMenuImage(menu.id).subscribe(
            (image) => {
              menu.imgUrl = `${API_URL}/`+image.imagePath;
            },
            (error) => {
              console.log(error);
            }
         );
      });
    })
  }

  onDelete(id:number){
    this.adminService.deleteMenu(id).then(()=>{
      this.menus = this.menus.filter(menu=>menu.id!=id);
    })
  }
  
}
