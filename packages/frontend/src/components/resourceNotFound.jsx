import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });
useGLTF.preload("/wet_floor_sign.glb");

export default function ResourceNotFound() {
  return (
    <Canvas camera={{ position: [-80, 40, 20], fov: 20, zoom: 2 }}>
      <Physics debug interpolate colliders="trimesh" gravity={[0, -40, 0]} timeStep={1 / 60}>
        <BoxContainer />
        <WetFloorSign />
      </Physics>

      <Environment>
        <ambientLight intensity={1} />
        <Lightformer
          intensity={2}
          color="white"
          position={[0, 1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 1, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </Canvas>
  );
}

function WetFloorSign(props) {
  const { nodes, materials } = useGLTF("/wet_floor_sign.glb");
  const sign = useRef();
  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      sign.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
  });

  return (
    <group
      {...props}
      position={[0, 0, 0]}
      dispose={null}
      onPointerUp={(e) => drag(false)}
      onPointerDown={(e) => drag(new THREE.Vector3().copy(e.point).sub(vec.copy(sign.current.translation())))}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <RigidBody ref={sign} type={dragged ? "kinematicPosition" : "dynamic"}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Wet_floor_sign_lambert1_0.geometry}
          material={materials.lambert1}
          scale={0.1}
        />
      </RigidBody>
    </group>
  );
}

function Wall({ height, width, depth, x, y, z }) {
  return <CuboidCollider args={[width, height, depth]} position={[x, y, z]} />;
}

export function BoxContainer() {
  const { viewport } = useThree();
  const wallHeight = 25;
  return (
    <RigidBody type="fixed">
      {/* FRONT */}
      <Wall
        width={viewport.width / 2}
        height={wallHeight / 2}
        depth={2}
        x={0}
        y={wallHeight / 2 - 5}
        z={viewport.height / 2 - 2}
      />
      {/* BACK */}
      <Wall
        width={viewport.width / 2}
        height={wallHeight / 2}
        depth={2}
        x={0}
        y={wallHeight / 2 - 5}
        z={-viewport.height / 2}
      />
      {/* RIGHT */}
      <Wall
        width={2}
        height={wallHeight / 2}
        depth={viewport.height / 2}
        x={viewport.width / 2}
        y={wallHeight / 2 - 5}
        z={0}
      />
      {/* LEFT */}
      <Wall
        width={2}
        height={wallHeight / 2}
        depth={viewport.height / 2}
        x={-viewport.width / 2}
        y={wallHeight / 2 - 5}
        z={0}
      />
      {/* BOTTOM */}
      <Wall width={viewport.width / 2} height={2} depth={viewport.height / 2} x={0} y={-5} z={0} />
      {/* TOP */}
      <Wall width={viewport.width / 2} height={2} depth={viewport.height / 2} x={0} y={wallHeight - 5} z={0} />
    </RigidBody>
  );
}
