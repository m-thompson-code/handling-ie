import { Component, TrackByFunction } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, Subject } from 'rxjs';
import { debounce, takeUntil } from 'rxjs/operators';

interface ChartData {
  value: number;
  rank: number;
  index: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  chartDatas: ChartData[] = [];
  form: FormGroup;
  imageIndexes: number[] = [1,2,3,4,5,6];

  private readonly unsubscriber$ = new Subject<void>();
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rankings: this.fb.array(this.imageIndexes.map(_ => [0, [Validators.min(0), Validators.max(6)]]))
    });
  }

  ngOnInit(): void {
    const controls: FormControl[] = (this.form.controls.rankings as FormArray).controls as FormControl[];

    this.form.controls.rankings.valueChanges.pipe(debounce(() => interval(300)),takeUntil(this.unsubscriber$)).subscribe(values => {
      console.log('formArray', values);
      const ranks: number[] = [...values].sort((a,b) => a - b);

      this.chartDatas = (values as number[]).map((value: number, index: number) => ({
        index: index,
        value,
        rank: ranks.indexOf(value),
      }));
    });

    controls.forEach(control => control.valueChanges.pipe(takeUntil(this.unsubscriber$)).subscribe(value => {
      console.log(value);
      this.handleValueWasSet(controls, control);
    }));
  }

  handleValueWasSet(controls: FormControl[], control: FormControl): void {
    if (control.value <= 0) {
      return;
    }

    controls.forEach(otherControl => {
      if (otherControl === control) {
        return;
      }

      if (otherControl.value === control.value) {
        otherControl.setValue(Math.max(0, control.value - 1));
        this.handleValueWasSet(controls, otherControl);
      }
    })
  }

  chartDataTrackBy(index: number, chartdata: ChartData): number {
    return chartdata.index;
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
