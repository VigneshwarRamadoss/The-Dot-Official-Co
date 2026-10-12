"use client";
import { useCallback, useEffect, useRef, useState, } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo, } from "motion/react";
import { GrokBot, type AnimationName } from "./mascot/GrokBot";
/* =========================================================

   TEAM DATA

   ========================================================= */
const TEAM = [
    {
        name: "Rohan Varma",
        role: "Founder & Product Lead",
        image: "/images/team-01.jpg",
        description: "A small team of designers, builders and problem solvers focused on understanding the problem before designing the answer.",
        isDot: false,
    },
    {
        name: "Ananya Iyer",
        role: "Design Director",
        image: "/images/team-02.jpg",
        description: "A small team of designers, builders and problem solvers focused on understanding the problem before designing the answer.",
        isDot: false,
    },
    {
        name: "David Chen",
        role: "Strategy Director",
        image: "/images/team-03.jpg",
        description: "A small team of designers, builders and problem solvers focused on understanding the problem before designing the answer.",
        isDot: false,
    },
    {
        name: "Sarah Jenkins",
        role: "Engineering Lead",
        image: "/images/team-01.jpg",
        description: "A small team of designers, builders and problem solvers focused on understanding the problem before designing the answer.",
        isDot: false,
    },
    {
        name: "DOT",
        role: "Unofficial Team Member",
        image: null,
        description: "Resident observer, menu guide and self-appointed morale officer. Usually appears wherever the website needs a little personality.",
        isDot: true,
    },
];
const AUTO_PLAY_DELAY = 5000;
const TEAM_DOT_REACTIONS: Array<{
    thought: string;
    animation: AnimationName;
}> = [
    { thought: "Product brain activated.", animation: "curious" },
    { thought: "Design mode. The details matter now.", animation: "proud" },
    { thought: "Strategy mode. Questions before answers.", animation: "thinking" },
    { thought: "Engineering mode. Time to make it real.", animation: "playful" },
    {
        thought: "Obviously, the team's most charming member. Impeccable taste. Perfect timing.",
        animation: "excited",
    },
];
export function TeamShowcase() {
    const rootRef = useRef<HTMLDivElement>(null);
    const [activeMember, setActiveMember,] = useState(0);
    const [direction, setDirection,] = useState(1);
    const [hoveredAvatar, setHoveredAvatar,] = useState<number | null>(null);
    const [isVisible, setIsVisible,] = useState(false);
    const [isTabVisible, setIsTabVisible,] = useState(true);
    const [isInteracting, setIsInteracting,] = useState(false);
    const current = TEAM[activeMember];
    /* =======================================================
       DOT REACTION
       Keeps the selected member state inside TeamShowcase.
       NavigationTrigger only reacts to the event.
       ======================================================= */
    useEffect(() => {
        if (!isVisible) {
            return;
        }
        const reaction = TEAM_DOT_REACTIONS[activeMember % TEAM_DOT_REACTIONS.length];
        window.dispatchEvent(new CustomEvent("dot:team-member-change", {
            detail: {
                index: activeMember,
                name: current.name,
                role: current.role,
                thought: reaction.thought,
                animation: reaction.animation,
                isDot: Boolean(current.isDot),
            },
        }));
    }, [
        activeMember,
        current.name,
        current.role,
        isVisible,
    ]);
    /* =======================================================
  
       NAVIGATION
  
       ======================================================= */
    const selectMember = useCallback((index: number, navigationDirection?: number) => {
        const total = TEAM.length;
        const normalized = (index +
            total) %
            total;
        if (normalized ===
            activeMember) {
            return;
        }
        if (navigationDirection !==
            undefined) {
            setDirection(navigationDirection);
        }
        else {
            setDirection(normalized >
                activeMember
                ? 1
                : -1);
        }
        setActiveMember(normalized);
    }, [activeMember]);
    const previous = useCallback(() => {
        selectMember(activeMember - 1, -1);
    }, [
        activeMember,
        selectMember,
    ]);
    const next = useCallback(() => {
        selectMember(activeMember + 1, 1);
    }, [
        activeMember,
        selectMember,
    ]);
    /* =======================================================
  
       SECTION VISIBILITY
  
       ======================================================= */
    useEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting &&
                entry.intersectionRatio >
                    0.45);
        }, {
            threshold: [
                0,
                0.45,
                0.7,
            ],
        });
        observer.observe(root);
        return () => {
            observer.disconnect();
        };
    }, []);
    /* =======================================================
  
       TAB VISIBILITY
  
       ======================================================= */
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsTabVisible(!document.hidden);
        };
        handleVisibilityChange();
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);
    /* =======================================================
  
       AUTOPLAY
  
       ======================================================= */
    useEffect(() => {
        if (!isVisible ||
            !isTabVisible ||
            isInteracting) {
            return;
        }
        const timer = window.setTimeout(() => {
            setDirection(1);
            setActiveMember((previousIndex) => (previousIndex +
                1) %
                TEAM.length);
        }, AUTO_PLAY_DELAY);
        return () => {
            window.clearTimeout(timer);
        };
    }, [
        activeMember,
        isVisible,
        isTabVisible,
        isInteracting,
    ]);
    /* =======================================================
  
       DRAG / SWIPE
  
       ======================================================= */
    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsInteracting(false);
        if (info.offset.x <
            -70 ||
            info.velocity.x <
                -500) {
            next();
            return;
        }
        if (info.offset.x >
            70 ||
            info.velocity.x >
                500) {
            previous();
        }
    };
    /* =======================================================
  
       AVATAR DOCK MAGNIFICATION
  
       ======================================================= */
    const getAvatarScale = (index: number) => {
        if (hoveredAvatar ===
            null) {
            return index ===
                activeMember
                ? 1.15
                : 1;
        }
        const distance = Math.abs(index -
            hoveredAvatar);
        if (distance === 0) {
            return 1.32;
        }
        if (distance === 1) {
            return 1.13;
        }
        return 0.96;
    };
    const getAvatarY = (index: number) => {
        if (hoveredAvatar ===
            null) {
            return index ===
                activeMember
                ? -4
                : 0;
        }
        const distance = Math.abs(index -
            hoveredAvatar);
        if (distance === 0) {
            return -11;
        }
        if (distance === 1) {
            return -4;
        }
        return 0;
    };
    return (<div ref={rootRef} className="

        mx-auto

        grid

        h-full

        w-full

        max-w-[1440px]

        grid-rows-[auto_minmax(0,1fr)_auto]

      " onMouseEnter={() => setIsInteracting(true)} onMouseLeave={() => {
            setIsInteracting(false);
            setHoveredAvatar(null);
        }}>

      {/* =================================================
  
            HEADER
  
           ================================================= */}

      <div className="

          relative

          z-20

          pt-10

          pb-8

          md:pt-12

          md:pb-10

          lg:pt-14

          lg:pb-8

        ">

        <p className="

            font-sora

            text-[9px]

            font-semibold

            uppercase

            tracking-[0.32em]

            text-black/40

            md:text-[10px]

          ">

          Team

        </p>

        <h2 className="

            mt-2

            max-w-[560px]

            font-sora

            text-[42px]

            font-bold

            leading-[0.95]

            tracking-[-0.06em]

            text-[#171717]

            sm:text-[48px]

            md:text-[54px]

            xl:text-[58px]

          ">

          People behind

          <br />

          The Dot.

        </h2>

      </div>

      {/* =================================================
  
            MAIN PROFILE STAGE
  
           ================================================= */}

      <motion.div drag="x" dragConstraints={{
            left: 0,
            right: 0,
        }} dragElastic={0.1} onDragStart={() => setIsInteracting(true)} onDragEnd={handleDragEnd} className="

          relative

          grid

          min-h-0

          cursor-grab

          grid-cols-1

          items-center

          gap-10

          active:cursor-grabbing

          lg:grid-cols-12

          lg:gap-14

        ">

        {/* =================================================

            LEFT — PORTRAIT

            Smaller portrait.

            Shifted toward center/right.

           ================================================= */}

        <div className="

            relative

            flex

            min-h-0

            items-center

            justify-center

            lg:col-span-6

            lg:justify-end

            lg:pr-6

            xl:pr-10

            2xl:pr-14

          ">

          <div className="

              relative

              aspect-[4/5]

              w-full

              max-w-[330px]

              overflow-hidden

              rounded-[26px]

              bg-[#ECECE8]

              sm:max-w-[340px]

              lg:max-w-[350px]

              xl:max-w-[360px]

            ">

            {/* DOT rests to the left of the portrait for human members. */}
            <span data-dot-team-home aria-hidden="true" className="
                pointer-events-none
                absolute
                left-[-116px]
                top-[58%]
                z-40
                h-px
                w-px
              "/>

            {/* When DOT itself is selected it moves here and enlarges. */}
            <span data-dot-team-center aria-hidden="true" className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                z-40
                h-px
                w-px
                -translate-x-1/2
                -translate-y-1/2
              "/>

            <AnimatePresence initial={false} custom={direction} mode="popLayout">

              <motion.div key={current.name} custom={direction} initial={{
            opacity: 0,
            x: direction >
                0
                ? 55
                : -55,
            scale: 0.97,
        }} animate={{
            opacity: 1,
            x: 0,
            scale: 1,
        }} exit={{
            opacity: 0,
            x: direction >
                0
                ? -55
                : 55,
            scale: 0.97,
        }} transition={{
            duration: 0.58,
            ease: [
                0.16,
                1,
                0.3,
                1,
            ],
        }} className="

                  absolute

                  inset-0

                ">

                {current.image ? (
                  <Image src={current.image} alt={current.name} fill priority className="

                    object-cover

                  " sizes="

                    (max-width: 1024px) 90vw,

                    360px

                  "/>
                ) : (
                  <div className="absolute inset-0 bg-[#F7F7F3]" />
                )}

              </motion.div>

            </AnimatePresence>

            {/* NUMBER */}

            <div className="

                absolute

                left-4

                top-4

                z-20

                rounded-full

                bg-white/82

                px-3

                py-1.5

                font-sora

                text-[8px]

                font-semibold

                tracking-[0.14em]

                text-black/50

                backdrop-blur-md

              ">

              {String(activeMember +
            1).padStart(2, "0")}

              <span className="

                  mx-1.5

                  text-black/20

                ">

                /

              </span>

              {String(TEAM.length).padStart(2, "0")}

            </div>

          </div>

        </div>

        {/* =================================================

            RIGHT — MEMBER DETAILS

           ================================================= */}

        <div className="

            flex

            items-center

            lg:col-span-6

            lg:pl-6

            xl:pl-8

          ">

          <AnimatePresence initial={false} mode="wait">

            <motion.div key={current.name} initial={{
            opacity: 0,
            y: 16,
        }} animate={{
            opacity: 1,
            y: 0,
        }} exit={{
            opacity: 0,
            y: -10,
        }} transition={{
            duration: 0.42,
            ease: [
                0.16,
                1,
                0.3,
                1,
            ],
        }} className="

                w-full

                max-w-[470px]

              ">

              {/* LABEL */}

              <div className="

                  mb-6

                  flex

                  items-center

                  gap-4

                ">

                <span className="

                    font-sora

                    text-[9px]

                    font-semibold

                    uppercase

                    tracking-[0.18em]

                    text-black/35

                  ">

                  Selected member

                </span>

                <span className="

                    h-px

                    w-12

                    bg-black/10

                  "/>

              </div>

              {/* NAME */}

              <h3 className="

                  font-sora

                  text-[40px]

                  font-bold

                  leading-[0.92]

                  tracking-[-0.06em]

                  text-[#171717]

                  sm:text-[46px]

                  lg:text-[52px]

                  xl:text-[58px]

                ">

                {current.name}

              </h3>

              {/* ROLE */}

              <p className="

                  mt-5

                  font-sora

                  text-[14px]

                  font-medium

                  text-black/50

                  md:text-[15px]

                ">

                {current.role}

              </p>

              {/* DESCRIPTION */}

              <p className="

                  mt-8

                  max-w-[400px]

                  font-sora

                  text-[13px]

                  leading-[1.7]

                  text-black/42

                  md:text-[14px]

                ">

                {current.description}

              </p>

              {/* ARROWS */}

              <div className="

                  mt-9

                  flex

                  items-center

                  gap-3

                ">

                <button type="button" aria-label="Previous team member" onClick={() => {
            setIsInteracting(true);
            previous();
            window.setTimeout(() => setIsInteracting(false), 600);
        }} className="

                    grid

                    h-11

                    w-11

                    place-items-center

                    rounded-full

                    border

                    border-black/10

                    text-[#181818]

                    transition-all

                    duration-300

                    hover:bg-[#181818]

                    hover:text-white

                  ">

                  <svg viewBox="0 0 24 24" fill="none" className="

                      h-4

                      w-4

                    ">

                    <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>

                  </svg>

                </button>

                <button type="button" aria-label="Next team member" onClick={() => {
            setIsInteracting(true);
            next();
            window.setTimeout(() => setIsInteracting(false), 600);
        }} className="

                    grid

                    h-11

                    w-11

                    place-items-center

                    rounded-full

                    border

                    border-black/10

                    text-[#181818]

                    transition-all

                    duration-300

                    hover:bg-[#181818]

                    hover:text-white

                  ">

                  <svg viewBox="0 0 24 24" fill="none" className="

                      h-4

                      w-4

                    ">

                    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>

                  </svg>

                </button>

              </div>

            </motion.div>

          </AnimatePresence>

        </div>

      </motion.div>

      {/* =================================================
  
            AVATAR DOCK
  
            More deliberate breathing space
  
            between portrait and dock.
  
           ================================================= */}

      <div className="

          relative

          z-30

          flex

          justify-center

          pt-10

          pb-8

          md:pt-12

          md:pb-9

        ">

        <div className="

            relative

            flex

            h-[76px]

            items-end

            gap-3

            rounded-[24px]

            border

            border-black/[0.06]

            bg-white/85

            px-5

            pb-3

            shadow-[0_18px_55px_rgba(0,0,0,0.065)]

            backdrop-blur-xl

          " onMouseLeave={() => setHoveredAvatar(null)}>

          {TEAM.map((member, index) => {
            const active = index ===
                activeMember;
            return (<motion.button key={member.name} type="button" aria-label={`Select ${member.name}`} onMouseEnter={() => {
                    setHoveredAvatar(index);
                    setIsInteracting(true);
                }} onMouseLeave={() => {
                    setIsInteracting(false);
                }} onClick={() => {
                    setIsInteracting(true);
                    selectMember(index);
                    window.setTimeout(() => setIsInteracting(false), 600);
                }} animate={{
                    scale: getAvatarScale(index),
                    y: getAvatarY(index),
                }} transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    mass: 0.7,
                }} className={`

                    relative

                    h-11

                    w-11

                    shrink-0

                    overflow-hidden

                    rounded-full

                    border

                    transition-[opacity,border-color]

                    duration-300

                    md:h-12

                    md:w-12

                    ${active
                    ? `

                          border-black

                          opacity-100

                        `
                    : `

                          border-white

                          opacity-55

                          hover:opacity-100

                        `}

                  `}>

                  {member.isDot ? (
                    <span className="absolute inset-0 grid place-items-center bg-white">
                      <GrokBot
                        animation={active ? "playful" : "idle"}
                        playing
                        loop
                        size="100%"
                        className="block pointer-events-none"
                      />
                    </span>
                  ) : (
                    <Image src={member.image!} alt={member.name} fill className="

                      object-cover

                    " sizes="56px"/>
                  )}

                </motion.button>);
        })}

        </div>

      </div>

    </div>);
}
