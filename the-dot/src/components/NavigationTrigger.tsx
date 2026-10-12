"use client";
import { useCallback, useEffect, useRef, useState, } from "react";
import gsap from "gsap";
import { EdgeCurve, EDGE_CURVE_WIDTH, } from "./EdgeCurve";
import { GrokBot, type AnimationName, } from "./mascot/GrokBot";
interface NavigationTriggerProps {
    isOpen: boolean;
    activeSection: string;
    onToggle: () => void;
    routeMode?: "default" | "contact-form";
}
const MORPH_DURATION = 1.05;
const MORPH_EASE = "power3.inOut";
const COLLAPSED_SCALE_X = 0.018;
const WORK_HIDE_X = EDGE_CURVE_WIDTH + 24;
const DOT_SIZE = 56;
const DOT_MESSAGE_DELAY = 900;
const DOT_MESSAGE_DURATION = 2800;
const DOT_IDLE_DELAY = 10000;
const DOT_DROWSY_DURATION = 2500;
const DOT_WAKE_DURATION = 1400;
const SERVICE_THOUGHT_DELAY = 680;
const SERVICE_THOUGHT_DURATION = 2400;
const WORK_THOUGHT_DURATION = 2600;
const TEAM_THOUGHT_DURATION = 2800;
const TEAM_DOT_REST_SCALE = 1.12;
const TEAM_DOT_SELF_SCALE = 2.35;
const CONTACT_THOUGHT_DURATION = 3200;
export function NavigationTrigger({ isOpen, activeSection, onToggle, routeMode = "default", }: NavigationTriggerProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const curveWrapperRef = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLSpanElement>(null);
    const scrollerRef = useRef<HTMLElement | null>(null);
    const collapsedRef = useRef(false);
    const animatingRef = useRef(false);
    const workModeRef = useRef(false);
    const workHiddenRef = useRef(false);
    const [pressed, setPressed,] = useState(false);
    /* =========================================================
       NAV DOT
       ========================================================= */
    const [dotAnimation, setDotAnimation,] = useState<AnimationName>("idle");
    const dotAnimationRef = useRef<AnimationName>("idle");
    useEffect(() => {
        dotAnimationRef.current =
            dotAnimation;
    }, [dotAnimation]);
    const [showDotMessage, setShowDotMessage,] = useState(false);
    const dotMessageDelayRef = useRef<number | null>(null);
    const dotMessageHideRef = useRef<number | null>(null);
    const dotIdleTimerRef = useRef<number | null>(null);
    const dotSleepTimerRef = useRef<number | null>(null);
    const dotWakeTimerRef = useRef<number | null>(null);
    /* =========================================================
       SERVICES DOT
       ========================================================= */
    const serviceDotRef = useRef<HTMLDivElement>(null);
    const serviceDotAvatarRef = useRef<HTMLSpanElement>(null);
    const serviceDotExploreRef = useRef(false);
    const serviceDotDockedRef = useRef(false);
    const serviceDotTransitioningRef = useRef(false);
    const serviceDotHasLandedRef = useRef(false);
    const serviceDotReactionTimerRef = useRef<number | null>(null);
    const serviceDotThoughtHideRef = useRef<number | null>(null);
    const serviceDotLatestThoughtRef = useRef("Smooth clicks. Happy humans.");
    const serviceDotLatestAnimationRef = useRef<AnimationName>("excited");
    const [serviceDotVisible, setServiceDotVisible,] = useState(false);
    const [serviceDotDocked, setServiceDotDocked,] = useState(false);
    const [serviceDotAnimation, setServiceDotAnimation,] = useState<AnimationName>("excited");
    const [serviceDotThought, setServiceDotThought,] = useState("");
    const [serviceDotAtExplore, setServiceDotAtExplore,] = useState(false);
    /* =========================================================
       WORK DOT
       ========================================================= */
    const workDotRef = useRef<HTMLDivElement>(null);
    const workDotAvatarRef = useRef<HTMLSpanElement>(null);
    const workDotDockedRef = useRef(false);
    const workDotTransitioningRef = useRef(false);
    const workDotIntroPlayedRef = useRef(false);
    const workDotIntroTimerRef = useRef<number | null>(null);
    const workDotThoughtTimerRef = useRef<number | null>(null);
    const [workDotVisible, setWorkDotVisible,] = useState(false);
    const [workDotDocked, setWorkDotDocked,] = useState(false);
    const [workDotAnimation, setWorkDotAnimation,] = useState<AnimationName>("excited");
    const [workDotThought, setWorkDotThought,] = useState("");
    /* =========================================================
       TEAM DOT
       ========================================================= */
    const teamDotRef = useRef<HTMLDivElement>(null);
    const teamDotAvatarRef = useRef<HTMLSpanElement>(null);
    const teamDotDockedRef = useRef(false);
    const teamDotTransitioningRef = useRef(false);
    const teamDotThoughtTimerRef = useRef<number | null>(null);
    const teamDotLatestThoughtRef = useRef("Product brain activated.");
    const teamDotLatestAnimationRef = useRef<AnimationName>("curious");
    const teamDotSelfSelectedRef = useRef(false);
    const [teamDotVisible, setTeamDotVisible,] = useState(false);
    const [teamDotDocked, setTeamDotDocked,] = useState(false);
    const [teamDotAnimation, setTeamDotAnimation,] = useState<AnimationName>("curious");
    const [teamDotThought, setTeamDotThought,] = useState("");
    const [teamDotSelfSelected, setTeamDotSelfSelected,] = useState(false);
    /* =========================================================
       CONTACT FORM DOT
       ========================================================= */
    const contactMode = routeMode === "contact-form";
    const contactDotRef = useRef<HTMLDivElement>(null);
    const contactDotAvatarRef = useRef<HTMLSpanElement>(null);
    const contactDotDockedRef = useRef(false);
    const contactDotTransitioningRef = useRef(false);
    const contactDotThoughtTimerRef = useRef<number | null>(null);
    const contactDotTargetRef = useRef("[data-dot-contact-home]");
    const contactDotLatestThoughtRef = useRef("Tell me what you're trying to build.");
    const contactDotLatestAnimationRef = useRef<AnimationName>("curious");
    const [contactDotVisible, setContactDotVisible] = useState(false);
    const [contactDotDocked, setContactDotDocked] = useState(false);
    const [contactDotAnimation, setContactDotAnimation] = useState<AnimationName>("curious");
    const [contactDotThought, setContactDotThought] = useState("");

    /* =========================================================
       NAV HELPERS
       ========================================================= */
    const clearDotTimers = useCallback(() => {
        if (dotMessageDelayRef.current !==
            null) {
            window.clearTimeout(dotMessageDelayRef.current);
            dotMessageDelayRef.current =
                null;
        }
        if (dotMessageHideRef.current !==
            null) {
            window.clearTimeout(dotMessageHideRef.current);
            dotMessageHideRef.current =
                null;
        }
    }, []);
    const hideDotMessage = useCallback(() => {
        if (dotMessageHideRef.current !==
            null) {
            window.clearTimeout(dotMessageHideRef.current);
            dotMessageHideRef.current =
                null;
        }
        setShowDotMessage(false);
        setDotAnimation("idle");
    }, []);
    const revealDotMessage = useCallback(() => {
        if (activeSection !==
            "hero" ||
            isOpen) {
            return;
        }
        const scroller = document.querySelector<HTMLElement>('[data-scene-scroll][data-active="true"]');
        if (scroller &&
            scroller.scrollTop >
                20) {
            return;
        }
        if (dotMessageHideRef.current !==
            null) {
            window.clearTimeout(dotMessageHideRef.current);
        }
        setDotAnimation("playful");
        setShowDotMessage(true);
        dotMessageHideRef.current =
            window.setTimeout(() => {
                setShowDotMessage(false);
                setDotAnimation("idle");
                dotMessageHideRef.current =
                    null;
            }, DOT_MESSAGE_DURATION);
    }, [
        activeSection,
        isOpen,
    ]);
    /* =========================================================
       CURVE
       ========================================================= */
    const expandCurve = useCallback((immediate = false) => {
        const curve = curveWrapperRef.current;
        const hamburger = hamburgerRef.current;
        if (!curve ||
            !hamburger) {
            return;
        }
        collapsedRef.current =
            false;
        gsap.killTweensOf([
            curve,
            hamburger,
        ]);
        if (immediate) {
            gsap.set(curve, {
                scaleX: 1,
            });
            gsap.set(hamburger, {
                opacity: 1,
                scale: 1,
                x: 0,
            });
            return;
        }
        animatingRef.current =
            true;
        const timeline = gsap.timeline({
            onComplete: () => {
                animatingRef.current =
                    false;
            },
        });
        timeline.to(curve, {
            scaleX: 1,
            duration: MORPH_DURATION,
            ease: MORPH_EASE,
            overwrite: "auto",
        });
        timeline.to(hamburger, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.32,
            ease: "power2.out",
        }, "-=0.38");
    }, []);
    const collapseCurve = useCallback((immediate = false) => {
        const curve = curveWrapperRef.current;
        const hamburger = hamburgerRef.current;
        if (!curve ||
            !hamburger) {
            return;
        }
        collapsedRef.current =
            true;
        gsap.killTweensOf([
            curve,
            hamburger,
        ]);
        if (immediate) {
            gsap.set(hamburger, {
                opacity: 0,
                scale: 0.82,
                x: 8,
            });
            gsap.set(curve, {
                scaleX: COLLAPSED_SCALE_X,
            });
            return;
        }
        animatingRef.current =
            true;
        const timeline = gsap.timeline({
            onComplete: () => {
                animatingRef.current =
                    false;
            },
        });
        timeline.to(hamburger, {
            opacity: 0,
            scale: 0.82,
            x: 8,
            duration: 0.22,
            ease: "power2.in",
        });
        timeline.to(curve, {
            scaleX: COLLAPSED_SCALE_X,
            duration: MORPH_DURATION,
            ease: MORPH_EASE,
            overwrite: "auto",
        }, "-=0.08");
    }, []);
    /* =========================================================
       ORIGINAL WORK FALLBACK
       ========================================================= */
    const hideForWork = useCallback((immediate = false) => {
        const button = buttonRef.current;
        const curve = curveWrapperRef.current;
        const hamburger = hamburgerRef.current;
        if (!button ||
            !curve ||
            !hamburger) {
            return;
        }
        if (workHiddenRef.current) {
            return;
        }
        workHiddenRef.current =
            true;
        collapsedRef.current =
            true;
        gsap.killTweensOf([
            button,
            curve,
            hamburger,
        ]);
        if (immediate) {
            gsap.set(hamburger, {
                opacity: 0,
                scale: 0.82,
                x: 8,
            });
            gsap.set(curve, {
                scaleX: COLLAPSED_SCALE_X,
            });
            gsap.set(button, {
                x: WORK_HIDE_X,
            });
            return;
        }
        animatingRef.current =
            true;
        const timeline = gsap.timeline({
            onComplete: () => {
                animatingRef.current =
                    false;
            },
        });
        timeline.to(hamburger, {
            opacity: 0,
            scale: 0.82,
            x: 8,
            duration: 0.18,
            ease: "power2.in",
        }, 0);
        timeline.to(curve, {
            scaleX: COLLAPSED_SCALE_X,
            duration: 0.68,
            ease: "power3.inOut",
        }, 0.03);
        timeline.to(button, {
            x: WORK_HIDE_X,
            duration: 0.68,
            ease: "power3.inOut",
            overwrite: "auto",
        }, 0.2);
    }, []);
    const revealForWork = useCallback((immediate = false) => {
        const button = buttonRef.current;
        const curve = curveWrapperRef.current;
        const hamburger = hamburgerRef.current;
        if (!button ||
            !curve ||
            !hamburger) {
            return;
        }
        workHiddenRef.current =
            false;
        collapsedRef.current =
            false;
        gsap.killTweensOf([
            button,
            curve,
            hamburger,
        ]);
        if (immediate) {
            gsap.set(button, {
                x: 0,
            });
            gsap.set(curve, {
                scaleX: 1,
            });
            gsap.set(hamburger, {
                opacity: 1,
                scale: 1,
                x: 0,
            });
            return;
        }
        animatingRef.current =
            true;
        const timeline = gsap.timeline({
            onComplete: () => {
                animatingRef.current =
                    false;
            },
        });
        timeline.to(button, {
            x: 0,
            duration: 0.62,
            ease: "power3.out",
            overwrite: "auto",
        });
        timeline.to(curve, {
            scaleX: 1,
            duration: 0.82,
            ease: MORPH_EASE,
        }, 0.12);
        timeline.to(hamburger, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.3,
            ease: "power2.out",
        }, 0.54);
    }, []);
    const isInsideWork = useCallback((scroller: HTMLElement) => {
        const work = document.getElementById("work");
        if (!work) {
            return false;
        }
        const rootRect = scroller.getBoundingClientRect();
        const workRect = work.getBoundingClientRect();
        const probe = rootRect.top +
            rootRect.height *
                0.43;
        return (workRect.top <=
            probe &&
            workRect.bottom >=
                probe);
    }, []);
    /* =========================================================
       SERVICE HELPERS
       ========================================================= */
    const clearServiceDotTimers = useCallback(() => {
        if (serviceDotReactionTimerRef.current !==
            null) {
            window.clearTimeout(serviceDotReactionTimerRef.current);
            serviceDotReactionTimerRef.current =
                null;
        }
        if (serviceDotThoughtHideRef.current !==
            null) {
            window.clearTimeout(serviceDotThoughtHideRef.current);
            serviceDotThoughtHideRef.current =
                null;
        }
    }, []);
    const showCurrentServiceThought = useCallback(() => {
        clearServiceDotTimers();
        setServiceDotAnimation(serviceDotLatestAnimationRef.current);
        setServiceDotThought(serviceDotLatestThoughtRef.current);
        serviceDotThoughtHideRef.current =
            window.setTimeout(() => {
                if (serviceDotExploreRef.current ||
                    serviceDotDockedRef.current) {
                    return;
                }
                setServiceDotThought("");
                setServiceDotAnimation("idle");
                serviceDotThoughtHideRef.current =
                    null;
            }, SERVICE_THOUGHT_DURATION);
    }, [
        clearServiceDotTimers,
    ]);
    const moveServiceDotTo = useCallback((selector: string, duration = 1.25) => {
        const dot = serviceDotRef.current;
        const target = document.querySelector<HTMLElement>(selector);
        if (!dot ||
            !target) {
            return;
        }
        const rect = target.getBoundingClientRect();
        gsap.to(dot, {
            x: rect.left +
                rect.width /
                    2 -
                DOT_SIZE /
                    2,
            y: rect.top +
                rect.height /
                    2 -
                DOT_SIZE /
                    2,
            scale: 1,
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
        });
    }, []);
    const launchServiceDotFromNav = useCallback((duration = 1.15) => {
        const dot = serviceDotRef.current;
        const avatar = serviceDotAvatarRef.current;
        const target = document.querySelector<HTMLElement>("[data-dot-services-home]");
        if (!dot ||
            !avatar ||
            !target) {
            return;
        }
        clearServiceDotTimers();
        serviceDotExploreRef.current =
            false;
        serviceDotDockedRef.current =
            false;
        serviceDotTransitioningRef.current =
            true;
        serviceDotHasLandedRef.current =
            false;
        setServiceDotDocked(false);
        setServiceDotVisible(true);
        setServiceDotAtExplore(false);
        setServiceDotThought("");
        setServiceDotAnimation("excited");
        const source = hamburgerRef.current?.getBoundingClientRect();
        const sourceX = source
            ? source.left +
                source.width /
                    2 -
                DOT_SIZE /
                    2
            : window.innerWidth -
                46 -
                DOT_SIZE /
                    2;
        const sourceY = source
            ? source.top +
                source.height /
                    2 -
                DOT_SIZE /
                    2
            : window.innerHeight /
                2 -
                DOT_SIZE /
                    2;
        const targetRect = target.getBoundingClientRect();
        const targetX = targetRect.left +
            targetRect.width /
                2 -
            DOT_SIZE /
                2;
        const targetY = targetRect.top +
            targetRect.height /
                2 -
            DOT_SIZE /
                2;
        gsap.killTweensOf([
            dot,
            avatar,
        ]);
        gsap.set(dot, {
            x: sourceX,
            y: sourceY,
            opacity: 1,
            scale: 0.9,
        });
        gsap.set(avatar, {
            filter: "invert(1)",
        });
        collapseCurve(false);
        const timeline = gsap.timeline({
            onComplete: () => {
                serviceDotTransitioningRef.current =
                    false;
                serviceDotHasLandedRef.current =
                    true;
                showCurrentServiceThought();
            },
        });
        timeline.to(dot, {
            y: sourceY -
                26,
            scale: 1.03,
            duration: 0.28,
            ease: "power2.out",
        });
        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 1,
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
        }, "-=0.08");
        timeline.to(avatar, {
            filter: "invert(0)",
            duration: Math.max(0.85, duration *
                0.9),
            ease: "power1.inOut",
        }, "<");
    }, [
        clearServiceDotTimers,
        collapseCurve,
        showCurrentServiceThought,
    ]);
    const dockServiceDotIntoNav = useCallback(() => {
        if (activeSection !==
            "services" ||
            serviceDotDockedRef.current ||
            serviceDotTransitioningRef.current ||
            serviceDotExploreRef.current) {
            return;
        }
        const dot = serviceDotRef.current;
        const avatar = serviceDotAvatarRef.current;
        const destination = hamburgerRef.current?.getBoundingClientRect();
        if (!dot ||
            !avatar ||
            !destination) {
            return;
        }
        clearServiceDotTimers();
        serviceDotTransitioningRef.current =
            true;
        setServiceDotThought("");
        setServiceDotAtExplore(false);
        setServiceDotAnimation("curious");
        expandCurve(false);
        const targetX = destination.left +
            destination.width /
                2 -
            DOT_SIZE /
                2;
        const targetY = destination.top +
            destination.height /
                2 -
            DOT_SIZE /
                2;
        gsap.killTweensOf([
            dot,
            avatar,
        ]);
        const timeline = gsap.timeline({
            onComplete: () => {
                serviceDotTransitioningRef.current =
                    false;
                serviceDotDockedRef.current =
                    true;
                setServiceDotDocked(true);
                setServiceDotVisible(false);
            },
        });
        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 0.92,
            duration: 1.25,
            ease: "power2.inOut",
            overwrite: "auto",
        });
        timeline.to(avatar, {
            filter: "invert(1)",
            duration: 1.1,
            ease: "power1.inOut",
        }, "<");
    }, [
        activeSection,
        clearServiceDotTimers,
        expandCurve,
    ]);
    /* =========================================================
       WORK HELPERS
       ========================================================= */
    const clearWorkTimers = useCallback(() => {
        if (workDotIntroTimerRef.current !==
            null) {
            window.clearTimeout(workDotIntroTimerRef.current);
            workDotIntroTimerRef.current =
                null;
        }
        if (workDotThoughtTimerRef.current !==
            null) {
            window.clearTimeout(workDotThoughtTimerRef.current);
            workDotThoughtTimerRef.current =
                null;
        }
    }, []);
    const setWorkDockState = useCallback((docked: boolean) => {
        workDotDockedRef.current =
            docked;
        setWorkDotDocked(docked);
        window.dispatchEvent(new CustomEvent("dot:work-docked-state", {
            detail: {
                docked,
            },
        }));
    }, []);
    /* =========================================================
       WORK FIRST ENTRY
       ========================================================= */
    const launchWorkIntro = useCallback(() => {
        if (workDotIntroPlayedRef.current) {
            return;
        }
        const dot = workDotRef.current;
        const avatar = workDotAvatarRef.current;
        const home = document.querySelector<HTMLElement>("[data-dot-work-home]");
        if (!dot ||
            !avatar ||
            !home) {
            return;
        }
        workDotIntroPlayedRef.current =
            true;
        workDotTransitioningRef.current =
            true;
        setWorkDockState(false);
        clearWorkTimers();
        setWorkDotVisible(true);
        setWorkDotThought("");
        setWorkDotAnimation("excited");
        const source = hamburgerRef.current?.getBoundingClientRect();
        const sourceX = source
            ? source.left +
                source.width /
                    2 -
                DOT_SIZE /
                    2
            : window.innerWidth -
                46 -
                DOT_SIZE /
                    2;
        const sourceY = source
            ? source.top +
                source.height /
                    2 -
                DOT_SIZE /
                    2
            : window.innerHeight /
                2 -
                DOT_SIZE /
                    2;
        const centreX = window.innerWidth /
            2 -
            DOT_SIZE /
                2;
        const centreY = window.innerHeight /
            2 -
            DOT_SIZE /
                2;
        const homeRect = home.getBoundingClientRect();
        const homeX = homeRect.left +
            homeRect.width /
                2 -
            DOT_SIZE /
                2;
        const homeY = homeRect.top +
            homeRect.height /
                2 -
            DOT_SIZE /
                2;
        gsap.killTweensOf([
            dot,
            avatar,
        ]);
        gsap.set(dot, {
            x: sourceX,
            y: sourceY,
            opacity: 1,
            scale: 0.9,
        });
        gsap.set(avatar, {
            filter: "invert(1)",
            scale: 1,
            transformOrigin: "center center",
        });
        collapseCurve(false);
        const timeline = gsap.timeline({
            onComplete: () => {
                workDotTransitioningRef.current =
                    false;
                setWorkDotAnimation("playful");
                window.dispatchEvent(new Event("dot:work-header-show"));
                workDotIntroTimerRef.current =
                    window.setTimeout(() => {
                        window.dispatchEvent(new Event("dot:work-intro-pull"));
                        workDotIntroTimerRef.current =
                            null;
                    }, 1000);
            },
        });
        timeline.to(dot, {
            x: centreX,
            y: centreY,
            scale: 1.55,
            duration: 0.82,
            ease: "power3.out",
            overwrite: "auto",
        });
        timeline.to(avatar, {
            filter: "invert(0)",
            duration: 0.72,
            ease: "power1.inOut",
        }, "<");
        timeline.to(dot, {
            scale: 1.62,
            duration: 0.24,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
        });
        timeline.to(dot, {
            x: homeX,
            y: homeY,
            scale: 1.04,
            duration: 0.78,
            ease: "power3.inOut",
            overwrite: "auto",
        });
        timeline.to(avatar, {
            scale: 0.78,
            duration: 0.78,
            ease: "power3.inOut",
        }, "<");
    }, [
        clearWorkTimers,
        collapseCurve,
        setWorkDockState,
    ]);
    /* =========================================================
       WORK → NAV
       ========================================================= */
    const dockWorkDotIntoNav = useCallback(() => {
        if (activeSection !==
            "work" ||
            workDotDockedRef.current ||
            workDotTransitioningRef.current) {
            return;
        }
        const dot = workDotRef.current;
        const avatar = workDotAvatarRef.current;
        const destination = hamburgerRef.current?.getBoundingClientRect();
        if (!dot ||
            !avatar ||
            !destination) {
            return;
        }
        clearWorkTimers();
        workDotTransitioningRef.current =
            true;
        setWorkDotThought("");
        setWorkDotAnimation("curious");
        expandCurve(false);
        const targetX = destination.left +
            destination.width /
                2 -
            DOT_SIZE /
                2;
        const targetY = destination.top +
            destination.height /
                2 -
            DOT_SIZE /
                2;
        gsap.killTweensOf([
            dot,
            avatar,
        ]);
        const timeline = gsap.timeline({
            onComplete: () => {
                workDotTransitioningRef.current =
                    false;
                setWorkDockState(true);
                setWorkDotVisible(false);
                setWorkDotAnimation("idle");
            },
        });
        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 0.92,
            duration: 1.2,
            ease: "power2.inOut",
            overwrite: "auto",
        });
        timeline.to(avatar, {
            filter: "invert(1)",
            scale: 1,
            duration: 1.05,
            ease: "power1.inOut",
        }, "<");
    }, [
        activeSection,
        clearWorkTimers,
        expandCurve,
        setWorkDockState,
    ]);
    /* =========================================================
       WORK RETURN
  
       Directly nav → Work home.
       No centre replay.
       No scale animation.
       ========================================================= */
    const returnWorkDotFromNav = useCallback(() => {
        if (activeSection !==
            "work" ||
            !workDotDockedRef.current ||
            workDotTransitioningRef.current) {
            return;
        }
        const dot = workDotRef.current;
        const avatar = workDotAvatarRef.current;
        const target = document.querySelector<HTMLElement>("[data-dot-work-home]");
        const source = hamburgerRef.current?.getBoundingClientRect();
        if (!dot ||
            !avatar ||
            !target ||
            !source) {
            return;
        }
        workDotTransitioningRef.current =
            true;
        setWorkDockState(false);
        setWorkDotVisible(true);
        setWorkDotThought("");
        setWorkDotAnimation("working");
        const targetRect = target.getBoundingClientRect();
        const targetX = targetRect.left +
            targetRect.width /
                2 -
            DOT_SIZE /
                2;
        const targetY = targetRect.top +
            targetRect.height /
                2 -
            DOT_SIZE /
                2;
        gsap.set(dot, {
            x: source.left +
                source.width /
                    2 -
                DOT_SIZE /
                    2,
            y: source.top +
                source.height /
                    2 -
                DOT_SIZE /
                    2,
            scale: 1.04,
            opacity: 1,
        });
        gsap.set(avatar, {
            filter: "invert(1)",
            scale: 0.78,
            transformOrigin: "center center",
        });
        collapseCurve(false);
        const timeline = gsap.timeline({
            onComplete: () => {
                workDotTransitioningRef.current =
                    false;
                setWorkDotAnimation("playful");
            },
        });
        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 1.04,
            duration: 0.82,
            ease: "power2.inOut",
            overwrite: "auto",
        });
        timeline.to(avatar, {
            filter: "invert(0)",
            scale: 0.78,
            duration: 0.72,
            ease: "power1.inOut",
        }, "<");
    }, [
        activeSection,
        collapseCurve,
        setWorkDockState,
    ]);
    /* =========================================================
       TEAM HELPERS

       Forward:
       nav -> active Team target, white -> black

       Reverse:
       Team target -> nav when cursor approaches right edge
       nav -> active Team target automatically when cursor leaves nav

       If DOT is the selected fifth member, its active target is the
       centre stage and its avatar is enlarged. Otherwise it rests
       to the left of the portrait.
       ========================================================= */
    const clearTeamDotTimer = useCallback(() => {
        if (teamDotThoughtTimerRef.current !== null) {
            window.clearTimeout(teamDotThoughtTimerRef.current);
            teamDotThoughtTimerRef.current = null;
        }
    }, []);

    const setTeamDockState = useCallback((docked: boolean) => {
        teamDotDockedRef.current = docked;
        setTeamDotDocked(docked);
    }, []);

    const getTeamTarget = useCallback(() => {
        const selector = teamDotSelfSelectedRef.current
            ? "[data-dot-team-center]"
            : "[data-dot-team-home]";

        return document.querySelector<HTMLElement>(selector);
    }, []);

    const getTeamAvatarScale = useCallback(() => {
        return teamDotSelfSelectedRef.current
            ? TEAM_DOT_SELF_SCALE
            : TEAM_DOT_REST_SCALE;
    }, []);

    const showTeamThought = useCallback(() => {
        clearTeamDotTimer();
        setTeamDotAnimation(teamDotLatestAnimationRef.current);
        setTeamDotThought(teamDotLatestThoughtRef.current);

        teamDotThoughtTimerRef.current = window.setTimeout(() => {
            if (!teamDotDockedRef.current) {
                setTeamDotThought("");
                setTeamDotAnimation("idle");
            }
            teamDotThoughtTimerRef.current = null;
        }, TEAM_THOUGHT_DURATION);
    }, [clearTeamDotTimer]);

    const moveTeamDotToActiveTarget = useCallback((duration = 0.9, withThought = true) => {
        const dot = teamDotRef.current;
        const avatar = teamDotAvatarRef.current;
        const target = getTeamTarget();

        if (!dot || !avatar || !target || teamDotDockedRef.current) {
            return;
        }

        const targetRect = target.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2 - DOT_SIZE / 2;
        const targetY = targetRect.top + targetRect.height / 2 - DOT_SIZE / 2;
        const avatarScale = getTeamAvatarScale();

        clearTeamDotTimer();
        teamDotTransitioningRef.current = true;
        setTeamDotThought("");
        setTeamDotAnimation(
            teamDotSelfSelectedRef.current
                ? "excited"
                : teamDotLatestAnimationRef.current
        );

        gsap.killTweensOf([dot, avatar]);

        const timeline = gsap.timeline({
            onComplete: () => {
                teamDotTransitioningRef.current = false;
                setTeamDotAnimation(teamDotLatestAnimationRef.current);
                if (withThought) {
                    window.setTimeout(() => {
                        if (!teamDotDockedRef.current) {
                            showTeamThought();
                        }
                    }, 180);
                }
            },
        });

        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 1,
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
        });

        timeline.to(avatar, {
            scale: avatarScale,
            filter: "invert(0)",
            duration: Math.max(0.72, duration * 0.9),
            ease: "power2.inOut",
        }, "<");
    }, [clearTeamDotTimer, getTeamAvatarScale, getTeamTarget, showTeamThought]);

    const launchTeamDotFromNav = useCallback((duration = 1.1) => {
        const dot = teamDotRef.current;
        const avatar = teamDotAvatarRef.current;
        const target = getTeamTarget();

        if (!dot || !avatar || !target || teamDotTransitioningRef.current) {
            return;
        }

        clearTeamDotTimer();
        teamDotTransitioningRef.current = true;
        setTeamDockState(false);
        setTeamDotVisible(true);
        setTeamDotThought("");
        setTeamDotAnimation(
            teamDotSelfSelectedRef.current
                ? "excited"
                : "curious"
        );

        const source = hamburgerRef.current?.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        const sourceX = source
            ? source.left + source.width / 2 - DOT_SIZE / 2
            : window.innerWidth - 46 - DOT_SIZE / 2;

        const sourceY = source
            ? source.top + source.height / 2 - DOT_SIZE / 2
            : window.innerHeight / 2 - DOT_SIZE / 2;

        const targetX = targetRect.left + targetRect.width / 2 - DOT_SIZE / 2;
        const targetY = targetRect.top + targetRect.height / 2 - DOT_SIZE / 2;
        const avatarScale = getTeamAvatarScale();

        gsap.killTweensOf([dot, avatar]);

        gsap.set(dot, {
            x: sourceX,
            y: sourceY,
            opacity: 1,
            scale: 1,
        });

        gsap.set(avatar, {
            filter: "invert(1)",
            scale: 1,
            transformOrigin: "center center",
        });

        collapseCurve(false);

        const timeline = gsap.timeline({
            onComplete: () => {
                teamDotTransitioningRef.current = false;
                setTeamDotAnimation(teamDotLatestAnimationRef.current);
                showTeamThought();
            },
        });

        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 1,
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
        });

        timeline.to(avatar, {
            filter: "invert(0)",
            scale: avatarScale,
            duration: Math.max(0.85, duration * 0.9),
            ease: "power2.inOut",
        }, "<");
    }, [
        clearTeamDotTimer,
        collapseCurve,
        getTeamAvatarScale,
        getTeamTarget,
        setTeamDockState,
        showTeamThought,
    ]);

    const dockTeamDotIntoNav = useCallback(() => {
        if (
            activeSection !== "team" ||
            teamDotDockedRef.current ||
            teamDotTransitioningRef.current
        ) {
            return;
        }

        const dot = teamDotRef.current;
        const avatar = teamDotAvatarRef.current;
        const destination = hamburgerRef.current?.getBoundingClientRect();

        if (!dot || !avatar || !destination) {
            return;
        }

        clearTeamDotTimer();
        teamDotTransitioningRef.current = true;
        setTeamDotThought("");
        setTeamDotAnimation("curious");

        expandCurve(false);

        const targetX = destination.left + destination.width / 2 - DOT_SIZE / 2;
        const targetY = destination.top + destination.height / 2 - DOT_SIZE / 2;

        gsap.killTweensOf([dot, avatar]);

        const timeline = gsap.timeline({
            onComplete: () => {
                teamDotTransitioningRef.current = false;
                setTeamDockState(true);
                setTeamDotVisible(false);
                setTeamDotAnimation("idle");
            },
        });

        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 1,
            duration: 1.05,
            ease: "power2.inOut",
            overwrite: "auto",
        });

        timeline.to(avatar, {
            filter: "invert(1)",
            scale: 1,
            duration: 0.95,
            ease: "power1.inOut",
        }, "<");
    }, [
        activeSection,
        clearTeamDotTimer,
        expandCurve,
        setTeamDockState,
    ]);

    const returnTeamDotFromNav = useCallback(() => {
        if (
            activeSection !== "team" ||
            !teamDotDockedRef.current ||
            teamDotTransitioningRef.current
        ) {
            return;
        }

        const dot = teamDotRef.current;
        const avatar = teamDotAvatarRef.current;
        const target = getTeamTarget();
        const source = hamburgerRef.current?.getBoundingClientRect();

        if (!dot || !avatar || !target || !source) {
            return;
        }

        clearTeamDotTimer();
        teamDotTransitioningRef.current = true;
        setTeamDockState(false);
        setTeamDotVisible(true);
        setTeamDotThought("");
        setTeamDotAnimation(
            teamDotSelfSelectedRef.current
                ? "excited"
                : "playful"
        );

        const targetRect = target.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2 - DOT_SIZE / 2;
        const targetY = targetRect.top + targetRect.height / 2 - DOT_SIZE / 2;
        const avatarScale = getTeamAvatarScale();

        gsap.set(dot, {
            x: source.left + source.width / 2 - DOT_SIZE / 2,
            y: source.top + source.height / 2 - DOT_SIZE / 2,
            scale: 1,
            opacity: 1,
        });

        gsap.set(avatar, {
            filter: "invert(1)",
            scale: 1,
            transformOrigin: "center center",
        });

        collapseCurve(false);

        const timeline = gsap.timeline({
            onComplete: () => {
                teamDotTransitioningRef.current = false;
                setTeamDotAnimation(teamDotLatestAnimationRef.current);
                showTeamThought();
            },
        });

        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 1,
            duration: 1.05,
            ease: "power2.inOut",
            overwrite: "auto",
        });

        timeline.to(avatar, {
            filter: "invert(0)",
            scale: avatarScale,
            duration: 0.92,
            ease: "power2.inOut",
        }, "<");
    }, [
        activeSection,
        clearTeamDotTimer,
        collapseCurve,
        getTeamAvatarScale,
        getTeamTarget,
        setTeamDockState,
        showTeamThought,
    ]);
    /* =========================================================
       CONTACT FORM HELPERS

       Forward:
       nav -> current form target, white -> black

       Reverse:
       current target -> nav near right edge
       nav -> last active target when cursor leaves nav
       ========================================================= */
    const clearContactDotTimer = useCallback(() => {
        if (contactDotThoughtTimerRef.current !== null) {
            window.clearTimeout(contactDotThoughtTimerRef.current);
            contactDotThoughtTimerRef.current = null;
        }
    }, []);

    const setContactDockState = useCallback((docked: boolean) => {
        contactDotDockedRef.current = docked;
        setContactDotDocked(docked);
    }, []);

    const getContactTarget = useCallback(() => {
        return document.querySelector<HTMLElement>(contactDotTargetRef.current);
    }, []);

    const syncContactDotPosition = useCallback(() => {
        if (contactDotDockedRef.current) {
            return;
        }

        const dot = contactDotRef.current;
        const target = getContactTarget();

        if (!dot || !target) {
            return;
        }

        const rect = target.getBoundingClientRect();

        gsap.set(dot, {
            x: rect.left + rect.width / 2 - DOT_SIZE / 2,
            y: rect.top + rect.height / 2 - DOT_SIZE / 2,
        });
    }, [getContactTarget]);

    const showContactThought = useCallback((duration = CONTACT_THOUGHT_DURATION) => {
        clearContactDotTimer();
        setContactDotAnimation(contactDotLatestAnimationRef.current);
        setContactDotThought(contactDotLatestThoughtRef.current);

        contactDotThoughtTimerRef.current = window.setTimeout(() => {
            if (!contactDotDockedRef.current) {
                setContactDotThought("");
                setContactDotAnimation("idle");
            }
            contactDotThoughtTimerRef.current = null;
        }, duration);
    }, [clearContactDotTimer]);

    const moveContactDotToCurrentTarget = useCallback((duration = 0.82, withThought = true) => {
        const dot = contactDotRef.current;
        const avatar = contactDotAvatarRef.current;
        const target = getContactTarget();

        if (!dot || !avatar || !target || contactDotDockedRef.current) {
            return;
        }

        const targetRect = target.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2 - DOT_SIZE / 2;
        const targetY = targetRect.top + targetRect.height / 2 - DOT_SIZE / 2;

        clearContactDotTimer();
        contactDotTransitioningRef.current = true;
        setContactDotThought("");
        setContactDotAnimation(contactDotLatestAnimationRef.current);

        gsap.killTweensOf([dot, avatar]);

        const timeline = gsap.timeline({
            onComplete: () => {
                syncContactDotPosition();
                contactDotTransitioningRef.current = false;
                if (withThought) {
                    window.setTimeout(() => {
                        if (!contactDotDockedRef.current) {
                            showContactThought();
                        }
                    }, 140);
                }
            },
        });

        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 1,
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
        });

        timeline.to(avatar, {
            filter: "invert(0)",
            scale: 1.08,
            duration: Math.max(0.68, duration * 0.9),
            ease: "power2.inOut",
        }, "<");
    }, [clearContactDotTimer, getContactTarget, showContactThought, syncContactDotPosition]);

    const launchContactDotFromNav = useCallback((duration = 1.05) => {
        if (!contactMode || contactDotTransitioningRef.current) {
            return;
        }

        const dot = contactDotRef.current;
        const avatar = contactDotAvatarRef.current;
        const target = getContactTarget();
        const source = hamburgerRef.current?.getBoundingClientRect();

        if (!dot || !avatar || !target || !source) {
            return;
        }

        clearContactDotTimer();
        contactDotTransitioningRef.current = true;
        setContactDockState(false);
        setContactDotVisible(true);
        setContactDotThought("");
        setContactDotAnimation(contactDotLatestAnimationRef.current);

        const targetRect = target.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2 - DOT_SIZE / 2;
        const targetY = targetRect.top + targetRect.height / 2 - DOT_SIZE / 2;

        gsap.killTweensOf([dot, avatar]);

        gsap.set(dot, {
            x: source.left + source.width / 2 - DOT_SIZE / 2,
            y: source.top + source.height / 2 - DOT_SIZE / 2,
            opacity: 1,
            scale: 1,
        });

        gsap.set(avatar, {
            filter: "invert(1)",
            scale: 1,
            transformOrigin: "center center",
        });

        collapseCurve(false);

        const timeline = gsap.timeline({
            onComplete: () => {
                syncContactDotPosition();
                contactDotTransitioningRef.current = false;
                showContactThought();
            },
        });

        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 1,
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
        });

        timeline.to(avatar, {
            filter: "invert(0)",
            scale: 1.08,
            duration: Math.max(0.8, duration * 0.9),
            ease: "power1.inOut",
        }, "<");
    }, [
        clearContactDotTimer,
        collapseCurve,
        contactMode,
        getContactTarget,
        setContactDockState,
        showContactThought,
        syncContactDotPosition,
    ]);

    const dockContactDotIntoNav = useCallback(() => {
        if (!contactMode || contactDotDockedRef.current || contactDotTransitioningRef.current) {
            return;
        }

        const dot = contactDotRef.current;
        const avatar = contactDotAvatarRef.current;
        const destination = hamburgerRef.current?.getBoundingClientRect();

        if (!dot || !avatar || !destination) {
            return;
        }

        clearContactDotTimer();
        contactDotTransitioningRef.current = true;
        setContactDotThought("");
        setContactDotAnimation("curious");

        expandCurve(false);

        const targetX = destination.left + destination.width / 2 - DOT_SIZE / 2;
        const targetY = destination.top + destination.height / 2 - DOT_SIZE / 2;

        gsap.killTweensOf([dot, avatar]);

        const timeline = gsap.timeline({
            onComplete: () => {
                contactDotTransitioningRef.current = false;
                setContactDockState(true);
                setContactDotVisible(false);
                setContactDotAnimation("idle");
            },
        });

        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 1,
            duration: 1.0,
            ease: "power2.inOut",
            overwrite: "auto",
        });

        timeline.to(avatar, {
            filter: "invert(1)",
            scale: 1,
            duration: 0.9,
            ease: "power1.inOut",
        }, "<");
    }, [
        clearContactDotTimer,
        contactMode,
        expandCurve,
        setContactDockState,
    ]);

    const returnContactDotFromNav = useCallback(() => {
        if (!contactMode || !contactDotDockedRef.current || contactDotTransitioningRef.current) {
            return;
        }

        const dot = contactDotRef.current;
        const avatar = contactDotAvatarRef.current;
        const target = getContactTarget();
        const source = hamburgerRef.current?.getBoundingClientRect();

        if (!dot || !avatar || !target || !source) {
            return;
        }

        clearContactDotTimer();
        contactDotTransitioningRef.current = true;
        setContactDockState(false);
        setContactDotVisible(true);
        setContactDotThought("");
        setContactDotAnimation(contactDotLatestAnimationRef.current);

        const targetRect = target.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2 - DOT_SIZE / 2;
        const targetY = targetRect.top + targetRect.height / 2 - DOT_SIZE / 2;

        gsap.set(dot, {
            x: source.left + source.width / 2 - DOT_SIZE / 2,
            y: source.top + source.height / 2 - DOT_SIZE / 2,
            scale: 1,
            opacity: 1,
        });

        gsap.set(avatar, {
            filter: "invert(1)",
            scale: 1,
            transformOrigin: "center center",
        });

        collapseCurve(false);

        const timeline = gsap.timeline({
            onComplete: () => {
                syncContactDotPosition();
                contactDotTransitioningRef.current = false;
                showContactThought();
            },
        });

        timeline.to(dot, {
            x: targetX,
            y: targetY,
            scale: 1,
            duration: 0.95,
            ease: "power2.inOut",
            overwrite: "auto",
        });

        timeline.to(avatar, {
            filter: "invert(0)",
            scale: 1.08,
            duration: 0.82,
            ease: "power1.inOut",
        }, "<");
    }, [
        clearContactDotTimer,
        collapseCurve,
        contactMode,
        getContactTarget,
        setContactDockState,
        showContactThought,
        syncContactDotPosition,
    ]);

    /* =========================================================
       HERO
       ========================================================= */
    useEffect(() => {
        clearDotTimers();
        setShowDotMessage(false);
        setDotAnimation("idle");
        if (activeSection !==
            "hero" ||
            isOpen) {
            return;
        }
        const scroller = document.querySelector<HTMLElement>('[data-scene-scroll][data-active="true"]');
        if (scroller &&
            scroller.scrollTop >
                20) {
            return;
        }
        dotMessageDelayRef.current =
            window.setTimeout(() => {
                revealDotMessage();
                dotMessageDelayRef.current =
                    null;
            }, DOT_MESSAGE_DELAY);
        return () => {
            clearDotTimers();
        };
    }, [
        activeSection,
        isOpen,
        clearDotTimers,
        revealDotMessage,
    ]);
    useEffect(() => {
        const handleDotScroll = () => {
            clearDotTimers();
            setShowDotMessage(false);
            setDotAnimation("idle");
        };
        document.addEventListener("scroll", handleDotScroll, true);
        return () => {
            document.removeEventListener("scroll", handleDotScroll, true);
        };
    }, [clearDotTimers]);
    /* =========================================================
       INACTIVITY
       ========================================================= */
    useEffect(() => {
        const clearInactivityTimers = () => {
            if (dotIdleTimerRef.current !==
                null) {
                window.clearTimeout(dotIdleTimerRef.current);
                dotIdleTimerRef.current =
                    null;
            }
            if (dotSleepTimerRef.current !==
                null) {
                window.clearTimeout(dotSleepTimerRef.current);
                dotSleepTimerRef.current =
                    null;
            }
            if (dotWakeTimerRef.current !==
                null) {
                window.clearTimeout(dotWakeTimerRef.current);
                dotWakeTimerRef.current =
                    null;
            }
        };
        const startIdleCountdown = () => {
            if (dotIdleTimerRef.current !==
                null) {
                window.clearTimeout(dotIdleTimerRef.current);
            }
            dotIdleTimerRef.current =
                window.setTimeout(() => {
                    setShowDotMessage(false);
                    dotAnimationRef.current =
                        "drowsy";
                    setDotAnimation("drowsy");
                    dotSleepTimerRef.current =
                        window.setTimeout(() => {
                            dotAnimationRef.current =
                                "sleeping";
                            setDotAnimation("sleeping");
                        }, DOT_DROWSY_DURATION);
                }, DOT_IDLE_DELAY);
        };
        const handleActivity = () => {
            const sleeping = dotAnimationRef.current ===
                "sleeping" ||
                dotAnimationRef.current ===
                    "drowsy";
            if (dotSleepTimerRef.current !==
                null) {
                window.clearTimeout(dotSleepTimerRef.current);
            }
            if (dotWakeTimerRef.current !==
                null) {
                window.clearTimeout(dotWakeTimerRef.current);
            }
            if (sleeping) {
                dotAnimationRef.current =
                    "waking";
                setDotAnimation("waking");
                dotWakeTimerRef.current =
                    window.setTimeout(() => {
                        dotAnimationRef.current =
                            "idle";
                        setDotAnimation("idle");
                    }, DOT_WAKE_DURATION);
            }
            startIdleCountdown();
        };
        window.addEventListener("pointermove", handleActivity, {
            passive: true,
        });
        window.addEventListener("pointerdown", handleActivity, {
            passive: true,
        });
        window.addEventListener("keydown", handleActivity);
        window.addEventListener("wheel", handleActivity, {
            passive: true,
        });
        startIdleCountdown();
        return () => {
            clearInactivityTimers();
            window.removeEventListener("pointermove", handleActivity);
            window.removeEventListener("pointerdown", handleActivity);
            window.removeEventListener("keydown", handleActivity);
            window.removeEventListener("wheel", handleActivity);
        };
    }, []);
    /* =========================================================
       SERVICES ENTER
       ========================================================= */
    useEffect(() => {
        if (activeSection !==
            "services" ||
            isOpen) {
            clearServiceDotTimers();
            serviceDotDockedRef.current =
                false;
            serviceDotTransitioningRef.current =
                false;
            setServiceDotDocked(false);
            setServiceDotVisible(false);
            return;
        }
        const timer = window.setTimeout(() => {
            launchServiceDotFromNav(1.15);
        }, 90);
        return () => {
            window.clearTimeout(timer);
        };
    }, [
        activeSection,
        isOpen,
        clearServiceDotTimers,
        launchServiceDotFromNav,
    ]);
    /* =========================================================
       SERVICES EVENTS
       ========================================================= */
    useEffect(() => {
        const handleServiceChange = (event: Event) => {
            const detail = (event as CustomEvent<{
                animation: AnimationName;
                thought: string;
            }>).detail;
            serviceDotLatestAnimationRef.current =
                detail.animation;
            serviceDotLatestThoughtRef.current =
                detail.thought;
            if (activeSection !==
                "services" ||
                isOpen ||
                serviceDotDockedRef.current ||
                serviceDotTransitioningRef.current ||
                serviceDotExploreRef.current) {
                return;
            }
            clearServiceDotTimers();
            setServiceDotThought("");
            setServiceDotAnimation("excited");
            const dot = serviceDotRef.current;
            if (dot) {
                gsap.to(dot, {
                    scale: 1.07,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out",
                });
            }
            serviceDotReactionTimerRef.current =
                window.setTimeout(() => {
                    showCurrentServiceThought();
                }, SERVICE_THOUGHT_DELAY);
        };
        const handleCarousel = () => {
            if (activeSection ===
                "services" &&
                serviceDotDockedRef.current) {
                launchServiceDotFromNav(1.2);
            }
        };
        window.addEventListener("dot:services-change", handleServiceChange);
        window.addEventListener("dot:services-carousel", handleCarousel);
        return () => {
            window.removeEventListener("dot:services-change", handleServiceChange);
            window.removeEventListener("dot:services-carousel", handleCarousel);
        };
    }, [
        activeSection,
        isOpen,
        clearServiceDotTimers,
        launchServiceDotFromNav,
        showCurrentServiceThought,
    ]);
    useEffect(() => {
        const handleExplore = (event: Event) => {
            if (activeSection !==
                "services" ||
                isOpen ||
                serviceDotDockedRef.current ||
                serviceDotTransitioningRef.current) {
                return;
            }
            const detail = (event as CustomEvent<{
                active: boolean;
                thought?: string;
            }>).detail;
            clearServiceDotTimers();
            serviceDotExploreRef.current =
                detail.active;
            if (detail.active) {
                setServiceDotAtExplore(true);
                setServiceDotAnimation("curious");
                setServiceDotThought("");
                moveServiceDotTo("[data-dot-services-explore-anchor]", 1.35);
                serviceDotReactionTimerRef.current =
                    window.setTimeout(() => {
                        if (serviceDotExploreRef.current) {
                            setServiceDotThought(detail.thought ??
                                "Curious about everything we can build?");
                        }
                    }, 900);
                return;
            }
            setServiceDotAtExplore(false);
            setServiceDotThought("");
            setServiceDotAnimation("playful");
            moveServiceDotTo("[data-dot-services-home]", 1.15);
        };
        window.addEventListener("dot:services-explore", handleExplore);
        return () => {
            window.removeEventListener("dot:services-explore", handleExplore);
        };
    }, [
        activeSection,
        isOpen,
        clearServiceDotTimers,
        moveServiceDotTo,
    ]);
    /* =========================================================
       WORK ENTER
       ========================================================= */
    useEffect(() => {
        if (activeSection !==
            "work" ||
            isOpen) {
            clearWorkTimers();
            workDotIntroPlayedRef.current =
                false;
            workDotTransitioningRef.current =
                false;
            setWorkDotVisible(false);
            setWorkDotThought("");
            setWorkDockState(false);
            window.dispatchEvent(new Event("dot:work-reset"));
            return;
        }
        const timer = window.setTimeout(() => {
            launchWorkIntro();
        }, 120);
        return () => {
            window.clearTimeout(timer);
        };
    }, [
        activeSection,
        isOpen,
        clearWorkTimers,
        launchWorkIntro,
        setWorkDockState,
    ]);
    /* =========================================================
       WORK EVENTS
       ========================================================= */
    useEffect(() => {
        const handlePull = (event: Event) => {
            if (activeSection !==
                "work" ||
                workDotDockedRef.current) {
                return;
            }
            const detail = (event as CustomEvent<{
                direction: 1 | -1;
                source: "intro" | "auto" | "manual";
            }>).detail;
            clearWorkTimers();
            setWorkDotThought("");
            setWorkDotAnimation("working");
            const dot = workDotRef.current;
            if (!dot) {
                return;
            }
            gsap.killTweensOf(dot);
            gsap.to(dot, {
                x: detail.direction >
                    0
                    ? "-=11"
                    : "+=11",
                scaleX: 0.94,
                scaleY: 1.06,
                duration: 0.22,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
            });
        };
        const handleSettled = (event: Event) => {
            if (activeSection !==
                "work" ||
                workDotDockedRef.current) {
                return;
            }
            const detail = (event as CustomEvent<{
                thought: string;
                animation: AnimationName;
            }>).detail;
            clearWorkTimers();
            setWorkDotAnimation(detail.animation);
            setWorkDotThought(detail.thought);
            workDotThoughtTimerRef.current =
                window.setTimeout(() => {
                    if (!workDotDockedRef.current) {
                        setWorkDotThought("");
                        setWorkDotAnimation("idle");
                    }
                    workDotThoughtTimerRef.current =
                        null;
                }, WORK_THOUGHT_DURATION);
        };
        const handleInteraction = () => {
            if (activeSection !==
                "work") {
                return;
            }
            if (workDotDockedRef.current) {
                returnWorkDotFromNav();
            }
        };
        window.addEventListener("dot:work-pull-start", handlePull);
        window.addEventListener("dot:work-settled", handleSettled);
        window.addEventListener("dot:work-interaction", handleInteraction);
        return () => {
            window.removeEventListener("dot:work-pull-start", handlePull);
            window.removeEventListener("dot:work-settled", handleSettled);
            window.removeEventListener("dot:work-interaction", handleInteraction);
        };
    }, [
        activeSection,
        clearWorkTimers,
        returnWorkDotFromNav,
    ]);
    /* =========================================================
       TEAM ENTER
       ========================================================= */
    useEffect(() => {
        if (activeSection !==
            "team" ||
            isOpen) {
            clearTeamDotTimer();
            teamDotTransitioningRef.current =
                false;
            setTeamDotVisible(false);
            setTeamDotThought("");
            setTeamDockState(false);
            return;
        }
        const timer = window.setTimeout(() => {
            launchTeamDotFromNav(1.1);
        }, 120);
        return () => {
            window.clearTimeout(timer);
        };
    }, [
        activeSection,
        isOpen,
        clearTeamDotTimer,
        launchTeamDotFromNav,
        setTeamDockState,
    ]);
    /* =========================================================
       TEAM MEMBER REACTIONS
       ========================================================= */
    useEffect(() => {
        const handleTeamMemberChange = (event: Event) => {
            const detail = (event as CustomEvent<{
                index: number;
                name: string;
                role: string;
                thought: string;
                animation: AnimationName;
                isDot: boolean;
            }>).detail;

            teamDotLatestThoughtRef.current = detail.thought;
            teamDotLatestAnimationRef.current = detail.animation;
            teamDotSelfSelectedRef.current = detail.isDot;
            setTeamDotSelfSelected(detail.isDot);

            if (
                activeSection !== "team" ||
                isOpen ||
                teamDotDockedRef.current ||
                teamDotTransitioningRef.current
            ) {
                return;
            }

            moveTeamDotToActiveTarget(0.9, true);
        };

        window.addEventListener("dot:team-member-change", handleTeamMemberChange);

        return () => {
            window.removeEventListener("dot:team-member-change", handleTeamMemberChange);
        };
    }, [
        activeSection,
        isOpen,
        moveTeamDotToActiveTarget,
    ]);
    /* =========================================================
       CONTACT FORM ENTER
       ========================================================= */
    useEffect(() => {
        if (!contactMode) {
            clearContactDotTimer();
            contactDotTransitioningRef.current = false;
            setContactDotVisible(false);
            setContactDotThought("");
            setContactDockState(false);
            contactDotTargetRef.current = "[data-dot-contact-home]";
            contactDotLatestThoughtRef.current = "Tell me what you're trying to build.";
            contactDotLatestAnimationRef.current = "curious";
            return;
        }

        if (isOpen || contactDotDockedRef.current) {
            return;
        }

        const timer = window.setTimeout(() => {
            launchContactDotFromNav(1.05);
        }, 160);

        return () => {
            window.clearTimeout(timer);
        };
    }, [
        contactMode,
        isOpen,
        clearContactDotTimer,
        launchContactDotFromNav,
        setContactDockState,
    ]);

    /* =========================================================
       CONTACT FIELD / SUCCESS EVENTS
       ========================================================= */
    useEffect(() => {
        const handleContactField = (event: Event) => {
            const detail = (event as CustomEvent<{
                target: string;
                thought: string;
                animation: AnimationName;
            }>).detail;

            contactDotTargetRef.current = detail.target;
            contactDotLatestThoughtRef.current = detail.thought;
            contactDotLatestAnimationRef.current = detail.animation;

            if (!contactMode || isOpen || contactDotDockedRef.current || contactDotTransitioningRef.current) {
                return;
            }

            moveContactDotToCurrentTarget(0.78, true);
        };

        const handleContactSuccess = (event: Event) => {
            const detail = (event as CustomEvent<{
                target: string;
                thought: string;
                animation: AnimationName;
            }>).detail;

            contactDotTargetRef.current = detail.target;
            contactDotLatestThoughtRef.current = detail.thought;
            contactDotLatestAnimationRef.current = detail.animation;

            if (!contactMode || isOpen || contactDotDockedRef.current) {
                return;
            }

            moveContactDotToCurrentTarget(0.72, false);

            window.setTimeout(() => {
                if (!contactDotDockedRef.current) {
                    setContactDotAnimation("celebrate");
                    setContactDotThought(detail.thought);
                    clearContactDotTimer();
                    contactDotThoughtTimerRef.current = window.setTimeout(() => {
                        if (!contactDotDockedRef.current) {
                            setContactDotThought("");
                            setContactDotAnimation("proud");
                        }
                        contactDotThoughtTimerRef.current = null;
                    }, 4200);
                }
            }, 760);
        };

        window.addEventListener("dot:contact-field", handleContactField);
        window.addEventListener("dot:contact-success", handleContactSuccess);

        return () => {
            window.removeEventListener("dot:contact-field", handleContactField);
            window.removeEventListener("dot:contact-success", handleContactSuccess);
        };
    }, [
        contactMode,
        isOpen,
        clearContactDotTimer,
        moveContactDotToCurrentTarget,
    ]);

    /* =========================================================
       CONTACT DOT — KEEP ATTACHED TO FORM WHILE PAGE SCROLLS

       The Contact DOT itself is position: fixed so it can animate
       cleanly between the form and the fixed navigation.

       While the page scrolls, keep recalculating the active form
       anchor's viewport position so DOT visually stays attached to
       that field/card instead of floating at an old screen position.
       ========================================================= */
    useEffect(() => {
        if (!contactMode) {
            return;
        }

        let frame: number | null = null;

        const syncContactDotToTarget = () => {
            if (frame !== null) {
                return;
            }

            frame = window.requestAnimationFrame(() => {
                frame = null;

                if (
                    contactDotDockedRef.current ||
                    contactDotTransitioningRef.current
                ) {
                    return;
                }

                syncContactDotPosition();
            });
        };

        document.addEventListener(
            "scroll",
            syncContactDotToTarget,
            true
        );

        window.addEventListener(
            "resize",
            syncContactDotToTarget,
            { passive: true }
        );

        syncContactDotToTarget();

        return () => {
            document.removeEventListener(
                "scroll",
                syncContactDotToTarget,
                true
            );

            window.removeEventListener(
                "resize",
                syncContactDotToTarget
            );

            if (frame !== null) {
                window.cancelAnimationFrame(frame);
            }
        };
    }, [contactMode, syncContactDotPosition]);

    /* =========================================================
       SCROLL STATE
       ========================================================= */
    useEffect(() => {
        const findActiveScroller = () => {
            const active = document.querySelector<HTMLElement>('[data-scene-scroll][data-active="true"]');
            scrollerRef.current =
                active;
            return active;
        };
        let scroller = findActiveScroller();
        const syncNavigation = (immediate = false) => {
            scroller =
                scrollerRef.current ??
                    findActiveScroller();
            if (!scroller) {
                return;
            }
            const inWork = isInsideWork(scroller);
            workModeRef.current =
                inWork;
            if (isOpen) {
                return;
            }
            if (activeSection ===
                "services") {
                if (!serviceDotDockedRef.current &&
                    !collapsedRef.current &&
                    !animatingRef.current) {
                    collapseCurve();
                }
                return;
            }
            if (activeSection ===
                "team") {
                if (!teamDotDockedRef.current &&
                    !collapsedRef.current &&
                    !animatingRef.current) {
                    collapseCurve();
                }
                return;
            }
            if (activeSection ===
                "work") {
                if (!workDotDockedRef.current &&
                    !collapsedRef.current &&
                    !animatingRef.current) {
                    collapseCurve();
                }
                return;
            }
            if (inWork) {
                hideForWork(immediate);
                return;
            }
            if (workHiddenRef.current) {
                workHiddenRef.current =
                    false;
                if (buttonRef.current) {
                    gsap.to(buttonRef.current, {
                        x: 0,
                        duration: 0.62,
                        ease: "power3.out",
                    });
                }
            }
            if (scroller.scrollTop <=
                20) {
                if (collapsedRef.current) {
                    expandCurve(immediate);
                }
                return;
            }
            if (!collapsedRef.current) {
                collapseCurve(immediate);
            }
        };
        syncNavigation(true);
        const handleScroll = () => {
            syncNavigation();
        };
        scroller?.addEventListener("scroll", handleScroll, {
            passive: true,
        });
        const observer = new MutationObserver(() => {
            const next = findActiveScroller();
            if (next ===
                scroller) {
                return;
            }
            scroller?.removeEventListener("scroll", handleScroll);
            scroller =
                next;
            scroller?.addEventListener("scroll", handleScroll, {
                passive: true,
            });
            syncNavigation(true);
        });
        observer.observe(document.body, {
            subtree: true,
            attributes: true,
            attributeFilter: [
                "data-active",
            ],
        });
        return () => {
            scroller?.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, [
        activeSection,
        collapseCurve,
        expandCurve,
        hideForWork,
        isInsideWork,
        isOpen,
    ]);
    /* =========================================================
       MENU OPEN / CLOSE
       ========================================================= */
    useEffect(() => {
        if (isOpen) {
            collapseCurve();
            return;
        }
        if (contactMode) {
            if (!contactDotDockedRef.current &&
                !collapsedRef.current) {
                collapseCurve();
            }
            else if (contactDotDockedRef.current &&
                collapsedRef.current) {
                expandCurve();
            }
            return;
        }
        if (activeSection ===
            "services") {
            if (!serviceDotDockedRef.current &&
                !collapsedRef.current) {
                collapseCurve();
            }
            return;
        }
        if (activeSection ===
            "work") {
            if (!workDotDockedRef.current &&
                !collapsedRef.current) {
                collapseCurve();
            }
            return;
        }
        const scroller = document.querySelector<HTMLElement>('[data-scene-scroll][data-active="true"]');
        if (!scroller) {
            expandCurve();
            return;
        }
        const inWork = isInsideWork(scroller);
        workModeRef.current =
            inWork;
        if (inWork) {
            hideForWork();
            return;
        }
        if (scroller.scrollTop <=
            20) {
            expandCurve();
        }
        else {
            collapseCurve();
        }
    }, [
        activeSection,
        isOpen,
        contactMode,
        collapseCurve,
        expandCurve,
        hideForWork,
        isInsideWork,
    ]);
    /* =========================================================
       RIGHT EDGE
       ========================================================= */
    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            if (isOpen) {
                return;
            }
            const distance = window.innerWidth -
                event.clientX;
            if (contactMode) {
                if (!contactDotDockedRef.current) {
                    if (distance <= 30 &&
                        !contactDotTransitioningRef.current) {
                        dockContactDotIntoNav();
                    }
                    return;
                }
                if (distance <= 24 &&
                    collapsedRef.current) {
                    expandCurve();
                    return;
                }
                if (distance > 150 &&
                    !contactDotTransitioningRef.current) {
                    returnContactDotFromNav();
                }
                return;
            }
            if (activeSection ===
                "services") {
                if (!serviceDotDockedRef.current) {
                    if (distance <= 30 &&
                        !serviceDotTransitioningRef.current &&
                        !serviceDotExploreRef.current) {
                        dockServiceDotIntoNav();
                    }
                    return;
                }
                if (distance <=
                    24 &&
                    collapsedRef.current) {
                    expandCurve();
                }
                if (distance >
                    130 &&
                    !collapsedRef.current &&
                    !animatingRef.current) {
                    collapseCurve();
                }
                return;
            }
            if (activeSection ===
                "team") {
                if (!teamDotDockedRef.current) {
                    if (distance <= 30 &&
                        !teamDotTransitioningRef.current) {
                        dockTeamDotIntoNav();
                    }
                    return;
                }
                if (distance <= 24 &&
                    collapsedRef.current) {
                    expandCurve();
                    return;
                }
                if (distance > 150 &&
                    !teamDotTransitioningRef.current) {
                    returnTeamDotFromNav();
                }
                return;
            }
            if (activeSection ===
                "work") {
                if (!workDotDockedRef.current) {
                    if (distance <= 30 &&
                        !workDotTransitioningRef.current) {
                        dockWorkDotIntoNav();
                    }
                    return;
                }
                if (distance <= 24 &&
                    collapsedRef.current) {
                    expandCurve();
                    return;
                }
                if (distance >
                    150 &&
                    !workDotTransitioningRef.current) {
                    returnWorkDotFromNav();
                }
                return;
            }
            if (workModeRef.current) {
                if (distance <= 30) {
                    if (workHiddenRef.current) {
                        revealForWork();
                    }
                    return;
                }
                if (distance >=
                    170 &&
                    !workHiddenRef.current &&
                    !animatingRef.current) {
                    hideForWork();
                }
                return;
            }
            if (distance <=
                24) {
                if (collapsedRef.current) {
                    expandCurve();
                }
                return;
            }
            const scroller = scrollerRef.current;
            if (distance >
                130 &&
                scroller &&
                scroller.scrollTop >
                    20 &&
                !collapsedRef.current &&
                !animatingRef.current) {
                collapseCurve();
            }
        };
        window.addEventListener("pointermove", handlePointerMove, {
            passive: true,
        });
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
        };
    }, [
        activeSection,
        contactMode,
        collapseCurve,
        dockContactDotIntoNav,
        dockServiceDotIntoNav,
        dockTeamDotIntoNav,
        dockWorkDotIntoNav,
        expandCurve,
        hideForWork,
        isOpen,
        returnContactDotFromNav,
        returnTeamDotFromNav,
        returnWorkDotFromNav,
        revealForWork,
    ]);
    /* =========================================================
       CLICK
       ========================================================= */
    const handleClick = () => {
        hideDotMessage();
        if (collapsedRef.current) {
            if (workModeRef.current &&
                activeSection !==
                    "work") {
                revealForWork();
            }
            else {
                expandCurve();
            }
            return;
        }
        setDotAnimation("excited");
        setPressed(true);
        window.setTimeout(() => {
            setPressed(false);
        }, 200);
        onToggle();
    };
    const navDotHidden = (contactMode &&
        !contactDotDocked) ||
        (activeSection ===
        "services" &&
        !serviceDotDocked) ||
        (activeSection ===
            "work" &&
            !workDotDocked) ||
        (activeSection ===
            "team" &&
            !teamDotDocked);
    return (<>
      {!isOpen && (<div aria-hidden="true" className="
            fixed
            bottom-0
            right-0
            top-0
            z-[88]
            w-[24px]
          " onPointerEnter={() => {
                if (contactMode) {
                    if (!contactDotDockedRef.current) {
                        dockContactDotIntoNav();
                        return;
                    }
                    if (collapsedRef.current) {
                        expandCurve();
                    }
                    return;
                }
                if (activeSection ===
                    "services") {
                    if (!serviceDotDockedRef.current) {
                        dockServiceDotIntoNav();
                        return;
                    }
                    if (collapsedRef.current) {
                        expandCurve();
                    }
                    return;
                }
                if (activeSection ===
                    "team") {
                    if (!teamDotDockedRef.current) {
                        dockTeamDotIntoNav();
                        return;
                    }
                    if (collapsedRef.current) {
                        expandCurve();
                    }
                    return;
                }
                if (activeSection ===
                    "work") {
                    if (!workDotDockedRef.current) {
                        dockWorkDotIntoNav();
                        return;
                    }
                    if (collapsedRef.current) {
                        expandCurve();
                    }
                    return;
                }
                if (workModeRef.current) {
                    revealForWork();
                    return;
                }
                if (collapsedRef.current) {
                    expandCurve();
                }
            }}/>)}

      <button ref={buttonRef} type="button" aria-label="Open navigation" onClick={handleClick} onPointerEnter={() => {
            if (contactMode) {
                if (!contactDotDockedRef.current) {
                    dockContactDotIntoNav();
                    return;
                }
                if (collapsedRef.current) {
                    expandCurve();
                }
                return;
            }
            if (activeSection ===
                "services") {
                if (!serviceDotDockedRef.current) {
                    dockServiceDotIntoNav();
                    return;
                }
                if (collapsedRef.current) {
                    expandCurve();
                }
                return;
            }
            if (activeSection ===
                "team") {
                if (!teamDotDockedRef.current) {
                    dockTeamDotIntoNav();
                    return;
                }
                if (collapsedRef.current) {
                    expandCurve();
                }
                return;
            }
            if (activeSection ===
                "work") {
                if (!workDotDockedRef.current) {
                    dockWorkDotIntoNav();
                    return;
                }
                if (collapsedRef.current) {
                    expandCurve();
                }
                return;
            }
            if (!collapsedRef.current &&
                !workModeRef.current) {
                setDotAnimation("curious");
                setShowDotMessage(true);
            }
        }} onPointerDown={() => {
            if (!collapsedRef.current) {
                setPressed(true);
                setDotAnimation("excited");
            }
        }} onPointerUp={() => {
            setPressed(false);
        }} onPointerCancel={() => {
            setPressed(false);
            hideDotMessage();
        }} onPointerLeave={() => {
            setPressed(false);
            if (!contactMode &&
                activeSection !==
                    "services" &&
                activeSection !==
                    "work" &&
                activeSection !==
                    "team") {
                setShowDotMessage(false);
                setDotAnimation("idle");
            }
        }} className="
          fixed
          bottom-0
          right-0
          top-0
          z-[90]
          flex
          items-center
          justify-end
          border-0
          bg-transparent
          p-0
          outline-none
          will-change-transform
        " style={{
            width: `${EDGE_CURVE_WIDTH}px`,
        }}>
        <div ref={curveWrapperRef} className="
            absolute
            inset-0
            will-change-transform
          " style={{
            transformOrigin: "right center",
        }}>
          <EdgeCurve tone="dark" pressed={pressed}/>
        </div>

        <span ref={hamburgerRef} aria-hidden="true" className="
            pointer-events-none
            absolute
            right-[18px]
            top-1/2
            z-20
            flex
            h-7
            w-8
            -translate-y-1/2
            items-center
            justify-center
            overflow-visible
            will-change-transform
          ">
          <span className="
              absolute
              right-[52px]
              top-1/2
              whitespace-nowrap
              rounded-full
              bg-[#111111]
              px-3.5
              py-2
              font-sora
              text-[10px]
              font-medium
              tracking-[0.02em]
              text-white
              shadow-[0_8px_28px_rgba(0,0,0,0.14)]
              transition-all
              duration-300
            " style={{
            opacity: contactMode ||
                activeSection ===
                "services" ||
                activeSection ===
                    "work" ||
                activeSection ===
                    "team"
                ? 0
                : showDotMessage
                    ? 1
                    : 0,
            transform: showDotMessage
                ? "translate3d(0,-50%,0) scale(1)"
                : "translate3d(8px,-50%,0) scale(0.96)",
            visibility: contactMode ||
                activeSection ===
                "services" ||
                activeSection ===
                    "work" ||
                activeSection ===
                    "team" ||
                !showDotMessage
                ? "hidden"
                : "visible",
        }}>
            Click to open menu

            <span className="
                absolute
                -right-[4px]
                top-1/2
                h-2
                w-2
                -translate-y-1/2
                rotate-45
                bg-[#111111]
              "/>
          </span>

          <span className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              block
            " style={{
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            transform: "translate(-50%, -50%)",
        }}>
            <GrokBot animation={dotAnimation} playing loop size={DOT_SIZE} className="
                block
                pointer-events-none
              " style={{
            filter: "invert(1)",
            opacity: navDotHidden
                ? 0
                : 1,
            transition: "opacity 160ms ease",
        }}/>
          </span>
        </span>
      </button>

      {/* =====================================================
            CONTACT FORM DOT
           ===================================================== */}

      <div ref={contactDotRef} aria-hidden="true" className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[96]
          will-change-transform
        " style={{
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            opacity: contactDotVisible ? 1 : 0,
            visibility: contactDotVisible ? "visible" : "hidden",
        }}>
        <div className="
            absolute
            left-[calc(100%+12px)]
            top-[-18px]
            w-max
            md:left-auto
            md:right-[calc(100%+14px)]
            max-w-[230px]
            transition-all
            duration-300
          " style={{
            opacity: contactDotThought ? 1 : 0,
            visibility: contactDotThought ? "visible" : "hidden",
            transform: contactDotThought
                ? "translateX(0) translateY(0) scale(1)"
                : "translateX(5px) translateY(5px) scale(0.96)",
        }}>
          <div className="
              rounded-[18px]
              bg-white
              px-4
              py-3
              font-sora
              text-[10px]
              font-medium
              leading-[1.45]
              text-[#353535]
              shadow-[0_12px_34px_rgba(0,0,0,0.09)]
              ring-1
              ring-black/[0.04]
            ">
            {contactDotThought}
          </div>

          <span aria-hidden="true" className="
              absolute
              -left-[10px]
              bottom-[12px]
              md:left-auto
              md:-right-[10px]
              h-[5px]
              w-[5px]
              rounded-full
              bg-white
              shadow-[0_3px_8px_rgba(0,0,0,0.08)]
            "/>
        </div>

        <span ref={contactDotAvatarRef} className="
            block
            pointer-events-none
            will-change-transform
          " style={{
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            filter: "invert(0)",
            transformOrigin: "center center",
        }}>
          <GrokBot animation={contactDotAnimation} playing loop size={DOT_SIZE} className="
              block
              pointer-events-none
            "/>
        </span>
      </div>

      {/* SERVICES DOT */}

      <div ref={serviceDotRef} aria-hidden="true" className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[95]
          will-change-transform
        " style={{
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            opacity: serviceDotVisible
                ? 1
                : 0,
            visibility: serviceDotVisible
                ? "visible"
                : "hidden",
        }}>
        <div className="
            absolute
            top-1/2
            flex
            w-max
            items-center
            transition-all
            duration-300
          " style={{
            left: serviceDotAtExplore
                ? "auto"
                : `${DOT_SIZE + 10}px`,
            right: serviceDotAtExplore
                ? `${DOT_SIZE + 10}px`
                : "auto",
            opacity: serviceDotThought
                ? 1
                : 0,
            visibility: serviceDotThought
                ? "visible"
                : "hidden",
            transform: "translateY(-50%)",
        }}>
          {serviceDotAtExplore ? (<>
              <div className="
                  max-w-[230px]
                  rounded-[16px]
                  bg-[#171717]
                  px-4
                  py-2.5
                  font-sora
                  text-[10px]
                  font-medium
                  leading-[1.45]
                  text-white
                ">
                {serviceDotThought}
              </div>

              <span className="
                  ml-[10px]
                  h-[5px]
                  w-[5px]
                  rounded-full
                  bg-[#171717]
                "/>
            </>) : (<>
              <span className="
                  mr-[10px]
                  h-[5px]
                  w-[5px]
                  rounded-full
                  bg-[#171717]
                "/>

              <div className="
                  max-w-[220px]
                  rounded-[16px]
                  bg-[#171717]
                  px-4
                  py-2.5
                  font-sora
                  text-[10px]
                  font-medium
                  leading-[1.45]
                  text-white
                ">
                {serviceDotThought}
              </div>
            </>)}
        </div>

        <span ref={serviceDotAvatarRef} className="
            block
            pointer-events-none
          " style={{
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            filter: "invert(0)",
        }}>
          <GrokBot animation={serviceDotAnimation} playing loop size={DOT_SIZE} className="
              block
              pointer-events-none
            "/>
        </span>
      </div>

      {/* =====================================================
            WORK DOT
  
            Only layout of the thought changed:
            thought now sits slightly above the head.
           ===================================================== */}

      <div ref={workDotRef} aria-hidden="true" className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[96]
          will-change-transform
        " style={{
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            opacity: workDotVisible
                ? 1
                : 0,
            visibility: workDotVisible
                ? "visible"
                : "hidden",
        }}>
        {/* WORK THOUGHT — ABOVE AVATAR */}

        <div className="
            absolute
            bottom-[70px]
            left-1/2
            w-max
            max-w-[190px]
            -translate-x-1/2
            transition-all
            duration-300
          " style={{
            opacity: workDotThought
                ? 1
                : 0,
            visibility: workDotThought
                ? "visible"
                : "hidden",
            transform: workDotThought
                ? "translateX(-50%) translateY(0) scale(1)"
                : "translateX(-50%) translateY(5px) scale(0.96)",
        }}>
          <div className="
              rounded-[16px]
              bg-[#171717]
              px-3.5
              py-2.5
              text-center
              font-sora
              text-[9px]
              font-medium
              leading-[1.45]
              text-white
              shadow-[0_10px_30px_rgba(0,0,0,0.1)]
            ">
            {workDotThought}
          </div>

          {/* DETACHED DOT */}

          <span aria-hidden="true" className="
              absolute
              -bottom-[12px]
              left-1/2
              h-[5px]
              w-[5px]
              -translate-x-1/2
              rounded-full
              bg-[#171717]
            "/>
        </div>

        <span ref={workDotAvatarRef} className="
            block
            pointer-events-none
          " style={{
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            filter: "invert(0)",
        }}>
          <GrokBot animation={workDotAnimation} playing loop size={DOT_SIZE} className="
              block
              pointer-events-none
            "/>
        </span>
      </div>

      {/* =====================================================
            TEAM DOT

            Human member:
            rests to the left of the portrait.

            DOT member:
            moves into the portrait centre and enlarges.

            Right-edge hover always sends it back to navigation.
           ===================================================== */}

      <div ref={teamDotRef} aria-hidden="true" className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[96]
          will-change-transform
        " style={{
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            opacity: teamDotVisible ? 1 : 0,
            visibility: teamDotVisible ? "visible" : "hidden",
        }}>
        {/* WHITE THOUGHT — RIGHT / SLIGHTLY ABOVE */}

        <div className="
            absolute
            w-max
            max-w-[210px]
            transition-all
            duration-300
          " style={{
            left: teamDotSelfSelected
                ? `calc(100% + 58px)`
                : `calc(100% + 14px)`,
            top: teamDotSelfSelected
                ? "-42px"
                : "-18px",
            opacity: teamDotThought ? 1 : 0,
            visibility: teamDotThought ? "visible" : "hidden",
            transform: teamDotThought
                ? "translateX(0) translateY(0) scale(1)"
                : "translateX(-4px) translateY(5px) scale(0.96)",
        }}>
          <div className="
              rounded-[18px]
              bg-white
              px-4
              py-3
              font-sora
              text-[9px]
              font-medium
              leading-[1.45]
              text-[#353535]
              shadow-[0_12px_32px_rgba(0,0,0,0.08)]
              ring-1
              ring-black/[0.04]
            ">
            {teamDotThought}
          </div>

          <span aria-hidden="true" className="
              absolute
              -left-[9px]
              bottom-[12px]
              h-[5px]
              w-[5px]
              rounded-full
              bg-white
              shadow-[0_3px_8px_rgba(0,0,0,0.08)]
            "/>
        </div>

        <span ref={teamDotAvatarRef} className="
            block
            pointer-events-none
            will-change-transform
          " style={{
            width: `${DOT_SIZE}px`,
            height: `${DOT_SIZE}px`,
            filter: "invert(0)",
            transformOrigin: "center center",
        }}>
          <GrokBot animation={teamDotAnimation} playing loop size={DOT_SIZE} className="
              block
              pointer-events-none
            "/>
        </span>
      </div>
    </>);
}
