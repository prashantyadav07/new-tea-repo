import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * ScrollReveal - Wrapper that animates children when they scroll into view.
 * Supports fade, slide-up, slide-left, slide-right, scale, and custom variants.
 */
export function ScrollReveal({
    children,
    className = '',
    delay = 0,
    duration = 0.6,
    direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'none'
    distance = 60,
    once = true,
    scale = 1,
    ...props
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-10% 0px -10% 0px' });

    const directionMap = {
        up: { y: distance, x: 0 },
        down: { y: -distance, x: 0 },
        left: { x: distance, y: 0 },
        right: { x: -distance, y: 0 },
        none: { x: 0, y: 0 },
    };

    const { x, y } = directionMap[direction] || directionMap.up;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x, y, scale: scale < 1 ? scale : 1 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.4, 0.25, 1],
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

/**
 * TextReveal - Animates text word-by-word or character-by-character on scroll.
 */
export function TextReveal({
    children,
    className = '',
    delay = 0,
    staggerDelay = 0.03,
    once = true,
    as = 'div',
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-50px 0px' });
    const words = typeof children === 'string' ? children.split(' ') : [];
    const Tag = as;

    return (
        <Tag ref={ref} className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                    animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * staggerDelay,
                        ease: [0.25, 0.4, 0.25, 1],
                    }}
                    className="inline-block mr-[0.3em]"
                >
                    {word}
                </motion.span>
            ))}
        </Tag>
    );
}

/**
 * ParallaxSection - Creates a parallax scroll effect.
 */
export function ParallaxSection({ children, className = '', speed = 0.5 }) {
    return (
        <motion.div
            className={className}
            style={{
                willChange: 'transform',
            }}
            initial={{ y: 0 }}
            whileInView={{ y: 0 }}
            viewport={{ once: false }}
        >
            {children}
        </motion.div>
    );
}

/**
 * StaggerContainer - Staggers the animation of its children.
 */
export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.1,
    delay = 0,
    once = true,
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-50px 0px' });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * StaggerItem - To be used inside StaggerContainer.
 */
export function StaggerItem({ children, className = '', direction = 'up' }) {
    const directionMap = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: 40 },
        right: { x: -40 },
    };
    const offset = directionMap[direction] || directionMap.up;

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, ...offset },
                visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * CountUp - Animated number counter
 */
export function CountUp({ target, duration = 2, suffix = '', prefix = '', className = '' }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
        >
            {isInView ? (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {prefix}
                    <MotionNumber target={target} duration={duration} />
                    {suffix}
                </motion.span>
            ) : `${prefix}0${suffix}`}
        </motion.span>
    );
}

function MotionNumber({ target, duration }) {
    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {target}
        </motion.span>
    );
}
