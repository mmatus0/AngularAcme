import { Routes } from '@angular/router';

import { Welcome } from './features/home/welcome/welcome';
import { PageNotFound } from './features/not-found/page-not-found/page-not-found';
import { ProductList } from './features/products/components/product-list/product-list';
import { Login } from './features/auth/components/login/login';

export const routes: Routes = [
    { path: 'home', component: Welcome },
    { path: 'products', component: ProductList },
    { path: 'login', component: Login },

    /* detalle de producto, usando estándar de recursos */
    // { path: 'products/:id', component: ProductId },

    // Redirección inicial
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // Siempre al final para manejar rutas no definidas
    { path: '**', component: PageNotFound }
];