import { PartyCreationData, PartyDuplicateError } from "../lib/Party";
import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  API_PARTIES_ENDPOINT,
  PARTY_DESCRIPTION_MAX_LEN,
  PARTY_MAX_COST_PER_GUEST,
  PARTY_NAME_MAX_LEN,
  PARTY_NAME_MIN_LEN,
} from "../lib/constants";
import assert from "assert";
import useDidMountEffect from "../utils/useDidMountEffect";
import { mutate } from "swr";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

type PartySubmitData = PartyCreationData;
type PartySubmitAttribute = keyof PartySubmitData;

const PartyForm = () => {
  let [[open, message], setSnackbarInfo] = useState<[boolean, string]>([
    false,
    "",
  ]);
  let [name, setName] = useState<string>("");
  let [description, setDescription] = useState<string | null>(null);
  let [costPerGuest, setCostPerGuest] = useState<number>(10);
  let [validationErrors, setValidationErrors] = useState<
    Map<PartySubmitAttribute, string[]>
  >(
    new Map([
      ["name", []],
      ["cost_per_guest", []],
      ["description", []],
    ])
  );

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === "") {
      setDescription(null);
    } else {
      setDescription(e.target.value);
    }
  };

  const handleCostPerGuestChange = (e: ChangeEvent<HTMLInputElement>) => {
    let parsedCostPerGuest = parseInt(e.target.value);
    if (isNaN(parsedCostPerGuest)) {
      parsedCostPerGuest = 1;
    }
    setCostPerGuest(parsedCostPerGuest);
  };

  const validate = (partySubmitAttribute: PartySubmitAttribute) => {
    const setSpecificValidationErrors = (
      partySubmitAttribute: PartySubmitAttribute,
      specificValidationErrors: string[]
    ) => {
      setValidationErrors((prev) =>
        new Map(prev).set(partySubmitAttribute, specificValidationErrors)
      );
    };

    let specificValidationErrors = [];
    switch (partySubmitAttribute) {
      case "name":
        if (name.length > PARTY_NAME_MAX_LEN)
          specificValidationErrors.push("Name is too long.");
        if (name.length < PARTY_NAME_MIN_LEN)
          specificValidationErrors.push("Name is too short.");
        break;
      case "description":
        if (description !== null) {
          if (description.length > PARTY_DESCRIPTION_MAX_LEN)
            specificValidationErrors.push("Description is too long.");
        }
        break;
      case "cost_per_guest":
        if (costPerGuest <= 0)
          specificValidationErrors.push(
            "Cost per guest must be a positive amount."
          );

        if (costPerGuest > PARTY_MAX_COST_PER_GUEST) {
          specificValidationErrors.push("Cost per guest is too high.");
        }

        break;
      default:
        assert(false);
    }

    setSpecificValidationErrors(partySubmitAttribute, specificValidationErrors);
  };

  /*
      https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects
      We will not use stale values since we are switching to the updated party attribute that has changed.
      So other attributes are not referenced, so we do not have to subscribe to them.
    */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useDidMountEffect(() => validate("cost_per_guest"), [costPerGuest]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useDidMountEffect(() => validate("name"), [name]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useDidMountEffect(() => validate("description"), [description]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    Array.from(validationErrors.keys()).forEach((key) => validate(key));
    const ok = Array.from(validationErrors.values()).every(
      (specificValidationErrors) => specificValidationErrors.length === 0
    );

    if (ok) {
      const partySubmitData: PartySubmitData = {
        name,
        description,
        cost_per_guest: costPerGuest,
      };

      const headers = new Headers([["content-type", "application/json"]]);

      const res = await fetch(API_PARTIES_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(partySubmitData),
        headers: headers,
      }).then((res) => {
        if (!res.ok) {
          res.json().then((data) => {
            console.log(data);
            const { error } = data;
            let message = "Could not create party for some reason 😢.";
            if (error.type === "PartyDuplicateError") {
              message = "You already have a party with such name!";
            }
            setSnackbarInfo([true, message]);
          });
        }
      });

      await mutate(API_PARTIES_ENDPOINT);
    } else {
      console.log("Rejected submit because of invalid form data.");
    }
  };

  const displayValidationErrorsFor = (
    partySubmitAttribute: PartySubmitAttribute
  ) => {
    const validationErrorsForAttribute =
      validationErrors.get(partySubmitAttribute);
    if (
      validationErrorsForAttribute === undefined ||
      validationErrorsForAttribute.length === 0
    )
      return null;
    return (
      <div color={"red"}>
        <p style={{ color: "white", backgroundColor: "red" }}>
          {validationErrorsForAttribute}
        </p>
      </div>
    );
  };

  const showSnackbar = (msg: string) => {
    setSnackbarInfo(() => {
      return [true, msg];
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarInfo([false, ""]);
  };

  return (
    <Container>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant={"h3"} style={{ margin: "2em 0 0.5em 0" }}>
          Parties 🎉
        </Typography>

        <FormControl sx={{ m: 1, width: "75%" }}>
          {displayValidationErrorsFor("name")}
          <TextField
            id="party_name"
            label="Party Name"
            variant="outlined"
            onChange={handleNameChange}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "75%" }}>
          {displayValidationErrorsFor("description")}
          <TextField
            id="outlined-multiline-flexible"
            className={description === null ? "deactivated" : ""}
            label="Description"
            multiline
            rows={4}
            value={description === null ? "" : description}
            onChange={handleDescriptionChange}
          />
        </FormControl>
        {displayValidationErrorsFor("cost_per_guest")}
        <FormControl sx={{ m: 1, width: "75%" }} variant="standard">
          <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
          <Input
            id="standard-adornment-amount"
            value={costPerGuest}
            onChange={handleCostPerGuestChange}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "75%" }}>
          <Button
            color={"primary"}
            variant={"contained"}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </FormControl>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        message={message}
        onClose={() => {
          setSnackbarInfo([false, ""]);
        }}
      >
        <Alert
          onClose={() => {
            setSnackbarInfo([false, ""]);
          }}
          severity="error"
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PartyForm;
