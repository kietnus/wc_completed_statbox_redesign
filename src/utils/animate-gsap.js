import { TweenMax, Linear } from "gsap";

export const domAnimate = ({
    dom,
    duration,
    startScale = 1,
    endScale = 1,
    startScaleX = 1,
    endScaleX = 1,
    startScaleY = 1,
    endScaleY = 1,
    startRotZ = 0,
    endRotZ = 0,
    startX = 0,
    startY = 0,
    endX = 0,
    endY = 0,
    startWidth = "initial",
    endWidth = "initial",
    curve = Linear.easeNone,
    reverse = false,
    reverseDelay = 0,
    callback = null,
}) => {
    const animateAction = TweenMax.fromTo(
        dom,
        duration,
        {
            x: startX,
            y: startY,
            scale: startScale,
            scaleX: startScaleX,
            scaleY: startScaleY,
            rotateZ: startRotZ,
            width: startWidth,
        },
        {
            x: endX,
            y: endY,
            scale: endScale,
            scaleX: endScaleX,
            scaleY: endScaleY,
            rotateZ: endRotZ,
            width: endWidth,
            ease: curve,
        }
    );

    if (reverse)
        animateAction.then(() =>
            setTimeout(() => animateAction.reverse(), reverseDelay * 1000)
        );

    if (callback) animateAction.then(() => callback());

    return animateAction;
};

export const countUp = ({ duration, val, step, curve, updateFunc }) => {
    let valueHolder = { value: 0 };

    TweenMax.to(valueHolder, duration, {
        value: val,
        onUpdate: () => {
            updateFunc(
                step === 1
                    ? Math.floor(valueHolder.value)
                    : valueHolder.value.toFixed(1)
            );
        },
        ease: curve,
    });
};
