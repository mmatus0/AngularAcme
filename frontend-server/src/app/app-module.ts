import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { ProductList } from './product/product-list/product-list';
import { Star } from './product/product-list/star/star';

@NgModule({
  declarations: [
    App,
    ProductList,
    Star
  ],
  imports: [
    BrowserModule
  ],
  bootstrap: [App]
})
export class AppModule { }