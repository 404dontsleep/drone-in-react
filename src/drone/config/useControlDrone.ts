import { useControls } from "leva";

export default function useControlDrone() {
  return useControls("ControlDrone", () => ({
    thrustValue: { value: 0, min: 0, max: 200, step: 0.1 },
    yawValue: { value: 0, min: -100, max: 100, step: 0.1 },
    pitchValue: { value: 0, min: -100, max: 100, step: 0.1 },
    rollValue: { value: 0, min: -100, max: 100, step: 0.1 },
  }));
}
