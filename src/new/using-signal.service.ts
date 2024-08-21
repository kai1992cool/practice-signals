import { computed, inject, Injectable, signal } from "@angular/core";
import { SignalService } from "./signal.service";

export interface SignalState {
  foo: string;
  bar: boolean | undefined;
}

@Injectable({
  providedIn: "root",
})
export class UsingSignalService {
  private signalService = inject(SignalService);
  public computedSignal = computed(() => this.signalService.getValue().foo);
  private usingSignalState = signal<string>("");
  public value = this.usingSignalState.asReadonly();

  constructor() {
    const signalState = this.signalService.getValue();
    if (signalState.foo !== this.usingSignalState()) {
      this.usingSignalState.set(signalState.foo);
    }
  }
}
