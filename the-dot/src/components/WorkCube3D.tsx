"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Canvas,
  useFrame,
  useLoader,
} from "@react-three/fiber";

import {
  ContactShadows,
} from "@react-three/drei";

import * as THREE from "three";

import type {
  WorkProject,
} from "./WorkCard";

/* =========================================================
   CUBE

   Slightly reduced from 2.95 → 2.82.

   Camera also moved back very slightly so the cube's
   outer edges remain visible while passing through
   the diagonal rotation angles.
   ========================================================= */

const CUBE_SIZE = 2.82;

const HALF =
  CUBE_SIZE / 2;

const FACE_OFFSET =
  HALF + 0.004;

const INTRO_X =
  -0.28;

const INTRO_Y =
  -0.52;

const ROTATION_DAMPING =
  4.0;

const INTRO_DAMPING =
  3.0;

const SETTLE_THRESHOLD =
  0.008;

const SIDE_FACES = [
  {
    position: [
      0,
      0,
      FACE_OFFSET,
    ] as const,

    rotation: [
      0,
      0,
      0,
    ] as const,
  },

  {
    position: [
      FACE_OFFSET,
      0,
      0,
    ] as const,

    rotation: [
      0,
      Math.PI / 2,
      0,
    ] as const,
  },

  {
    position: [
      0,
      0,
      -FACE_OFFSET,
    ] as const,

    rotation: [
      0,
      Math.PI,
      0,
    ] as const,
  },

  {
    position: [
      -FACE_OFFSET,
      0,
      0,
    ] as const,

    rotation: [
      0,
      -Math.PI / 2,
      0,
    ] as const,
  },
];

interface WorkCube3DProps {
  projects:
    WorkProject[];

  rotationStep:
    number;

  introMode:
    boolean;

  showImages:
    boolean;

  onSettled?: () => void;
}

