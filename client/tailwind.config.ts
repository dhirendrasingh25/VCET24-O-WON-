import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const {
    default: flattenColorPalette,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
} = require("tailwindcss/lib/util/flattenColorPalette");

//* This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addVariablesForColors({
    addBase,
    theme,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addBase: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: any;
}) {
    const allColors = flattenColorPalette(theme("colors"));
    const newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
    );

    addBase({
        ":root": newVars,
    });
}

const config: Config = {
    darkMode: ["class"],
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "custom-blue": "#2AABEE",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            animation: {
                aurora: "aurora 60s linear infinite",
                scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
            },
            keyframes: {
                aurora: {
                    from: {
                        backgroundPosition: "50% 50%, 50% 50%",
                    },
                    to: {
                        backgroundPosition: "350% 50%, 350% 50%",
                    },
                },
                scroll: {
                    to: {
                        transform: "translate(calc(-50% - 0.5rem))",
                    },
                },
            },
        },
    },
    plugins: [tailwindAnimate, addVariablesForColors],
};
export default config;
