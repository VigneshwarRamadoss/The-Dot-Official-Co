import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type CSSProperties,
} from "react";

import {
  loadAvatarRuntime,
  type AvatarData,
  type RuntimeAvatar,
} from "./avatar-runtime";

import {
  avatarData,
  type AnimationName,
} from "./grok-bot.avatar";

export type { AnimationName } from "./grok-bot.avatar";

export type AvatarHandle = {
  play: (animation?: AnimationName) => void;
  pause: () => void;
  stop: () => void;
};

export type AvatarProps = {
  animation?: AnimationName;
  playing?: boolean;
  loop?: boolean;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  onAnimationEnd?: (animation: AnimationName) => void;

  /*
   * default:
   * black body + white eyes
   *
   * navigation:
   * white body + black eyes
   */
  colorVariant?: "default" | "navigation";
};

export const GrokBot = forwardRef<AvatarHandle, AvatarProps>(
  function GrokBot(
    {
      animation = "sleeping",
      playing = true,
      loop,
      size = 240,
      className,
      style,
      onAnimationEnd,
      colorVariant = "default",
    },
    ref
  ) {
    const host = useRef<HTMLSpanElement>(null);

    const controller =
      useRef<RuntimeAvatar<AnimationName> | null>(null);

    const animationRef = useRef(animation);
    const playingRef = useRef(playing);
    const onAnimationEndRef = useRef(onAnimationEnd);

    animationRef.current = animation;
    playingRef.current = playing;
    onAnimationEndRef.current = onAnimationEnd;

    /* =====================================================
       INSTANCE-SPECIFIC AVATAR DATA

       IMPORTANT:
       avatarData itself is never modified.

       Every normal GrokBot:
       BLACK BODY + WHITE EYES

       Navigation instance only:
       WHITE BODY + BLACK EYES
       ===================================================== */

    const runtimeData = useMemo<AvatarData<AnimationName>>(() => {
      if (colorVariant === "default") {
        return avatarData;
      }

      return {
        ...avatarData,

        avatar: {
          ...avatarData.avatar,

          colors: {
            body: "#FFFFFF",
            eyes: "#000000",
          },
        },
      };
    }, [colorVariant]);

    /* =====================================================
       CREATE AVATAR
       ===================================================== */

    useEffect(() => {
      if (!host.current) return;

      let disposed = false;

      let avatar: RuntimeAvatar<AnimationName> | null = null;

      void loadAvatarRuntime<AnimationName>(runtimeData).then((runtime) => {
        if (disposed || !host.current) return;

        avatar = runtime.createAvatar(host.current, {
          animation: animationRef.current,
          autoplay: playingRef.current,
          loop,
          size: "100%",

          onAnimationEnd: (next) =>
            onAnimationEndRef.current?.(next),
        });

        controller.current = avatar;
      });

      return () => {
        disposed = true;

        avatar?.destroy();

        controller.current = null;
      };
    }, [loop, runtimeData]);

    /* =====================================================
       ANIMATION
       ===================================================== */

    useEffect(() => {
      const avatar = controller.current;

      if (!avatar) return;

      if (playing) {
        avatar.play(animation);
      } else {
        avatar.pause();
      }
    }, [animation, playing]);

    /* =====================================================
       CONTROLS
       ===================================================== */

    useImperativeHandle(
      ref,
      () => ({
        play(next = animation) {
          controller.current?.play(next);
        },

        pause() {
          controller.current?.pause();
        },

        stop() {
          controller.current?.stop();
        },
      }),
      [animation]
    );

    /* =====================================================
       SIZE
       ===================================================== */

    const dimension =
      typeof size === "number"
        ? `${size}px`
        : size;

    return (
      <span
        ref={host}
        className={className}
        style={{
          display: "inline-block",
          width: dimension,
          height: dimension,
          ...style,
        }}
      />
    );
  }
);

export default GrokBot;