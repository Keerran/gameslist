import React, {useEffect, useRef} from "react";
import {AnimatePresence, motion} from "framer-motion";

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
    show: boolean,
    onClose: () => void
}

export default function Popover({className, ...props}: PopoverProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleOuterClick(e: MouseEvent) {
            if (ref.current && !ref.current!.parentElement!.contains(e.target as Element)) {
                props.onClose();
            }
        }

        document.addEventListener("mousedown", handleOuterClick);

        return () => {
            document.removeEventListener("mousedown", handleOuterClick);
        }
    }, [])

    const variants = {
        open: {
            height: "auto",
            opacity: 1
        },
        closed: {
            height: 0,
            opacity: 0,
            transitionEnd: {
                display: "none"
            }
        },
    };

    const pointerVariants = {
        open: {
            "--width": 1,
            "--opacity": 1
        } as any,
        closed: {
            "--width": 0,
            "--opacity": 0
        } as any,
    }

    const transition = {
        duration: 0.2,
        damping: 1000
    }

    return (

        <AnimatePresence>
            {props.show &&
            <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={pointerVariants}
                transition={transition}
                ref={ref}
                className={"absolute top-arrow " + className ?? ""}>
                <motion.ul
                    transition={transition}
                    variants={variants}
                    className="shadow text-medium text-gray-600 max-w-12
                               rounded overflow-hidden dark:bg-white">
                    {props.children}
                </motion.ul>
            </motion.div>
            }
        </AnimatePresence>
    )
}
