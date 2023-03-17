import "react";
import { Party as PartyType } from "@prisma/client";
import { MouseEventHandler } from "react";
import uj from "url-join";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import Link from "./Link";
import DeleteIcon from "@mui/icons-material/Delete";
import { BASE_URL } from "../lib/constants";

const Party = ({
  party,
  handlePostDelete,
}: {
  party: PartyType;
  handlePostDelete: MouseEventHandler;
}) => {
  // TODO: Render with and without guests,

  return (
    <>
      <Card variant={"outlined"}>
        <Paper>
          <CardContent>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography variant={"h6"} color="text.primary" gutterBottom>
                  <Link href={uj(BASE_URL, "parties", party.id)}>
                    {party.name}
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography gutterBottom variant="h6" component="div">
                  {party.cost_per_guest}€
                </Typography>
              </Grid>
            </Grid>
            <Divider variant="fullWidth" />
            <p>{party.description}</p>
          </CardContent>
          <CardActions>
            <Grid
              container
              direction={"row"}
              justifyContent="flex-end"
              alignItems="center"
            >
              <Box m={1}>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  onClick={handlePostDelete}
                  endIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Box>
            </Grid>
          </CardActions>
        </Paper>
      </Card>
    </>
  );
};

export default Party;
