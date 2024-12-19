import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { forwardRef, MutableRefObject, useRef } from "react";
import useMotorConfig from "../config/useMotorConfig";
import useEnvConfig from "../config/useEnvConfig";
import { Box } from "@react-three/drei";
import { Motor } from "./Motor";
import { Quaternion, Vector3 } from "three";

export const Arm = forwardRef<
  RapierRigidBody,
  React.ComponentProps<typeof RigidBody>
>((props, ref) => {
  const localRef = useRef<RapierRigidBody | null>(null);
  const [motorW] = useMotorConfig("motorW");
  const [motorS] = useMotorConfig("motorS");
  const [motorA] = useMotorConfig("motorA");
  const [motorD] = useMotorConfig("motorD");
  const [env] = useEnvConfig();
  return (
    <>
      <RigidBody
        ref={(instance) => {
          localRef.current = instance;
          if (typeof ref === "function") {
            ref(instance);
          } else if (ref) {
            (ref as MutableRefObject<RapierRigidBody | null>).current =
              instance;
          }
        }}
        {...props}
      >
        <group rotation={[0, Math.PI / 4, 0]}>
          <Box args={[0.1, 0.05, env.wing * 2]}>
            <meshNormalMaterial />
          </Box>
          <Box args={[env.wing * 2, 0.05, 0.1]}>
            <meshNormalMaterial />
          </Box>
        </group>
      </RigidBody>
      <Motor
        control={motorS}
        armRef={localRef}
        revoluteJoint={[
          new Vector3(0, 0, env.wing).applyQuaternion(
            new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4)
          ),
          [0, -0.05, 0],
          [0, 1, 0],
        ]}
      />
      <Motor
        control={motorW}
        armRef={localRef}
        revoluteJoint={[
          new Vector3(0, 0, -env.wing).applyQuaternion(
            new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4)
          ),
          [0, -0.05, 0],
          [0, 1, 0],
        ]}
      />
      <Motor
        control={motorD}
        armRef={localRef}
        revoluteJoint={[
          new Vector3(env.wing, 0, 0).applyQuaternion(
            new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4)
          ),
          [0, -0.05, 0],
          [0, 1, 0],
        ]}
      />
      <Motor
        control={motorA}
        armRef={localRef}
        revoluteJoint={[
          new Vector3(-env.wing, 0, 0).applyQuaternion(
            new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4)
          ),
          [0, -0.05, 0],
          [0, 1, 0],
        ]}
      />
    </>
  );
});
