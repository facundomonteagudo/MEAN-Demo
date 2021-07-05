import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message:string}) { }

  ngOnInit(): void {
  }

}
