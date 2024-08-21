import { Injectable, signal } from "@angular/core";
import { isEqual } from "lodash";

export interface SignalState {
  foo: string;
  bar: boolean | undefined;
}

@Injectable({
  providedIn: "root",
})
export class SignalService {
  private signalState = signal<SignalState>({ foo: "", bar: undefined });
  public getValue = this.signalState.asReadonly();

  public updateFoo(foo: string) {
    this.updateSignal({ foo });
  }

  private isChanged(currentState: SignalState, updatedState: SignalState) {
    return !isEqual(currentState, updatedState);
  }

  private updateSignal(newState: Partial<SignalState>) {
    const currentState = this.getValue();
    const updatedState: SignalState = { ...currentState, ...newState };

    if (this.isChanged(currentState, updatedState)) {
      this.signalState.set(updatedState);
    }
  }
}
