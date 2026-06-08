import { Routes } from '@angular/router';

import { Welcome } from './features/home/welcome/welcome';
import { PageNotFound } from './features/not-found/page-not-found/page-not-found';
import { ProductList } from './features/products/components/product-list/product-list';
import { Login } from './features/auth/components/login/login';
import { loginGuard } from './features/auth/guards/login-guard';
import { NumberComponent } from './features/numbers/components/number/number';
import { UserComponent } from './features/users/components/user/user';
import { ProductPagination } from './features/products/components/product-pagination/product-pagination';

export const routes: Routes = [
    { path: 'home',               component: Welcome,           canActivate: [loginGuard] },
    { path: 'products',           component: ProductList,        canActivate: [loginGuard] },
    { path: 'numbers',            component: NumberComponent,    canActivate: [loginGuard] },
    { path: 'users',              component: UserComponent,      canActivate: [loginGuard] },
    { path: 'product-pagination', component: ProductPagination,  canActivate: [loginGuard] },
    { path: 'login',              component: Login },

    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: PageNotFound }
];