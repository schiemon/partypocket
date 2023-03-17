import React, { ChangeEvent, Component, FormEvent } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Guest, Party } from "@prisma/client";
import { GuestDraft, GuestUpdatable } from "../../pages/api/guest";

type PartyInfoForGuest = Pick<Party, "id" | "cost_per_guest">;

export type GuestSubmitHandler = () => void;

export type GuestUpdateHandler = (
  guestModificationData: GuestDraft | GuestUpdatable
) => void;

export type GuestInProgress = GuestDraft | GuestUpdatable;

type GuestFormProps = {
  guestInProgress: GuestInProgress;
  partyInfoForGuest: PartyInfoForGuest;
  handleSubmit: GuestSubmitHandler;
  handleUpdate: GuestUpdateHandler;
  creating: boolean;
};

type GuestFormState = {};

export default class GuestForm extends Component<
  GuestFormProps,
  GuestFormState
> {
  handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedName = event.target.value;
    this.props.handleUpdate({
      ...this.props.guestInProgress,
      name: updatedName,
    });
  };

  handlePaidChange = (event: Event, value: number | number[], _: number) => {
    if (!Array.isArray(value)) {
      this.props.handleUpdate({
        ...this.props.guestInProgress,
        paid: value,
      });
    } else {
      console.error("Expected 'value' to be a number not an array.");
    }
  };
  render() {
    const marks = [
      {
        value: 0,
        label: "0€",
      },
      {
        value: this.props.partyInfoForGuest.cost_per_guest,
        label: this.props.partyInfoForGuest.cost_per_guest + "€",
      },
    ];

    return (
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            this.props.handleSubmit();
          }}
        >
          <TextField
            label="Guest's name"
            variant="filled"
            size="small"
            sx={{ bgcolor: "background.paper" }}
            value={this.props.guestInProgress.name}
            onChange={this.handleNameChange}
          />
          <Button
            variant={"contained"}
            onClick={() => this.props.handleSubmit()}
          >
            {this.props.creating ? "CREATE" : "UPDATE"}
          </Button>
        </Stack>

        <Paper sx={{ pt: 2, pb: 2, pl: 4, pr: 4, width: "100%" }}>
          <Typography gutterBottom>
            Amount paid: {this.props.guestInProgress.paid}€
          </Typography>
          <Slider
            aria-label="Small steps"
            value={this.props.guestInProgress.paid}
            step={1}
            marks={marks}
            min={0}
            max={this.props.partyInfoForGuest.cost_per_guest}
            valueLabelDisplay="auto"
            onChange={this.handlePaidChange}
          />
        </Paper>
        <Divider sx={{ width: "100%", m: 0.5 }} orientation="horizontal" />
      </Stack>
    );
  }
}
