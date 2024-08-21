import { SpectatorService } from "@ngneat/spectator";
import { createServiceFactory } from "@ngneat/spectator/jest";
import { SignalService } from "./signal.service";
import { UsingSignalService } from "./using-signal.service";
import { Injectable, inject } from "@angular/core";
import {toObservable} from "@angular/core/rxjs-interop";
import { fakeAsync, flush } from "@angular/core/testing";
import { skip } from "rxjs";

@Injectable()
export class UsingSignalServiceTesting extends UsingSignalService {
  signalChange$ = toObservable(this['signalService'].getValue).pipe(
    skip(1),
  );
}

describe("SignalStateService", () => {
  let spectator: SpectatorService<UsingSignalServiceTesting>;
  let service: UsingSignalServiceTesting;
  const currentState = {
    foo: "",
    bar: false,
  };

  const createService = createServiceFactory({
    service: UsingSignalServiceTesting,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(UsingSignalServiceTesting);
  });

  it("should update computed signal when state changes", () => {
    const signalService = spectator.inject(SignalService);
    signalService["signalState"].set({ foo: "123", bar: true });
    expect(spectator.service.computedSignal()).toEqual("123");
  });

  it("should update state when signalState changes", fakeAsync(() => {
    const signalService = spectator.inject(SignalService);
    const spyFn = jest.fn();
    service.signalChange$.subscribe(spyFn);
    signalService["signalState"].set({ foo: "123", bar: true });
    flush();
    expect(spyFn).toHaveBeenCalled();
  }));

  it("should not update state when signalState is the same", fakeAsync(() => {
    const signalService = spectator.inject(SignalService);
    const spyFn = jest.fn();
    service.signalChange$.subscribe(spyFn);
    signalService["signalState"].set({ foo: "", bar: undefined });
    flush();
    expect(spyFn).not.toHaveBeenCalled();
  }));
}); 
