import { SpectatorService } from "@ngneat/spectator";
import { createServiceFactory } from "@ngneat/spectator/jest";
import { BehaviorSubject } from "rxjs";
import { SignalState } from "../new/signal.service";
import { SignalOldService } from "./signal-old.service";
import { UsingSignalOldService } from "./using-signal-old.service";

describe("SignalStateService", () => {
  let spectator: SpectatorService<UsingSignalOldService>;
  let service: UsingSignalOldService;
  const subject = new BehaviorSubject<SignalState>({
    foo: "",
    bar: false,
  });

  const createService = createServiceFactory({
    service: UsingSignalOldService,
    providers: [
      {
        provide: SignalOldService,
        useValue: { getState: jest.fn().mockReturnValue(subject) },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(UsingSignalOldService);
  });

  it("should subscribe", () => {
    const signalService = spectator.inject(SignalOldService);

    expect(signalService.getState).toHaveBeenCalled();
  });

  it("should update state when router state changes", () => {
    subject.next({ foo: "123", bar: true });

    expect(spectator.service.getState().value).toEqual("123");
  });
});
