import { Box, Typography } from "@mui/material";

export default function Loading({ asPage }: { asPage?: boolean }) {
  if (asPage === null) {
    asPage = false;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={asPage ? "100vh" : "auto"}
    >
      <Typography variant={"h5"}>Loading...</Typography>
    </Box>
  );
}
