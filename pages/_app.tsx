import { UserProvider } from "@auth0/nextjs-auth0";
import { NextComponentType } from "next";
import { Component } from "react";
import Head from "next/head";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../styles/theme";

function App({
  Component,
  pageProps,
}: {
  Component: NextComponentType;
  pageProps: any;
}) {
  return (
    <UserProvider>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
          key="viewport"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;