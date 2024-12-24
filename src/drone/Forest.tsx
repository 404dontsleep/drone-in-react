import { Gltf, Sparkles } from "@react-three/drei";

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group
      scale={[0.01, 0.01, 0.01]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
    >
      <Gltf src={"/12151_Christmas_Tree_l1.gltf"} />
      <Sparkles
        count={10}
        size={5}
        scale={[100, 1, 200]}
        noise={[50, 50, 5]}
        position={[0, 0, 100]}
        color={"red"}
      />
    </group>
  );
}

export default function Forest() {
  const gridSize = 6;
  const spacing = 2; // Distance between trees

  // Generate a 5x5 grid of positions
  const positions = Array.from({ length: gridSize }, (_, x) =>
    Array.from(
      { length: gridSize },
      (_, z) =>
        [x * spacing - 5, 0, z * spacing - 5] as [number, number, number]
    )
  ).flat();

  return (
    <group>
      {positions.map((position, index) => (
        <Tree key={index} position={position} />
      ))}
    </group>
  );
}
