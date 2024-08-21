import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SignalOldService } from "./signal-old.service";

export interface SignalState {
  foo: string;
  bar: boolean | undefined;
}

@Injectable({
  providedIn: "root",
})
export class UsingSignalOldService {
  private state$ = new BehaviorSubject<string>(""); //old

  constructor(private signalOldService: SignalOldService) {
    this.signalOldService.getState().subscribe((state) => {
      if (this.state$.getValue() !== state.foo) {
        this.state$.next(state.foo);
      }
    });
  }

  public getState() {
    return this.state$;
  }
}
