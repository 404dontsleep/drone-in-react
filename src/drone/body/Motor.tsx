import { Box } from "@react-three/drei";
import {
  RapierRigidBody,
  RevoluteJointParams,
  RigidBody,
  useRevoluteJoint,
} from "@react-three/rapier";
import useMotorConfig from "../config/useMotorConfig";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Quaternion, Vector3 } from "three";

export const Motor = ({
  rigidBodyProps,
  boxProps,
  armRef,
  revoluteJoint,
  control,
}: {
  rigidBodyProps?: React.ComponentProps<typeof RigidBody>;
  boxProps?: React.ComponentProps<typeof Box>;
  armRef: React.RefObject<RapierRigidBody>;
  revoluteJoint: RevoluteJointParams;
  control: ReturnType<typeof useMotorConfig>["0"];
}) => {
  const motorRef = useRef<RapierRigidBody>(null);
  const joint = useRevoluteJoint(armRef, motorRef, revoluteJoint);
  useFrame((_, delta) => {
    const fixed = 2;
    const rot = control.speed * (control.clockwise ? 1 : -1) * 5;
    joint.current!.configureMotorVelocity!(parseFloat(rot.toFixed(fixed)), 1);
    joint.current?.rawAxis();
    if (motorRef.current) {
      const rotation = motorRef.current.rotation();
      const rotationQuaternion = new Quaternion(
        rotation.x,
        rotation.y,
        rotation.z,
        rotation.w
      );
      const vec = 0.0243 * control.speed * delta;
      const up = new Vector3(
        0,
        parseFloat(vec.toFixed(fixed)),
        0
      ).applyQuaternion(rotationQuaternion);
      const vup = new Vector3(
        parseFloat(up.x.toFixed(fixed)),
        parseFloat(up.y.toFixed(fixed)),
        parseFloat(up.z.toFixed(fixed))
      );
      motorRef.current.applyImpulse(vup, true);
    }
  });
  return (
    <RigidBody
      position={[0, 1, 0]}
      gravityScale={5}
      ref={motorRef}
      {...rigidBodyProps}
    >
      <Box args={[1, 0.02, 0.1]} {...boxProps}>
        <meshNormalMaterial />
      </Box>
      <Box args={[0.1, 0.02, 1]} {...boxProps}>
        <meshNormalMaterial />
      </Box>
    </RigidBody>
  );
};
