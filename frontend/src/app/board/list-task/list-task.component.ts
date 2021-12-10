import { Component, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
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
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css'],
})
export class ListTaskComponent implements OnInit {
  opened = false;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  today;

  taskData: any;
  taskTodo: any;
  taskInprogress: any;
  taskDone: any;
  registerData: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private _boardService: BoardService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private observer: BreakpointObserver
  ) {
    this.taskData = {};
    this.taskTodo = [];
    this.taskInprogress = [];
    this.taskDone = [];
    this.registerData = {};
    this.today = moment().locale('es').format('dddd MMM D');
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
  ngOnInit(): void {
    this._boardService.listTask().subscribe({
      next: (v) => {
        this.taskData = v.taskList;
        this.taskData.forEach((tk: any) => {
          if (tk.taskStatus === 'por hacer') {
            this.taskTodo.push(tk);
          }
          if (tk.taskStatus === 'en progreso') {
            this.taskInprogress.push(tk);
          }
          if (tk.taskStatus === 'hecho') {
            this.taskDone.push(tk);
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

  updateTask(task: any, status: string) {
    let tempStatus = task.taskStatus;
    task.taskStatus = status;
    this._boardService.updateTask(task).subscribe({
      next: (v) => {
        task.status = status;
        this.resetList();
      },
      error: (e) => {
        task.status = tempStatus;
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
  }

  resetList() {
    this.taskTodo = [];
    this.taskInprogress = [];
    this.taskDone = [];
    this._boardService.listTask().subscribe({
      next: (v) => {
        this.taskData = v.taskList;
        this.taskData.forEach((tk: any) => {
          if (tk.taskStatus === 'por hacer') {
            this.taskTodo.push(tk);
          }
          if (tk.taskStatus === 'en progreso') {
            this.taskInprogress.push(tk);
          }
          if (tk.taskStatus === 'hecho') {
            this.taskDone.push(tk);
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
    this.taskTodo.forEach((tk: any) => {
      if (tk.taskStatus !== 'por hacer') {
        this.updateTask(tk, 'por hacer');
      }
    });
    this.taskInprogress.forEach((tk: any) => {
      if (tk.taskStatus !== 'en progreso') {
        this.updateTask(tk, 'en progreso');
      }
    });
    this.taskDone.forEach((tk: any) => {
      if (tk.taskStatus !== 'hecho') {
        this.updateTask(tk, 'hecho');
      }
    });
  }

  deleteTask(task: any) {
    this._boardService.deleteTask(task).subscribe({
      next: (v) => {
        let index = this.taskData.indexOf(task);
        if (index > -1) {
          this.taskData.splice(index, 1);
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

  saveTask() {
    if (!this.registerData.name || !this.registerData.description) {
      this.message = 'Error: datos incompletos';
      this.openSnackBarError();
    } else {
      this._boardService.saveTask(this.registerData).subscribe(
        (res) => {
          this._router.navigate(['/listTask']);
          this.message = 'Tarea creada';
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
