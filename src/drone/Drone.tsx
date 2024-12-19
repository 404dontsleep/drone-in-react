import { useRef, useState } from "react";
import { WaterContainer } from "./body/WaterContainer";
import { RapierRigidBody, useFixedJoint } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Euler, Quaternion } from "three";
import useDroneSensor from "./config/useDroneSensor";
import { Arm } from "./body/Arm";

export default function Drone() {
  const waterContainerRef = useRef<RapierRigidBody>(null);
  const armRef = useRef<RapierRigidBody>(null);
  useFixedJoint(waterContainerRef, armRef, [
    [0, 0.8, 0],
    [0, 0, 0, 1],
    [0, 0, 0],
    [0, 0, 0, 1],
  ]);
  return (
    <group position={[0, 1, 0]}>
      <WaterContainer ref={waterContainerRef} />
      <Arm ref={armRef} />
      <DroneSensor droneRef={armRef} />
    </group>
  );
}
// Sensor
const DroneSensor = ({
  droneRef,
}: {
  droneRef: React.RefObject<RapierRigidBody>;
}) => {
  const [, set] = useDroneSensor();
  const [preVel, setPreVel] = useState({ x: 0, y: 0, z: 0 });
  useFrame(() => {
    if (droneRef.current) {
      const rotation = droneRef.current.rotation();
      const position = droneRef.current.translation();
      const euler = new Euler().setFromQuaternion(
        new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w),
        "XYZ"
      );
      const velocity = droneRef.current.linvel();
      set({
        position: {
          x: position.x,
          y: position.y,
          z: position.z,
        },
        rotation: {
          yaw: euler.y,
          pitch: euler.x,
          roll: euler.z,
        },
        velocity: {
          x: velocity.x,
          y: velocity.y,
          z: velocity.z,
        },
        acceleration: {
          x: velocity.x - preVel.x,
          y: velocity.y - preVel.y,
          z: velocity.z - preVel.z,
        },
      });
      setPreVel({
        x: velocity.x,
        y: velocity.y,
        z: velocity.z,
      });
    }
  });
  return <></>;
};