function CubeScene({
  projects,
  rotationStep,
  introMode,
  showImages,
  onSettled,
}: WorkCube3DProps) {
  const cubeRef =
    useRef<THREE.Group>(
      null
    );

  const bodyMaterialRef =
    useRef<
      THREE.MeshStandardMaterial | null
    >(null);

  const imageMaterialsRef =
    useRef<
      Array<
        THREE.MeshBasicMaterial | null
      >
    >([]);

  const settledRef =
    useRef(true);

  const lastTargetRef =
    useRef("");

  const faceProjects =
    useMemo(() => {
      if (
        projects.length === 0
      ) {
        return [];
      }

      return Array.from(
        {
          length: 4,
        },
        (_, index) =>
          projects[
            index %
              projects.length
          ]
      );
    }, [projects]);

  const urls =
    useMemo(
      () =>
        faceProjects.map(
          (
            project
          ) =>
            project.image
        ),
      [faceProjects]
    );

  const textures =
    useLoader(
      THREE.TextureLoader,
      urls
    );

  useEffect(() => {
    textures.forEach(
      (
        texture
      ) => {
        texture.colorSpace =
          THREE.SRGBColorSpace;

        texture.wrapS =
          THREE.ClampToEdgeWrapping;

        texture.wrapT =
          THREE.ClampToEdgeWrapping;

        texture.anisotropy =
          8;

        texture.needsUpdate =
          true;
      }
    );
  }, [
    textures,
  ]);

  useEffect(() => {
    const cube =
      cubeRef.current;

    if (!cube) {
      return;
    }

    cube.rotation.set(
      INTRO_X,
      INTRO_Y,
      0
    );
  }, []);

  useFrame(
    (
      _,
      delta
    ) => {
      const cube =
        cubeRef.current;

      if (!cube) {
        return;
      }

      const targetX =
        introMode
          ? INTRO_X
          : 0;

      const targetY =
        introMode
          ? INTRO_Y
          : -rotationStep *
            (
              Math.PI /
              2
            );

      const targetKey =
        `${introMode}-${rotationStep}`;

      if (
        targetKey !==
        lastTargetRef.current
      ) {
        lastTargetRef.current =
          targetKey;

        settledRef.current =
          false;
      }

      const damping =
        introMode
          ? INTRO_DAMPING
          : ROTATION_DAMPING;

      cube.rotation.x =
        THREE.MathUtils.damp(
          cube.rotation.x,
          targetX,
          damping,
          delta
        );

      cube.rotation.y =
        THREE.MathUtils.damp(
          cube.rotation.y,
          targetY,
          damping,
          delta
        );

      cube.rotation.z =
        0;

      const targetOpacity =
        showImages
          ? 1
          : 0;

      if (
        bodyMaterialRef.current
      ) {
        bodyMaterialRef.current.opacity =
          THREE.MathUtils.damp(
            bodyMaterialRef.current.opacity,
            targetOpacity,
            5.2,
            delta
          );
      }

      imageMaterialsRef.current.forEach(
        (
          material
        ) => {
          if (!material) {
            return;
          }

          material.opacity =
            THREE.MathUtils.damp(
              material.opacity,
              targetOpacity,
              5.2,
              delta
            );
        }
      );

      const xDifference =
        Math.abs(
          cube.rotation.x -
            targetX
        );

      const yDifference =
        Math.abs(
          cube.rotation.y -
            targetY
        );

      if (
        !introMode &&
        !settledRef.current &&
        xDifference <
          SETTLE_THRESHOLD &&
        yDifference <
          SETTLE_THRESHOLD
      ) {
        cube.rotation.x =
          targetX;

        cube.rotation.y =
          targetY;

        settledRef.current =
          true;

        onSettled?.();
      }
    }
  );

  if (
    faceProjects.length ===
    0
  ) {
    return null;
  }

  return (
    <>
      <ambientLight
        intensity={0.7}
      />

      <directionalLight
        position={[
          5,
          7,
          7,
        ]}
        intensity={1.15}
      />

      <directionalLight
        position={[
          -5,
          1,
          3,
        ]}
        intensity={0.32}
      />

      <directionalLight
        position={[
          1,
          -3,
          4,
        ]}
        intensity={0.2}
      />

      <group
        ref={cubeRef}
      >
        <mesh>
          <boxGeometry
            args={[
              CUBE_SIZE,
              CUBE_SIZE,
              CUBE_SIZE,
            ]}
          />

          <meshStandardMaterial
            ref={
              bodyMaterialRef
            }
            color="#090909"
            roughness={0.62}
            metalness={0.04}
            transparent
            opacity={0}
          />
        </mesh>

        {faceProjects.map(
          (
            project,
            index
          ) => {
            const face =
              SIDE_FACES[
                index
              ];

            return (
              <mesh
                key={`${project.slug}-${index}`}
                position={[
                  face.position[0],
                  face.position[1],
                  face.position[2],
                ]}
                rotation={[
                  face.rotation[0],
                  face.rotation[1],
                  face.rotation[2],
                ]}
              >
                <planeGeometry
                  args={[
                    CUBE_SIZE -
                      0.018,

                    CUBE_SIZE -
                      0.018,
                  ]}
                />

                <meshBasicMaterial
                  ref={(
                    material
                  ) => {
                    imageMaterialsRef.current[
                      index
                    ] =
                      material;
                  }}
                  map={
                    textures[
                      index
                    ]
                  }
                  color="#FFFFFF"
                  transparent
                  opacity={0}
                  depthWrite={
                    false
                  }
                  toneMapped={
                    false
                  }
                  side={
                    THREE.FrontSide
                  }
                />
              </mesh>
            );
          }
        )}
      </group>

      <ContactShadows
        position={[
          0,
          -1.57,
          0,
        ]}
        opacity={
          showImages
            ? 0.085
            : 0
        }
        scale={5.4}
        blur={3.4}
        far={6}
      />
    </>
  );
}

export function WorkCube3D({
  projects,
  rotationStep,
  introMode,
  showImages,
  onSettled,
}: WorkCube3DProps) {
  if (
    projects.length === 0
  ) {
    return null;
  }

  return (
    <Canvas
      dpr={[
        1,
        1.5,
      ]}
      camera={{
        position: [
          0,
          0,
          7.35,
        ],

        fov: 28,

        near: 0.1,

        far: 40,
      }}
      gl={{
        antialias: true,
        alpha: true,
      }}
      style={{
        background:
          "transparent",

        pointerEvents:
          "none",
      }}
    >
      <CubeScene
        projects={
          projects
        }
        rotationStep={
          rotationStep
        }
        introMode={
          introMode
        }
        showImages={
          showImages
        }
        onSettled={
          onSettled
        }
      />
    </Canvas>
  );
}