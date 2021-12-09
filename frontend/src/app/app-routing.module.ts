import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRoleComponent } from './admin/list-role/list-role.component';
import { ListUserComponent } from './admin/list-user/list-user.component';
import { RegisterRoleComponent } from './admin/register-role/register-role.component';
import { RegisterUserComponent } from './admin/register-user/register-user.component';
import { UpdateRoleComponent } from './admin/update-role/update-role.component';
import { UpdateUserComponent } from './admin/update-user/update-user.component';
import { ListTaskComponent } from './board/list-task/list-task.component';
import { SaveTaskComponent } from './board/save-task/save-task.component';
import { LoginComponent } from './home/login/login.component';
import { RegisterComponent } from './home/register/register.component';

import { AuthGuard } from './guard/auth.guard';
import { CalmComponent } from './music/calm/calm.component';
import { ElectronicComponent } from './music/electronic/electronic.component';
import { GrooveComponent } from './music/groove/groove.component';
import { HappinessComponent } from './music/happiness/happiness.component';
import { JazzComponent } from './music/jazz/jazz.component';
import { ListDreamComponent } from './dream/list-dream/list-dream.component';
import { SaveDreamComponent } from './dream/save-dream/save-dream.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'listTask',
    component: ListTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'saveTask',
    component: SaveTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signUp',
    component: RegisterComponent,
  },
  {
    path: 'listUser',
    component: ListUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'registerUser',
    component: RegisterUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'updateUser/:_id',
    component: UpdateUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'registerRole',
    component: RegisterRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listRole',
    component: ListRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'updateRole/:_id',
    component: UpdateRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'musicCalm',
    component: CalmComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'musicElectronic',
    component: ElectronicComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'musicGroove',
    component: GrooveComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'musicHappiness',
    component: HappinessComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'musicJazz',
    component: JazzComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listDream',
    component: ListDreamComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'saveDream',
    component: SaveDreamComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
