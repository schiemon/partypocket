import { Alert, Snackbar } from "@mui/material";
import React from "react";
import {
  SnackbarCloseReason,
  SnackbarProps,
} from "@mui/material/Snackbar/Snackbar";

export default function ErrorSnackbar(
  props: SnackbarProps & {
    open: boolean;
    onClose: (
      event: React.SyntheticEvent<any>,
      reason: SnackbarCloseReason
    ) => void;
  } & {
    message: string;
  }
) {
  return (
    <Snackbar {...props}>
      <Alert
        onClose={(event) => {
          props.onClose(event, "clickaway");
        }}
        severity="error"
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}
