import useDroneSensor from "../config/useDroneSensor";

class PIDController {
  Kp: number;
  Ki: number;
  Kd: number;
  prevError: number;
  integral: number;

  constructor(Kp: number, Ki: number, Kd: number) {
    this.Kp = Kp;
    this.Ki = Ki;
    this.Kd = Kd;
    this.prevError = 0;
    this.integral = 0;
  }

  compute(error: number, deltaTime: number): number {
    this.integral += error * deltaTime;
    const derivative = (error - this.prevError) / deltaTime;
    const output =
      this.Kp * error + this.Ki * this.integral + this.Kd * derivative;
    this.prevError = error;
    return output;
  }
}

// PID Gains for different control parameters (tuning required)
const pidThrust = new PIDController(5, 1, 1);
const yawController = new PIDController(5, 1, 1);
const pitchController = new PIDController(5, 1, 1);
const rollController = new PIDController(5, 1, 1);

const target = {
  x: 0,
  y: 3,
  z: 0,
};
function calculateControlOutput(
  deltaTime: number,
  sensor: ReturnType<typeof useDroneSensor>["0"]
) {
  const altitudeError = (target.y - sensor.position.y) * 30;
  let thrustOutput = pidThrust.compute(altitudeError, deltaTime);
  thrustOutput = Math.min(Math.max(thrustOutput, 0), 200);

  const yawError = -sensor.rotation.yaw * 30;
  let yawOutput = yawController.compute(yawError, deltaTime);
  yawOutput = Math.min(Math.max(yawOutput, -20), 20);

  const pitchError = -sensor.rotation.pitch * 30;
  let pitchOutput = pitchController.compute(pitchError, deltaTime);
  pitchOutput = Math.min(Math.max(pitchOutput, -20), 20);

  const rollError = -sensor.rotation.roll * 30;
  let rollOutput = rollController.compute(rollError, deltaTime);
  rollOutput = Math.min(Math.max(rollOutput, -20), 20);

  // yawOutput = 0;
  // pitchOutput = 0;
  // rollOutput = 0;
  // thrustOutput = 0;
  return {
    thrustOutput,
    yawOutput,
    pitchOutput,
    rollOutput,
  };
}
export { calculateControlOutput };
