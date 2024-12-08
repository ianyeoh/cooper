"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Loader, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { Model } from "./model";

export default function NotFoundRender() {
    return (
        <>
            <Canvas className="canvas" camera={{ position: [-40, 110, 170] }}>
                <pointLight position={[50, -200, -200]} />
                <Suspense fallback={null}>
                    <Model />
                </Suspense>
                <Environment preset="sunset" />
                <OrbitControls
                    target={new Vector3(0, 75, 30)}
                    enablePan={false}
                />
            </Canvas>
            <Loader />
        </>
    );
}
