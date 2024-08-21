import { SpectatorService } from "@ngneat/spectator";
import { createServiceFactory } from "@ngneat/spectator/jest";
import { SignalService } from "./signal.service";
import { UsingSignalService } from "./using-signal.service";

describe("SignalStateService", () => {
  let spectator: SpectatorService<UsingSignalService>;
  let service: UsingSignalService;
  const currentState = {
    foo: "",
    bar: false,
  };

  const createService = createServiceFactory({
    service: UsingSignalService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(UsingSignalService);
  });

  it("should update computed signal when state changes", () => {
    const signalService = spectator.inject(SignalService);
    signalService["signalState"].set({ foo: "123", bar: true });

    expect(spectator.service.computedSignal()).toEqual("123");
  });

  it("should update state when signalState changes", () => {
    const signalService = spectator.inject(SignalService);
    signalService["signalState"].set({ foo: "123", bar: true });

    expect(spectator.service.value()).toEqual("123");
  });

  it("should not update state when signalState is the same", () => {
    const nextSpy = jest.spyOn(service['usingSignalState'], 'set');
    const signalService = spectator.inject(SignalService);
    signalService["signalState"].set({ foo: '', bar: true });

    expect(nextSpy).not.toHaveBeenCalled();
  });
});
