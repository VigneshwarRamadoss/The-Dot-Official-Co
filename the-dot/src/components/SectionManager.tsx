"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import { Preloader } from "./Preloader";

import { NavigationTrigger } from "./NavigationTrigger";

import { FullscreenMenu } from "./FullscreenMenu";

import { HomeScene } from "./HomeScene";
import { Services } from "./Services";
import { SelectedWork } from "./SelectedWork";
import { Team } from "./Team";

type SceneId =
  | "hero"
  | "services"
  | "work"
  | "team";

export function SectionManager() {
  /*
   * ======================================================
   * PRELOADER
   * ======================================================
   */

  const [
    preloaderComplete,
    setPreloaderComplete,
  ] = useState(false);

  /*
   * ======================================================
   * HERO → MENU HANDOFF
   * ======================================================
   *
   * This becomes true when:
   *
   * small video
   * → fullscreen video
   * → video starts reducing left
   *
   * At that exact moment the right menu
   * curve is mounted.
   */

  const [
    heroMenuReady,
    setHeroMenuReady,
  ] = useState(false);

  /*
   * ======================================================
   * SCENE STATE
   * ======================================================
   */

  const [
    activeSection,
    setActiveSection,
  ] =
    useState<SceneId>("hero");

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const sceneRefs =
    useRef<
      Record<
        SceneId,
        HTMLDivElement | null
      >
    >({
      hero: null,
      services: null,
      work: null,
      team: null,
    });

  /*
   * ======================================================
   * CALLBACKS
   * ======================================================
   */

  const handlePreloaderComplete =
    useCallback(() => {
      setPreloaderComplete(
        true
      );
    }, []);

  const handleHeroMenuReady =
    useCallback(() => {
      setHeroMenuReady(
        true
      );
    }, []);

  /*
   * ======================================================
   * INITIAL URL
   * ======================================================
   */

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const hash =
      window.location.hash.replace(
        "#",
        ""
      );

    const valid: SceneId[] = [
      "hero",
      "services",
      "work",
      "team",
    ];

    if (
      valid.includes(
        hash as SceneId
      )
    ) {
      setActiveSection(
        hash as SceneId
      );
    }

    if (
      hash === "contact"
    ) {
      window.location.replace(
        "/book-a-call"
      );
    }
  }, []);

  /*
   * ======================================================
   * SCENE NAVIGATION
   * ======================================================
   */

  const navigateToSection = (
    target: string
  ) => {
    if (
      ![
        "hero",
        "services",
        "work",
        "team",
      ].includes(target)
    ) {
      return;
    }

    const targetId =
      target as SceneId;

    if (
      targetId ===
      activeSection
    ) {
      return;
    }

    const current =
      sceneRefs.current[
        activeSection
      ];

    const destination =
      sceneRefs.current[
        targetId
      ];

    if (
      !current ||
      !destination
    ) {
      return;
    }

    destination.scrollTop = 0;

    const reduced =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const nextUrl =
      targetId === "hero"
        ? "/"
        : `/#${targetId}`;

    window.history.pushState(
      null,
      "",
      nextUrl
    );

    /*
     * ==================================================
     * REDUCED MOTION
     * ==================================================
     */

    if (reduced) {
      gsap.set(
        current,
        {
          display:
            "none",
        }
      );

      setActiveSection(
        targetId
      );

      gsap.set(
        destination,
        {
          display:
            "block",

          opacity: 1,

          y: 0,

          scale: 1,
        }
      );

      return;
    }

    /*
     * ==================================================
     * SCENE TRANSITION
     * ==================================================
     */

    const timeline =
      gsap.timeline();

    timeline.to(
      current,
      {
        opacity: 0,

        y: -20,

        scale: 0.99,

        duration: 0.3,

        ease:
          "power2.inOut",
      }
    );

    timeline.call(() => {
      gsap.set(
        current,
        {
          display:
            "none",
        }
      );

      setActiveSection(
        targetId
      );

      gsap.set(
        destination,
        {
          display:
            "block",

          opacity: 0,

          y: 28,

          scale: 0.99,
        }
      );
    });

    timeline.to(
      destination,
      {
        opacity: 1,

        y: 0,

        scale: 1,

        duration: 0.45,

        ease:
          "power3.out",
      }
    );
  };

  /*
   * ======================================================
   * HERO READINESS
   * ======================================================
   */

  const heroReady =
    preloaderComplete &&
    activeSection === "hero";

  /*
   * On other direct routes:
   * menu can appear immediately.
   *
   * On Home:
   * menu waits until Hero full-screen
   * video begins shrinking.
   */

  const navigationReady =
    preloaderComplete &&
    (
      activeSection !== "hero" ||
      heroMenuReady
    );

  /*
   * ======================================================
   * SCENES
   * ======================================================
   */

  const scenes: {
    id: SceneId;

    node: ReactNode;

    theme:
      | "light"
      | "dark";
  }[] = [
    {
      id: "hero",

      node: (
        <HomeScene
          heroReady={
            heroReady
          }

          onHeroMenuReady={
            handleHeroMenuReady
          }
        />
      ),

      theme: "light",
    },

    {
      id: "services",

      node:
        <Services />,

      theme: "light",
    },

    {
      id: "work",

      node:
        <SelectedWork />,

      theme: "light",
    },

    {
      id: "team",

      node:
        <Team />,

      theme: "light",
    },
  ];

  return (
    <div
      className="
        relative

        h-[100svh]
        w-full

        overflow-hidden

        bg-white
        text-brand
      "
    >
      {/* =================================================
          PRELOADER
         ================================================= */}

      {!preloaderComplete && (
        <Preloader
          onComplete={
            handlePreloaderComplete
          }
        />
      )}

      {/* =================================================
          RIGHT MENU
         ================================================= */}

      {navigationReady && (
        <>
          <NavigationTrigger
            isOpen={
              menuOpen
            }

            activeSection={
              activeSection
            }

            onToggle={() =>
              setMenuOpen(
                true
              )
            }
          />

          <FullscreenMenu
            isOpen={
              menuOpen
            }

            activeSection={
              activeSection
            }

            onClose={() =>
              setMenuOpen(
                false
              )
            }

            onSelectSection={
              navigateToSection
            }
          />
        </>
      )}

      {/* =================================================
          SCENES
         ================================================= */}

      {scenes.map(
        (scene) => {
          const active =
            activeSection ===
            scene.id;

          return (
            <div
              key={
                scene.id
              }

              ref={(
                element
              ) => {
                sceneRefs.current[
                  scene.id
                ] =
                  element;
              }}

              data-scene-scroll

              data-active={
                active
                  ? "true"
                  : "false"
              }

              data-cursor-theme={
                scene.theme
              }

              style={{
                display:
                  active
                    ? "block"
                    : "none",

                overflowY:
                  preloaderComplete
                    ? "auto"
                    : "hidden",

                pointerEvents:
                  preloaderComplete
                    ? "auto"
                    : "none",
              }}

              className="
                absolute
                inset-0

                h-[100svh]
                w-full

                overflow-x-hidden

                bg-white
                text-brand
              "
            >
              {
                scene.node
              }
            </div>
          );
        }
      )}
    </div>
  );
}