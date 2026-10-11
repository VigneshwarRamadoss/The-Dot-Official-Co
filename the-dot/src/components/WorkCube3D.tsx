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
   SETTINGS
   ========================================================= */

const CUBE_SIZE =
  2.72;

const HALF =
  CUBE_SIZE / 2;

const FACE_OFFSET =
  HALF + 0.004;

/*
 * Initial black cube.
 *
 * X reveals top.
 * Y reveals side.
 * Z remains 0 so it does not look
 * randomly rolled.
 */
const INTRO_X =
  -0.28;

const INTRO_Y =
  -0.52;

/*
 * Main project rotations.
 */
const ROTATION_DAMPING =
  4.2;

const INTRO_DAMPING =
  3.2;

const SETTLE_THRESHOLD =
  0.008;

/* =========================================================
   FOUR PROJECT SIDES
   ========================================================= */

const SIDE_FACES = [
  /* FRONT */

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

  /* RIGHT */

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

  /* BACK */

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

  /* LEFT */

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

/* =========================================================
   PROPS
   ========================================================= */

interface WorkCube3DProps {
  projects:
    WorkProject[];

  /*
   * Keeps increasing instead of wrapping:
   *
   * 0
   * 1
   * 2
   * 3
   * 4
   * 5...
   *
   * Therefore cube always rotates
   * horizontally in the same direction.
   */
  rotationStep:
    number;

  /*
   * true:
   * black 3-face opening.
   *
   * false:
   * clean single project face.
   */
  introMode:
    boolean;

  /*
   * Images remain invisible during
   * the black cube opening.
   */
  showImages:
    boolean;

  onSettled?: () => void;
}

/* =========================================================
   SCENE
   ========================================================= */

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

  /* =======================================================
     ENSURE FOUR PROJECT FACES
     ======================================================= */

  const faceProjects =
    useMemo(() => {
      if (
        projects.length ===
        0
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

  /* =======================================================
     TEXTURES
     ======================================================= */

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
  }, [textures]);

  /* =======================================================
     INITIAL BLACK 3-FACE POSITION
     ======================================================= */

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

  /* =======================================================
     FRAME
     ======================================================= */

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

      /* ===============================================
         TARGET ROTATION
         =============================================== */

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

      /*
       * Smooth frame-independent damping.
       */
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

      /*
       * Never introduce roll.
       */
      cube.rotation.z = 0;

      /* ===============================================
         IMAGE FADE
         =============================================== */

      const targetOpacity =
        showImages
          ? 1
          : 0;

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
              5.5,
              delta
            );
        }
      );

      /* ===============================================
         SETTLED
         =============================================== */

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
      {/* =================================================
          LIGHTING

          Important during the black opening:
          lighting separates the 3 visible planes.
         ================================================= */}

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

      {/* =================================================
          CUBE
         ================================================= */}

      <group
        ref={cubeRef}
      >
        {/* =================================================
            BLACK BODY

            This is all the user sees
            during the first second.

            Since cube begins at an angle,
            three faces are visible.
           ================================================= */}

        <mesh>
          <boxGeometry
            args={[
              CUBE_SIZE,
              CUBE_SIZE,
              CUBE_SIZE,
            ]}
          />

          <meshStandardMaterial
            color="#090909"
            roughness={0.62}
            metalness={0.04}
          />
        </mesh>

        {/* =================================================
            FOUR IMAGE PLANES

            opacity 0:
            pure black cube

            opacity 1:
            project cube
           ================================================= */}

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
                  depthWrite={false}
                  toneMapped={false}
                  side={
                    THREE.FrontSide
                  }
                />
              </mesh>
            );
          }
        )}
      </group>

      {/* =================================================
          SHADOW
         ================================================= */}

      <ContactShadows
        position={[
          0,
          -1.55,
          0,
        ]}
        opacity={0.1}
        scale={5.2}
        blur={3.2}
        far={5}
      />
    </>
  );
}

/* =========================================================
   CANVAS
   ========================================================= */

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
          7.15,
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