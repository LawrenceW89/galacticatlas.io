import { Routes } from '@angular/router';
import { UnderConstructionComponent } from './under-construction/under-construction.component';

export const routes: Routes = [
  { path: '', component: UnderConstructionComponent }, // Default route
  { path: 'under-construction', component: UnderConstructionComponent },
];
