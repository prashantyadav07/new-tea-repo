import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Standard scroll to top
        window.scrollTo(0, 0);

        // Also try to find any scroll containers if needed
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });

        // If locomotive-scroll/lenis is active, it usually listens to window scroll
        // but sometimes needs a little nudge or specialized call.
        // In Locomotive Scroll v5, it handles window scroll events.
    }, [pathname]);

    return null;
}
