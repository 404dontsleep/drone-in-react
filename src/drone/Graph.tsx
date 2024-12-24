export default function Graph() {
  const [data, setData] = useState<number[][]>([[], [], [], []]);
  const [motorA] = useMotorConfig("motorA");
  const [motorD] = useMotorConfig("motorD");
  const [motorS] = useMotorConfig("motorS");
  const [motorW] = useMotorConfig("motorW");
  useFrame(() => {
    const newDataA = [...data[0], motorA.speed].slice(-100);
    const newDataD = [...data[1], motorD.speed].slice(-100);
    const newDataS = [...data[2], motorS.speed].slice(-100);
    const newDataW = [...data[3], motorW.speed].slice(-100);
    const newData = [newDataA, newDataD, newDataS, newDataW];
    setData(newData);
  });
  return (
    <>
      {/* W */}

      <group position={[-1.1, 3.1, -5]}>
        <LineChart data={data[3]} />
      </group>
      {/* D */}
      <group position={[1.1, 3.1, -5]}>
        <LineChart data={data[1]} />
      </group>
      {/* S */}
      <group position={[1.1, 1.9, -5]}>
        <LineChart data={data[2]} />
      </group>
      {/* A */}
      <group position={[-1.1, 1.9, -5]}>
        <LineChart data={data[0]} />
      </group>
    </>
  );
}
import { useRef, useEffect, useState } from "react";
import { useFrame, extend, ReactThreeFiber } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import useMotorConfig from "./config/useMotorConfig";

// Shader Material
const LineChartMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uAmplitude: 0.5,
    uFrequency: 2.0,
    uResolution: new THREE.Vector2(1, 1),
    uDataTexture: null, // For the float array
    uDataLength: 0, // Length of the data array
  },
  // Vertex Shader
  `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;

uniform float uTime;
uniform float uAmplitude;
uniform sampler2D uDataTexture; // Float array as texture
uniform float uDataLength;

void main() {
  // Normalize UVs to [0, 1]
  vec2 uv = vUv;

  // Calculate the normalized index into the data texture
  float scaledIndex = uv.x * (uDataLength - 1.0);

  // Get the integer indices of the two neighboring points
  float index1 = floor(scaledIndex);
  float index2 = ceil(scaledIndex);

  // Interpolation factor
  float t = fract(scaledIndex);

  // Sample the data from the texture
  float value1 = texture2D(uDataTexture, vec2(index1 / uDataLength, 0.5)).r;
  float value2 = texture2D(uDataTexture, vec2(index2 / uDataLength, 0.5)).r;

  // Interpolate between the two values
  float lineHeight = mix(value1, value2, t);

  // Render the line with a smooth fade
  float line = smoothstep(0.02, 0.01, abs(uv.y - lineHeight * uAmplitude));

  gl_FragColor = vec4(vec3(line), 1.0);
}

  `
);

// Register custom material
extend({ LineChartMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      lineChartMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

const createDataTexture = (data: number[]) => {
  const max = Math.max(...data);
  const normalizedData = data.map((value) => (max !== 0 ? value / max : 0));

  const size = normalizedData.length;
  const texture = new THREE.DataTexture(
    new Float32Array(normalizedData), // Normalized float data
    size, // Width
    1, // Height
    THREE.RedFormat, // Single channel
    THREE.FloatType // Float type
  );
  texture.needsUpdate = true;
  return texture;
};

// Line Chart Component
const LineChart = ({ data }: { data: number[] }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useEffect(() => {
    if (materialRef.current) {
      const texture = createDataTexture(data);
      materialRef.current.uniforms.uDataTexture.value = texture;
      materialRef.current.uniforms.uDataLength.value = data.length;
    }
  }, [data]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 1]} />
      <lineChartMaterial ref={materialRef} />
    </mesh>
  );
};
