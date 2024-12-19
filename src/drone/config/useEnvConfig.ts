import { useControls } from "leva";

function useEnvConfig() {
  return useControls("Environment", () => ({
    gravity: { value: -9.81 },
    wing: { value: 1 },
  }));
}

export default useEnvConfig;
