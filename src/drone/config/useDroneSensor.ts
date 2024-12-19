import { useControls } from "leva";

const useDroneSensor = () => {
  return useControls("DroneSensor", () => ({
    position: {
      value: { x: 0, y: 0, z: 0 },
    },
    rotation: {
      value: { yaw: 0, pitch: 0, roll: 0 },
    },
    velocity: {
      value: { x: 0, y: 0, z: 0 },
    },
    acceleration: {
      value: { x: 0, y: 0, z: 0 },
    },
  }));
};

export default useDroneSensor;
