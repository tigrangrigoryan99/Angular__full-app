import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingridient } from '../shared/ingridient.model';
import { ShoppingService } from './shopping.service';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  public ingridients: Ingridient[];
  private subIngChang: Subscription;
  constructor(
    private shopService: ShoppingService,
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {
    this.ingridients = this.shopService.getIngridients();
    this.subIngChang = this.shopService.ingredientsChanged.subscribe(
      (ingredients: Ingridient[]) => {
        this.ingridients = ingredients;
      }
    );

    // this.loggingService.printLog("Hello I'm in Shopping-List");
  }

  onEditItem(id: number) {
    this.shopService.startedEditing.next(id);
  }

  ngOnDestroy(): void {
    this.subIngChang?.unsubscribe();
  }
}
