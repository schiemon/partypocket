import {
  Box,
  createTheme,
  CssBaseline,
  Divider,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import theme from "../styles/theme";
import Link from "./Link";
import { BASE_URL } from "../lib/constants";

export default function ErrorMessage({ error }: { error: Error | string }) {
  const errorMessage = typeof error === "string" ? error : error.message;
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Stack>
        <Typography variant={"h4"} gutterBottom component="div">
          Sorry, we encountered an error :(
        </Typography>
        <Divider sx={{ margin: ".5em 0 1em 0" }} />
        <code>{errorMessage}</code>
        <Link sx={{ margin: "2em 0 0 0", textAlign: "right" }} href={BASE_URL}>
          return home &#10230;
        </Link>
      </Stack>
    </Box>
  );
}
