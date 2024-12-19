// import { Cylinder } from "@react-three/drei";
import { Box } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { forwardRef } from "react";

export const WaterContainer = forwardRef<RapierRigidBody>((props, ref) => {
  return (
    <RigidBody gravityScale={1} ref={ref} {...props}>
      <Box args={[1, 1, 1]}>
        <meshNormalMaterial />
      </Box>
      {/* <Cylinder args={[0.5, 0.5, 1, 32]}>
        <meshNormalMaterial />
      </Cylinder> */}
    </RigidBody>
  );
});
