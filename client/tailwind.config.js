module.exports = {
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class", // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                main: {
                    dark: "#0F0F1A",
                    DEFAULT: "#1A1A2E",
                    light: "#20233c",
                }
            }
        },
    },
    variants: {
        extend: {
            borderRadius: ["first", "last"],
            padding: ["first", "last"],
            zIndex: ["hover"],
        },
    },
    plugins: [],
};
