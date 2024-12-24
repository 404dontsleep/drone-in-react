import { useFrame } from "@react-three/fiber";
import useDroneSensor from "../config/useDroneSensor";
import useControlDrone from "../config/useControlDrone";
import useMotorConfig from "../config/useMotorConfig";
import { useEffect } from "react";
import { SpotLight, useKeyboardControls } from "@react-three/drei";
import { EKeyboardControlType } from "./EKeyboardControlType";
import { calculateControlOutput } from "./PID";
import { Euler, Object3D, Vector3 } from "three";
export default function ControlDrone() {
  const [sensor] = useDroneSensor();
  const [control] = useControlDrone();
  const [, setMotorA] = useMotorConfig("motorA");
  const [, setMotorD] = useMotorConfig("motorD");
  const [, setMotorW] = useMotorConfig("motorW");
  const [, setMotorS] = useMotorConfig("motorS");
  useFrame((_, deltaTime) => {
    const cons = 0;
    const t = calculateControlOutput(deltaTime, sensor);
    const outputValue = {
      outThrust: control.thrustValue + t.thrustOutput,
      outYaw: control.yawValue + t.yawOutput,
      outPitch: control.pitchValue + t.pitchOutput,
      outRoll: control.rollValue + t.rollOutput,
    };
    setMotorA({
      speed:
        outputValue.outThrust +
        outputValue.outYaw -
        outputValue.outPitch -
        outputValue.outRoll +
        cons,
    });
    setMotorS({
      speed:
        outputValue.outThrust -
        outputValue.outYaw -
        outputValue.outPitch +
        outputValue.outRoll +
        +cons,
    });
    setMotorD({
      speed:
        outputValue.outThrust +
        outputValue.outYaw +
        outputValue.outPitch +
        outputValue.outRoll +
        +cons,
    });
    setMotorW({
      speed:
        outputValue.outThrust -
        outputValue.outYaw +
        outputValue.outPitch -
        outputValue.outRoll +
        +cons,
    });
  }, -1);
  useEffect(() => {
    setMotorW({ clockwise: true });
    setMotorS({ clockwise: true });
    setMotorA({ clockwise: false });
    setMotorD({ clockwise: false });
  }, [setMotorA, setMotorD, setMotorW, setMotorS]);
  return (
    <>
      <KeyboardControl />
      <AngleHelper />
    </>
  );
}
function AngleHelper() {
  const isDrop = useKeyboardControls(
    (state) => state[EKeyboardControlType.WaterDrop]
  );
  const [sensor] = useDroneSensor();
  const euler = new Euler(
    sensor.rotation.pitch,
    sensor.rotation.yaw,
    sensor.rotation.roll
  );
  const pos = new Vector3(0, -1, 0).applyEuler(euler).add(sensor.position);
  const object = new Object3D();
  object.position.set(pos.x, pos.y - 2, pos.z);
  return (
    <>
      {isDrop && (
        <SpotLight position={pos} angle={0.1} color={"blue"} target={object} />
      )}
    </>
  );
}
function KeyboardControl() {
  const isThrustUp = useKeyboardControls(
    (state) => state[EKeyboardControlType.ThrustUp]
  );
  const isThrustDown = useKeyboardControls(
    (state) => state[EKeyboardControlType.ThrustDown]
  );
  const isYawLeft = useKeyboardControls(
    (state) => state[EKeyboardControlType.YawLeft]
  );
  const isYawRight = useKeyboardControls(
    (state) => state[EKeyboardControlType.YawRight]
  );
  const isPitchUp = useKeyboardControls(
    (state) => state[EKeyboardControlType.PitchUp]
  );
  const isPitchDown = useKeyboardControls(
    (state) => state[EKeyboardControlType.PitchDown]
  );
  const isRollLeft = useKeyboardControls(
    (state) => state[EKeyboardControlType.RollLeft]
  );
  const isRollRight = useKeyboardControls(
    (state) => state[EKeyboardControlType.RollRight]
  );
  const [control, setControl] = useControlDrone();
  useFrame(() => {
    if (isThrustUp || isThrustDown)
      setControl({
        thrustValue: control.thrustValue + 2 * (isThrustUp ? 1 : -1),
      });

    if (isYawLeft || isYawRight)
      setControl({
        yawValue: 20 * (isYawLeft ? 1 : -1),
      });
    else setControl({ yawValue: 0 });

    if (isPitchUp || isPitchDown)
      setControl({
        pitchValue: 24 * (isPitchUp ? 1 : -1),
      });
    else setControl({ pitchValue: 0 });
    if (isRollLeft || isRollRight)
      setControl({
        rollValue: 24 * (isRollLeft ? 1 : -1),
      });
    else setControl({ rollValue: 0 });
  });
  return <></>;
}
