import React, { useEffect, useRef, useState } from "react";
import { TextGenerateEffect } from "../ui/text-generate-effect";

import { useInView } from "framer-motion";

const Footer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [startTyping, setStartTyping] = useState(false);

    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => setStartTyping(true), 500);
            return () => clearTimeout(timer);
        }
    }, [isInView]);

    return (
        <footer ref={ref}>
            <div className="border-t-2 p-36 items-center flex justify-center">
                {startTyping && (
                    <TextGenerateEffect
                        className="text-4xl  text-blue-500"
                        words="Plan, Save, Invest – All in One Place"
                    />
                )}
            </div>
            <div className="flex  mt-16 w-full  pb-10 md:flex-row flex-col justify-between items-center">
                <p className="text-xs text-center w-full font-light text-white-200">
                    Copyright © 2024 O(Won) | Developed with NextJs &
                    Aceternity UI | VCET 2024
                </p>
            </div>
        </footer>
    );
};

export default Footer;
