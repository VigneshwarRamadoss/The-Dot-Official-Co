"use client";

import {
  Suspense,
  useMemo,
  useRef,
} from "react";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  ContactShadows,
  useGLTF,
} from "@react-three/drei";

import * as THREE from "three";

export type RobotMode =
  | "intro"
  | "story-1"
  | "story-2"
  | "story-3"
  | "exit";

interface RobotScene3DProps {
  mode: RobotMode;
}

/* =========================================================
   ROBOT
   ========================================================= */

function RobotModel({
  mode,
}: {
  mode: RobotMode;
}) {
  const groupRef =
    useRef<THREE.Group>(null);

  const { scene } =
    useGLTF(
      "/about/robot/robot.glb"
    );

  /*
   * =======================================================
   * NORMALIZE THE GLB
   * =======================================================
   *
   * Previously the model was manually scaled to 1.75.
   *
   * That made the robot much larger than the camera view.
   *
   * Now we:
   *
   * 1. clone the GLB
   * 2. measure it
   * 3. centre it
   * 4. automatically scale it to a predictable height
   *
   * This works even if the GLB dimensions change later.
   */

  const normalizedModel =
    useMemo(() => {
      const object =
        scene.clone(true);

      object.updateMatrixWorld(
        true
      );

      /*
       * Enable shadows.
       */

      object.traverse(
        (child) => {
          if (
            child instanceof
            THREE.Mesh
          ) {
            child.castShadow =
              true;

            child.receiveShadow =
              true;

            /*
             * Clone materials so we're not
             * mutating useGLTF's cached model.
             */

            if (
              Array.isArray(
                child.material
              )
            ) {
              child.material =
                child.material.map(
                  (material) =>
                    material.clone()
                );
            } else {
              child.material =
                child.material.clone();
            }
          }
        }
      );

      /*
       * Measure model.
       */

      const box =
        new THREE.Box3().setFromObject(
          object
        );

      const size =
        new THREE.Vector3();

      const center =
        new THREE.Vector3();

      box.getSize(size);
      box.getCenter(center);

      /*
       * Centre model around its own origin.
       */

      object.position.set(
        -center.x,
        -center.y,
        -center.z
      );

      /*
       * Desired visible robot height
       * in Three.js world units.
       */

      const targetHeight =
        3.15;

      const safeHeight =
        Math.max(
          size.y,
          0.001
        );

      const scale =
        targetHeight /
        safeHeight;

      return {
        object,
        scale,
      };
    }, [scene]);

  /* =======================================================
     ALIVE MOTION
     ======================================================= */

  useFrame(
    (
      state,
      delta
    ) => {
      const group =
        groupRef.current;

      if (!group) {
        return;
      }

      const time =
        state.clock.getElapsedTime();

      /*
       * Small continuous breathing / weight shift.
       *
       * Very subtle.
       */

      const idleY =
        Math.sin(
          time * 1.45
        ) * 0.025;

      const idleZ =
        Math.sin(
          time * 1.15
        ) * 0.012;

      const idleX =
        Math.cos(
          time * 1.3
        ) * 0.008;

      /*
       * ===================================================
       * STORY POSES
       * ===================================================
       */

      let targetX = 0;
      let targetY = 0;

      let targetRotationY =
        0;

      let scaleMultiplier =
        1;

      switch (mode) {
  /*
   * Facing visitor.
   */
  case "intro":
    targetRotationY = 0;
    targetY = 0;
    break;

  /*
   * Robot sits on left and looks
   * toward the right-side content.
   */
  case "story-1":
    targetRotationY = 0.42;
    targetY = 0;
    break;

  /*
   * Tiny posture change.
   */
  case "story-2":
    targetRotationY = 0.3;
    targetX = 0.025;
    targetY = -0.015;
    break;

  /*
   * Another subtle reaction.
   */
  case "story-3":
    targetRotationY = 0.5;
    targetX = -0.02;
    targetY = 0.01;
    break;

  /*
   * Turn away for goodbye.
   */
  case "exit":
    targetRotationY = -Math.PI;
    targetY = 0;
    scaleMultiplier = 0.98;
    break;
}

      /*
       * Frame-rate independent smoothing.
       */

      const smoothing =
        1 -
        Math.pow(
          0.0008,
          delta
        );

      group.position.x =
        THREE.MathUtils.lerp(
          group.position.x,
          targetX,
          smoothing
        );

      group.position.y =
        THREE.MathUtils.lerp(
          group.position.y,
          targetY +
            idleY,
          smoothing
        );

      group.rotation.y =
        THREE.MathUtils.lerp(
          group.rotation.y,
          targetRotationY,
          smoothing
        );

      group.rotation.z =
        THREE.MathUtils.lerp(
          group.rotation.z,
          idleZ,
          smoothing
        );

      group.rotation.x =
        THREE.MathUtils.lerp(
          group.rotation.x,
          idleX,
          smoothing
        );

      const targetScale =
        normalizedModel.scale *
        scaleMultiplier;

      group.scale.x =
        THREE.MathUtils.lerp(
          group.scale.x,
          targetScale,
          smoothing
        );

      group.scale.y =
        THREE.MathUtils.lerp(
          group.scale.y,
          targetScale,
          smoothing
        );

      group.scale.z =
        THREE.MathUtils.lerp(
          group.scale.z,
          targetScale,
          smoothing
        );
    }
  );

  return (
    <group
      ref={groupRef}
    >
      <primitive
        object={
          normalizedModel.object
        }
      />
    </group>
  );
}

/* =========================================================
   CANVAS
   ========================================================= */

export function RobotScene3D({
  mode,
}: RobotScene3DProps) {
  return (
    <div
      className="
        relative
        h-full
        w-full
      "
    >
      {/*
        IMPORTANT:

        No <Html> inside Suspense.

        That was creating the React root/unmount race
        visible in your error screenshot.
      */}

      <Canvas
        shadows

        dpr={[
          1,
          1.5,
        ]}

        camera={{
          position: [
            0,
            0.05,
            7,
          ],

          fov: 30,

          near: 0.1,

          far: 100,
        }}

        gl={{
          antialias: true,
          alpha: true,

          powerPreference:
            "high-performance",
        }}

        style={{
          background:
            "transparent",
        }}
      >
        <Suspense
          fallback={null}
        >
          {/* =============================================
              LIGHTING
             ============================================= */}

          <hemisphereLight
            args={[
              "#ffffff",
              "#e8e4e2",
              2.1,
            ]}
          />

          <directionalLight
            position={[
              4,
              6,
              5,
            ]}
            intensity={
              3
            }
            castShadow
          />

          <directionalLight
            position={[
              -4,
              2,
              3,
            ]}
            intensity={
              1.15
            }
          />

          {/*
            Warm rim light works with the
            robot's brown / rose accents.
          */}

          <pointLight
            position={[
              -3,
              2,
              -2,
            ]}
            intensity={
              1.5
            }
            color="#C89588"
          />

          <pointLight
            position={[
              3,
              1,
              2,
            ]}
            intensity={
              0.75
            }
            color="#FFFFFF"
          />

          {/* ROBOT */}

          <RobotModel
            mode={mode}
          />

          {/* FLOOR SHADOW */}

          <ContactShadows
            position={[
              0,
              -1.62,
              0,
            ]}

            opacity={
              0.16
            }

            scale={4}

            blur={2.6}

            far={4}

            color="#181818"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

/*
 * Load early once browser is ready.
 */

useGLTF.preload(
  "/about/robot/robot.glb"
);