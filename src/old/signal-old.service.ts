import { Injectable } from "@angular/core";
import { isEqual } from "lodash";
import { BehaviorSubject } from "rxjs";

export interface SignalState {
  foo: string;
  bar: boolean | undefined;
}

@Injectable({
  providedIn: "root",
})
export class SignalOldService {
  private signalState$ = new BehaviorSubject<SignalState>({
    foo: "",
    bar: undefined,
  });

  public getState() {
    return this.signalState$;
  }
  public getValue() {
    return this.signalState$.getValue();
  }

  public updateFoo(foo: string) {
    this.updateSignal({ foo });
  }

  private isChanged(currentState: SignalState, updatedState: SignalState) {
    return !isEqual(currentState, updatedState);
  }

  private updateSignal(newState: Partial<SignalState>) {
    const currentState = this.signalState$.value;
    const updatedState: SignalState = { ...currentState, ...newState };

    if (this.isChanged(currentState, updatedState)) {
      this.signalState$.next(updatedState);
    }
  }
}
