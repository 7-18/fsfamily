import { Component, OnInit, ViewChild } from '@angular/core';
import { DreamService } from 'src/app/services/dream.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import * as moment from 'moment';

@Component({
  selector: 'app-list-dream',
  templateUrl: './list-dream.component.html',
  styleUrls: ['./list-dream.component.css'],
})
export class ListDreamComponent implements OnInit {
  opened = false;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  today;

  DreamData: any;
  DreamTodo: any;
  DreamInprogress: any;
  DreamDone: any;
  registerData: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;
  constructor(
    private _dreamService: DreamService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private observer: BreakpointObserver
  ) {
    this.DreamData = {};
    this.DreamTodo = [];
    this.DreamInprogress = [];
    this.DreamDone = [];
    this.registerData = {};
    this.today = moment().locale('es').format('dddd MMM D');
  }

  ngOnInit(): void {
    this._dreamService.listDream().subscribe({
      next: (v) => {
        this.DreamData = v.DreamList;
        this.DreamData.forEach((tk: any) => {
          if (tk.DreamStatus === 'corto') {
            this.DreamTodo.push(tk);
          }
          if (tk.DreamStatus === 'mediano') {
            this.DreamInprogress.push(tk);
          }
          if (tk.DreamStatus === 'largo') {
            this.DreamDone.push(tk);
          }
        });
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.dropUpdate();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.dropUpdate();
    }
  }

  updateDream(Dream: any, status: string) {
    let tempStatus = Dream.DreamStatus;
    Dream.DreamStatus = status;
    this._dreamService.updateDream(Dream).subscribe({
      next: (v) => {
        Dream.status = status;
        this.resetList();
      },
      error: (e) => {
        Dream.status = tempStatus;
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
  }

  resetList() {
    this.DreamTodo = [];
    this.DreamInprogress = [];
    this.DreamDone = [];
    this._dreamService.listDream().subscribe({
      next: (v) => {
        this.DreamData = v.DreamList;
        this.DreamData.forEach((tk: any) => {
          if (tk.DreamStatus === 'corto') {
            this.DreamTodo.push(tk);
          }
          if (tk.DreamStatus === 'mediano') {
            this.DreamInprogress.push(tk);
          }
          if (tk.DreamStatus === 'largo') {
            this.DreamDone.push(tk);
          }
        });
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
  }

  dropUpdate() {
    this.DreamTodo.forEach((tk: any) => {
      if (tk.DreamStatus !== 'corto') {
        this.updateDream(tk, 'corto');
      }
    });
    this.DreamInprogress.forEach((tk: any) => {
      if (tk.DreamStatus !== 'mediano') {
        this.updateDream(tk, 'mediano');
      }
    });
    this.DreamDone.forEach((tk: any) => {
      if (tk.DreamStatus !== 'largo') {
        this.updateDream(tk, 'largo');
      }
    });
  }

  deleteDream(Dream: any) {
    this._dreamService.deleteDream(Dream).subscribe({
      next: (v) => {
        let index = this.DreamData.indexOf(Dream);
        if (index > -1) {
          this.DreamData.splice(index, 1);
          this.message = v.message;
          this.openSnackBarSuccesfull();
          location.reload();
        }
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
  }

  openSnackBarSuccesfull() {
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarTrue'],
    });
  }

  openSnackBarError() {
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarFalse'],
    });
  }

  saveDream() {
    if (!this.registerData.name || !this.registerData.description) {
      this.message = 'Error: datos incompletos';
      this.openSnackBarError();
    } else {
      this._dreamService.saveDream(this.registerData).subscribe(
        (res) => {
          this._router.navigate(['/listDream']);
          this.message = 'Objetivo creado';
          this.openSnackBarSuccesfull();
          this.registerData = {};
          location.reload();
        },
        (err) => {
          this.message = err.error;
          this.openSnackBarError();
        }
      );
    }
  }
}
