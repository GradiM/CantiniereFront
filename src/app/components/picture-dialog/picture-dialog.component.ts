import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { ImageIN } from 'src/app/shared/interfaces/image';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-picture-dialog',
  templateUrl: './picture-dialog.component.html',
  styleUrls: ['./picture-dialog.component.css']
})
export class PictureDialogComponent implements OnInit {


  fileToUpload: File = null;
  url: string;

  
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<PictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.url = data.profilePicture;
     }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleFileInput(e) {
    if(e.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event : any) =>{
        this.url = event.target.result;
      }
    }
  }

}
