import { createTheme, PaletteColorOptions } from "@mui/material";
import { red } from "@mui/material/colors";

declare module "@mui/material/styles" {
    interface Theme {
        palette: Palette;
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        palette?: PaletteOptions;
    }

    interface Palette {
        delete: PaletteColorOptions;
        card: PaletteColorOptions;
    }

    interface PaletteOptions {
        delete?: PaletteColorOptions;
        card: PaletteColorOptions;
    }
}

const theme = createTheme({
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
    palette: {
        mode: "dark",
        primary: {
            main: "#57d9b7",
        },
        delete: {
            main: red["400"],
        },
        background: {
            paper: "#151515",
        },
        card: {
            main: "#151515",
        },
    },
    components: {
        MuiList: {
            styleOverrides: {
                padding: "2em",
            },
        },
    },
});

export default theme;
