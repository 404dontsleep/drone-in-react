import { KeyboardControls } from "@react-three/drei";
import { EKeyboardControlType } from "./EKeyboardControlType";

const map: React.ComponentProps<typeof KeyboardControls>["map"] = [
  { name: EKeyboardControlType.PitchUp, keys: ["ArrowDown"] },
  { name: EKeyboardControlType.PitchDown, keys: ["ArrowUp"] },
  { name: EKeyboardControlType.RollLeft, keys: ["ArrowLeft"] },
  { name: EKeyboardControlType.RollRight, keys: ["ArrowRight"] },
  { name: EKeyboardControlType.YawLeft, keys: ["a"] },
  { name: EKeyboardControlType.YawRight, keys: ["d"] },
  { name: EKeyboardControlType.ThrustUp, keys: ["w"] },
  { name: EKeyboardControlType.ThrustDown, keys: ["s"] },
];

export default function KeyboardControl({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KeyboardControls map={map}>{children}</KeyboardControls>;
}
