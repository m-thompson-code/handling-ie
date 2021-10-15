import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  numbers: number[] = [];
  sum: number = 0;
  isEven: boolean = false;
  doubleNumbers: number[] = [];

  constructor() {
    if (window.nomodule) {
      console.log("woo");
    }
    
    console.log(this);
    console.log(this.ngOnInit.toString());
    console.log(JSON.stringify(this.ngOnInit));
  }

  ngOnInit(): void {
    this.numbers = [1,3,5,7];
    this.isEven = this.numbers.some(num => num % 2 === 0);
    this.sum = this.numbers.reduce((sum, num) => sum + num, 0);
    const doubleNumbers = [...this.numbers, ...this.numbers];
    this.doubleNumbers = doubleNumbers;
  }
}
