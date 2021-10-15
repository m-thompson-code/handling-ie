import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, Subject } from 'rxjs';
import { debounce, takeUntil } from 'rxjs/operators';
import { getFirestore, collection, onSnapshot, Firestore, doc, setDoc, Unsubscribe } from 'firebase/firestore';
import { Auth, getAuth, signInAnonymously } from "firebase/auth";

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAX5xA3hksdkCoPyZAXNE1JM0co5SEKRTE",
  authDomain: "handling-ie.firebaseapp.com",
  projectId: "handling-ie",
  storageBucket: "handling-ie.appspot.com",
  messagingSenderId: "872020403741",
  appId: "1:872020403741:web:7bef43aaab4f586b4408f4",
  measurementId: "G-FQCGZPMWVV"
};

interface ChartData {
  value: number;
  imgIndex: number;
  rank: number;
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

  db: Firestore;
  unsub?:Unsubscribe;
  auth: Auth;
  uid: string | null = null;

  private readonly unsubscriber$ = new Subject<void>();

  initForms = true;
  
  constructor(private fb: FormBuilder) {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.auth = getAuth(app);

    this.signIn();

    this.form = this.fb.group({
      rankings: this.fb.array(this.imageIndexes.map(_ => [0, [Validators.min(0), Validators.max(6)]]))
    });
  }

  ngOnInit(): void {
    const controls: FormControl[] = (this.form.controls.rankings as FormArray).controls as FormControl[];

    controls.forEach(control => control.valueChanges.pipe(takeUntil(this.unsubscriber$)).subscribe(value => {
      console.log(value);
      this.handleValueWasSet(controls, control);
    }));

    this.form.controls.rankings.valueChanges.pipe(debounce(() => interval(300)),takeUntil(this.unsubscriber$)).subscribe(values => {
      console.log('formArray', values);
      this.setData(values);
    });
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

  chartDataTrackBy(index: number): number {
    return index;
  }

  setData(values: number[]) {
    if (!this.uid) {
      return;
    }

    const citiesRef = collection(this.db, "votes");

    setDoc(doc(citiesRef, this.uid), {
      0: values[0] ?? 0,
      1: values[1] ?? 0,
      2: values[2] ?? 0,
      3: values[3] ?? 0,
      4: values[4] ?? 0,
      5: values[5] ?? 0,
    });
  }

  // Get a list of cities from your database
  getData() {
    const citiesRef = collection(this.db, "votes");

    this.unsub = onSnapshot(citiesRef, (col) => {
      this.chartDatas = [];

      for (let i = 0; i < 6; i++) {
        this.chartDatas.push({
          value: 0,
          imgIndex: i,
          rank: i,
        });
      }

      col.forEach(doc => {
        const votes = doc.data();
        if (doc.id === this.uid && this.initForms) {
          this.form.controls.rankings.setValue([votes[0],votes[1],votes[2],votes[3],votes[4],votes[5]]);
        }

        
        console.log(votes);
        for (let i = 0; i < 6; i++) {
          this.chartDatas[i].value += votes[i] ?? 0;
        }
      });

      this.initForms = false;

      const temp = [...this.chartDatas].sort((a: ChartData, b: ChartData) => a.value - b.value);
      console.log(this.chartDatas);

      this.chartDatas.forEach(chartData => {
        chartData.rank = temp.indexOf(chartData);
      });
    });
  }

  signIn(): void {
    signInAnonymously(this.auth)
    .then((user) => {
      console.log("signed in", user);
      this.uid = user.user.uid;

      this.getData();
    }).catch((error) => {
      console.error(error);
    });
  }

  ngOnDestroy(): void {
    this.unsub?.();
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
