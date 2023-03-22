import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';


interface Person {
  name: string | null;
  age?: number;
  schools: string[];
  address: {
      street: string;
      streetNumber: number;
  };
}

const personFormGroup = new FormGroup<ControlsOf<Person>>({
  name: new FormControl<string | null>(null),
  age: new FormControl<number>(5, { nonNullable: true }),
  schools: new FormArray<FormControl<string>>([]),
  address: new FormGroup<ControlsOf<Person['address']>>({
      street: new FormControl<string>('', { nonNullable: true }),
      streetNumber: new FormControl<number>(4, { nonNullable: true }),
  }),
});


type NonUndefined<T> = T extends undefined ? never : T;

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: NonUndefined<T[K]> extends AbstractControl ? T[K] : NonUndefined<T[K]> extends (infer R)[]
      ? FormArray<FormControl<R>>
      : NonUndefined<T[K]> extends Record<any, any>
          ? FormGroup<ControlsOf<T[K]>>
          : FormControl<T[K]>;
};

export type ValuesOf<T extends ControlsOf<any>> = {
  [K in keyof T]: NonUndefined<T[K]> extends FormControl<infer R>
      ? R
      : NonUndefined<T[K]> extends FormGroup<infer R>
          ? ValuesOf<R>
          : NonUndefined<T[K]> extends FormArray<infer R> ? R[] : NonUndefined<T[K]>;
};

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Hello from {{name}}!</h1>
    <a target="_blank" href="https://angular.io/start">
      Learn more about Angular 
    </a>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
