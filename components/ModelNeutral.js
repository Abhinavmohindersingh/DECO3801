import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function ModelNeutral(props) {
  const { nodes, materials } = useGLTF(require("./flower_state_neutral.glb"));
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Stem.geometry}
        material={materials["Stem.001"]}
        position={[0, 1.455, 0.004]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Pot.geometry}
        material={materials["Pot.001"]}
        position={[0, 1.019, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Leafs.geometry}
        material={materials["Leaf.002"]}
        position={[0.111, 1.18, -3.685]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.219}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Dirt.geometry}
        material={materials["Dirt.001"]}
        position={[0, 1.019, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Bulb.geometry}
        material={materials["Bulb.001"]}
        position={[0.95, 0.156, -2.385]}
        rotation={[1.713, 0.48, -0.301]}
        scale={0.345}
      />
    </group>
  );
}

useGLTF.preload(require("./flower_state_neutral.glb"));
