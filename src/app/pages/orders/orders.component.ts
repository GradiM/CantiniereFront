import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { API_URL } from '../../shared/constants/api-url';
import { AuthService } from '../../shared/auth/auth.service';
import { MealService } from '../../shared/services/meal.service';
import { MenuService } from '../../shared/services/menu.service';
import { OrderService } from '../../shared/services/order.service';

import { User /*UserOUT*/ } from '../../shared/interfaces/user';
import { OrderIN, OrderOUT, PriceOUT } from '../../shared/interfaces/order';
import { QuantityIN, QuantityOUT } from '../../shared/interfaces/quantity';
import { ImageOUT } from '../../shared/interfaces/image';
import { ConstraintService } from '../../shared/services/constraint.service';
import { ConstraintIN } from '../../shared/interfaces/constraint';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  allOrdersUrl: string;
  user: User /*UserOUT*/;
  orders: OrderOUT[];
  menusImages: ImageOUT[] = [];
  mealsImages: ImageOUT[] = [];
  totalsPrices: PriceOUT[] = [];
  maximumOrderPerDay: number;
  orderTimeLimit: string;
  loading: boolean;

  constructor(
    private auth: AuthService,
    private orderService: OrderService,
    private menuService: MenuService,
    private mealService: MealService,
    private constraintService: ConstraintService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loading = true;

    this.allOrdersUrl = this.route.snapshot.paramMap.get('all');

    if (localStorage.getItem('userChangedValues')) {
      this.user = JSON. parse(localStorage.getItem('userChangedValues'));
    }
    else {
      this.user = this.auth.userLogged();
    }

    if (this.user) {
      if (this.allOrdersUrl) {
        this.getAllOrdersOfUser(this.user.id);
      } else {
        this.getOngoingOrdersOfUser(this.user.id);
      }
    } else {
      console.log('VOUS DEVEZ ETRE CONNECTE');
    }
  }

  getOngoingOrdersOfUser(userId: number): void {
    this.orderService.getOngoingOrdersOfUser(userId).subscribe(
      (orders) => {
        this.orders = orders;

        this.orders.forEach((order) => {
          // this.imageMenu(order.quantity);
          // this.imageMeal(order.quantity);
        });

        if (this.orders[0]) {
          this.computePrice(this.orders[0].id, 2);
        }

        this.loading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllOrdersOfUser(userId: number): void {
    this.orderService.getAllOrdersOfUser(userId).subscribe(
      (orders) => {
        this.orders = orders;
        this.orders.forEach((order) => {
          // this.imageMenu(order.quantity);
          // this.imageMeal(order.quantity);
          this.computePrice(order.id, 2);
        });

        this.loading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  imageMenu(quantities: QuantityOUT[]): void {
    quantities.forEach((quantity) => {
      //this.menuService.getMenuImage(quantity.menu.imageId)
      this.menuService.getMenuImage(quantity.menu.id).subscribe(
        (image) => {
          //this.menusImages.push(image);
          quantity.menu.imgUrl = `${API_URL}/${image.imagePath}`;
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  imageMeal(quantities: QuantityOUT[]): void {
    quantities.forEach((quantity) => {
      //this.mealService.getMealImage(quantity.meal.imageId)
      this.mealService.getMealImage(quantity.meal.id).subscribe(
        (image) => {
          //this.mealsImages.push(image);
          quantity.meal.imgUrl = `${API_URL}/${image.imagePath}`;
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  computePrice(ongoingOrderId: number, constraintId: number): void {
    this.orderService.computePrice(ongoingOrderId, constraintId).subscribe(
      (totalPrice) => {
        this.totalsPrices.push(totalPrice);
      },
      (error) => {
        console.log(error);
      });
  }

  makeOrder(ongoingOrderId: number): void {
    if (this.orders && this.totalsPrices) {

      if (confirm('Etes-vous sûr de vouloir payer cette commande ?')) {

        this.loading = true;

        // if (this.user.wallet > this.totalsPrices[0].priceVAT) {

        this.constraintService.constraint(1).subscribe(
            (constraint) => {
              // this.orderTimeLimit = constraint.orderTimeLimit as string;
              // const currentTime = new Date().toLocaleTimeString();
              this.maximumOrderPerDay = constraint.maximumOrderPerDay;

              // if (currentTime < this.orderTimeLimit) {

              if (this.maximumOrderPerDay > 0) {

                this.orderService.makeOrder(ongoingOrderId, 1).subscribe(
                  (data) => {
                    localStorage.setItem('userChangedValues', JSON.stringify(data.user));

                    const updatedConstraint: ConstraintIN = {
                      orderTimeLimit: constraint.orderTimeLimit as string,
                      maximumOrderPerDay: constraint.maximumOrderPerDay - 1,
                      rateVAT: constraint.rateVAT
                    };
                    this.constraintService.update(constraint.id, updatedConstraint).subscribe(
                      () => {
                        const snackBarRef = this.snackBar.open(`Commande effectuée avec succès`, '', {
                          duration: 2000,
                          verticalPosition: 'bottom'
                        });
                        snackBarRef.afterDismissed().subscribe(() => {
                          location.reload();
                        });
                      });
                  },
                  (error) => {
                    console.log(error);
                    if (error.status === 412 && error.error.exceptionMessage.includes('n\'a pas assez d\'argent')) {
                      alert('Il n\'y a pas assez d\'argent. Veuillez réalimenter la cagnotte');
                      this.loading = false;
                    }
                  });

              } else {
                alert('Trop de commandes aujourd\'hui, il faut attendre demain');
                this.loading = false;
              }

              // } else {
              //   alert('Une commande ne peut être effectuée qu\'avant 10h30');
              // }
            },
            (error) => {
              console.log(error);
            });

        // } else {
        //   alert('Vous n\'avez pas assez d\'argent sur votre compte, veuillez donner assez d\'argent à la cantinière');
        // }

      }

    }
  }

  removeOrder(ongoingOrderId: number): void {
    if (confirm('Etes-vous sûr de vouloir annuler cette commande ?')) {
      this.loading = true;

      this.orderService.delete(ongoingOrderId).subscribe(
        () => {
          const snackBarRef = this.snackBar.open(`Commande annulée avec succès`, '', {
            duration: 2000,
            verticalPosition: 'bottom'
          });
          snackBarRef.afterDismissed().subscribe(() => {
            location.reload();
          });
        },
        (error) => {
          console.log(error);
        }
        );
    }
  }

  removeFromOrder(
    orderToUpdateId: number,
    quantity: QuantityOUT[],
    quantityToDeleteId: number): void {
    if (quantity.length === 1) {
      this.removeOrder(orderToUpdateId);
    } else {
      if (confirm('Etes-vous sûr de vouloir retirer ce produit du panier ?')) {
        this.loading = true;

        // On crée une variable newQuantity qui contiendra toutes nos quantités(repas/menus)
        const newQuantity: QuantityIN[] = [];

        // On supprime, de l'array contenant toutes les quantités(repas/menus)
        // de la commande, la quantité(repas/menus) choisie pas l'utilisateur
        quantity = quantity.filter(element => element.id !== quantityToDeleteId);

        // Ensuite, on parcours l'array contenant toutes les quantités(repas/menus)
        // de la commande
        quantity.forEach(element => {
          // A chaque boucle,
          // on ajoute, à l'array newQuantity, les données qui nous intéressent
          newQuantity.push({
            quantity: element.quantity,
            mealId: element.meal ? element.meal.id : null,
            menuId: element.menu ? element.menu.id : null
          });
        });

        // Enfin, on ajoute toutes les quantités dans la variable updatedContent
        const updatedContent: OrderIN = {
          userId: this.user.id,
          constraintId: 2,
          quantity: newQuantity
        };

        this.orderService.update(orderToUpdateId, updatedContent).subscribe(
          () => {
            const snackBarRef = this.snackBar.open(`Produit supprimé du panier`, '', {
              duration: 2000,
              verticalPosition: 'bottom'
            });
            snackBarRef.afterDismissed().subscribe(() => {
              this.ngOnInit();
            });
          },
          (error) => {
            console.log(error);
            if (error.status === 412 && error.exceptionMessage === 'L\'heure authorisée pour passer une commande est dépassée') {
              alert('Erreur : La modification d\'un élément au panier ne peut se faire qu\'avant 10h30');
            }
          }
        );
      }
    }
  }
}
