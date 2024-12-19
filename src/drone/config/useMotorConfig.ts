import { useControls } from "leva";

const useMotorConfig = (str: "motorW" | "motorS" | "motorA" | "motorD") => {
  return useControls(
    str,
    () => ({
      speed: { value: 0, min: 0, max: 200 },
      clockwise: { value: false },
    }),
    {
      collapsed: true,
      order: 1,
    }
  );
};

export default useMotorConfig;
