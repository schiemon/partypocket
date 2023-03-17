import { Container } from "@mui/material";
import { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
  return <Container maxWidth="sm">{props.children}</Container>;
}
