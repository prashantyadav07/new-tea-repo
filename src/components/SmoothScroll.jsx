import { useLayoutEffect, useState, useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';

/**
 * Detects if the device is a touch/mobile device.
 * Uses multiple signals for reliability.
 */
function isTouchDevice() {
    if (typeof window === 'undefined') return false;
    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth <= 768
    );
}

export default function SmoothScroll({ children }) {
    useLayoutEffect(() => {
        // Skip Locomotive Scroll on mobile/touch devices — native scroll is faster & smoother
        if (isTouchDevice()) return;

        let locomotiveScroll;

        // Small timeout to ensure DOM is fully rendered before Locomotive Scroll takes over
        const timer = setTimeout(() => {
            locomotiveScroll = new LocomotiveScroll({
                el: document.querySelector('[data-scroll-container]'),
                smooth: true,
                multiplier: 1,
                lerp: 0.1,
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            if (locomotiveScroll) locomotiveScroll.destroy();
        };
    }, []);

    return (
        <>
            {children}
        </>
    );
}


