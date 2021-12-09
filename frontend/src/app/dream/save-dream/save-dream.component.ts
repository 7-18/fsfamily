import { Component, OnInit } from '@angular/core';
import { DreamService } from 'src/app/services/dream.service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-save-dream',
  templateUrl: './save-dream.component.html',
  styleUrls: ['./save-dream.component.css'],
})
export class SaveDreamComponent implements OnInit {
  registerData: any;
  selectedFile: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  buttonDisabled: boolean = false;

  constructor(
    private _dreamService: DreamService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.registerData = {};
    this.selectedFile = null;
  }

  ngOnInit(): void {}

  cancelDream() {
    this._router.navigate(['/listDream']);
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
        },
        (err) => {
          this.message = err.error;
          this.openSnackBarError();
        }
      );
    }
  }

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  saveDreamImg() {
    if (!this.registerData.name || !this.registerData.description) {
      this.message = 'Error: datos incompletos';
      this.openSnackBarError();
    } else {
      const data = new FormData();

      if (this.selectedFile != null) {
        data.append('image', this.selectedFile, this.selectedFile.name);
      }
      data.append('name', this.registerData.name);
      data.append('description', this.registerData.description);

      this._dreamService.saveDreamImg(data).subscribe({
        next: (v) => {
          this._router.navigate(['/listDream']);
          this.message = 'Objetivo creado';
          this.openSnackBarSuccesfull();
          this.registerData = {};
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
        complete: () => console.info('complete'),
      });
    }
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
}
