import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Import Auth Guard
import { ReverseAuthGuard } from './reverse-auth.guard'; // Import Reverse Auth Guard

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadChildren: () => import('./modules/login.module').then(m => m.LoginModule),
    canActivate: [ReverseAuthGuard] 
  },
  { 
    path: 'register', 
    loadChildren: () => import('./modules/register.module').then(m => m.RegisterModule),
    canActivate: [ReverseAuthGuard] 
  },
  { 
    path: 'main', 
    loadChildren: () => import('./modules/todos.module').then(m => m.TodosModule),
    canActivate: [AuthGuard] 
  },
  {path:'**',redirectTo:'/main'}
];
