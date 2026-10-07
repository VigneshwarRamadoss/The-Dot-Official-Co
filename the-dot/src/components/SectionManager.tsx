"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

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
  const [
    activeSection,
    setActiveSection,
  ] = useState<SceneId>("hero");

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
   * Initial hash
   */
  useEffect(() => {
    if (
      typeof window === "undefined"
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

    /*
     * Old contact hash now points
     * directly to discovery call.
     */
    if (hash === "contact") {
      window.location.replace(
        "/book-a-call"
      );
    }
  }, []);

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
      targetId === activeSection
    ) {
      return;
    }

    const current =
      sceneRefs.current[
        activeSection
      ];

    const destination =
      sceneRefs.current[targetId];

    if (
      !current ||
      !destination
    ) {
      return;
    }

    /*
     * Destination always begins
     * at top.
     */
    destination.scrollTop = 0;

    const reduced =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const hash =
      targetId === "hero"
        ? "/"
        : `/#${targetId}`;

    window.history.pushState(
      null,
      "",
      hash
    );

    if (reduced) {
      gsap.set(current, {
        display: "none",
      });

      setActiveSection(
        targetId
      );

      gsap.set(destination, {
        display: "block",
        opacity: 1,
        y: 0,
      });

      return;
    }

    const tl = gsap.timeline();

    tl.to(current, {
      opacity: 0,
      y: -20,
      scale: 0.99,
      duration: 0.3,
      ease: "power2.inOut",
    });

    tl.call(() => {
      gsap.set(current, {
        display: "none",
      });

      setActiveSection(
        targetId
      );

      gsap.set(destination, {
        display: "block",
        opacity: 0,
        y: 28,
        scale: 0.99,
      });
    });

    tl.to(destination, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const scenes: {
    id: SceneId;
    node: React.ReactNode;
    theme: "light" | "dark";
  }[] = [
    {
      id: "hero",
      node: <HomeScene />,
      theme: "light",
    },
    {
      id: "services",
      node: <Services />,
      theme: "light",
    },
    {
      id: "work",
      node: <SelectedWork />,
      theme: "dark",
    },
    {
      id: "team",
      node: <Team />,
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

        bg-[#F5F5F5]
        text-[#040404]
      "
    >
      <NavigationTrigger
        isOpen={menuOpen}
        activeSection={
          activeSection
        }
        onToggle={() =>
          setMenuOpen(true)
        }
      />

      <FullscreenMenu
        isOpen={menuOpen}
        activeSection={
          activeSection
        }
        onClose={() =>
          setMenuOpen(false)
        }
        onSelectSection={
          navigateToSection
        }
      />

      {scenes.map((scene) => {
        const active =
          activeSection ===
          scene.id;

        return (
          <div
            key={scene.id}
            ref={(element) => {
              sceneRefs.current[
                scene.id
              ] = element;
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
              display: active
                ? "block"
                : "none",
            }}
            className="
              absolute
              inset-0

              h-[100svh]
              w-full

              overflow-x-hidden
              overflow-y-auto
            "
          >
            {scene.node}
          </div>
        );
      })}
    </div>
  );
}