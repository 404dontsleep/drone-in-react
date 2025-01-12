import {
  Box,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Drone from "./drone/Drone";
import { Suspense } from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import useEnvConfig from "./drone/config/useEnvConfig";
import ControlDrone from "./drone/control/ControlDrone";
import KeyboardControl from "./drone/control/KeyboardControl";
import Graph from "./drone/Graph";
import Forest from "./drone/Forest";
function App() {
  const [env] = useEnvConfig();
  return (
    <KeyboardControl>
      <Canvas>
        <Graph />
        <Forest />
        <GizmoHelper
          alignment='bottom-right' // widget alignment within scene
          margin={[80, 80]} // widget margins (X, Y)
        >
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor='black'
          />
          {/* alternative: <GizmoViewcube /> */}
        </GizmoHelper>
        <ambientLight intensity={1} />
        <directionalLight position={[-10, 10, 0]} intensity={0.5} />
        <OrbitControls />
        <Suspense>
          <Physics gravity={[0, env.gravity, 0]} debug>
            <Drone />
            <ControlDrone />
            <RigidBody type='fixed' colliders={"hull"}>
              <Box position={[0, 0, 0]} args={[1000, 0.1, 1000]}>
                {/* <meshNormalMaterial /> */}
                <meshPhongMaterial />
              </Box>
            </RigidBody>
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControl>
  );
}

export default App;
