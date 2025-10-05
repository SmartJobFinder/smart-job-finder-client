export function scrollToTop({ duration = 400, easing = "easeOutCubic" } = {}) {
    const startY = window.scrollY;
    if (startY === 0) return;

    const startTime = performance.now();

    const easingFns = {
        easeIn: (t) => t * t,
        easeOut: (t) => 1 - Math.pow(1 - t, 2),
        easeInOut: (t) =>
            t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
        easeOutCubic: (t) => 1 - Math.pow(1 - t, 3), 
    };

    const ease = easingFns[easing] || easingFns.easeOutCubic;

    function animate(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentY = startY * (1 - ease(progress));

        window.scrollTo(0, Math.round(currentY));

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            window.scrollTo(0, 0);
        }
    }

    requestAnimationFrame(animate);
}
