import {
  Box,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Layout from "../../components/Layout";
import useSWR, { useSWRConfig } from "swr";
import { API_GUEST_ENDPOINT, API_PARTIES_ENDPOINT } from "../../lib/constants";
import { useRouter } from "next/router";
import urljoin from "url-join";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { Guest, Party } from "@prisma/client";
import GuestList, { CheckableGuests } from "../../components/guest/GuestList";
import GuestForm, {
  GuestSubmitHandler,
} from "../../components/guest/GuestForm";
import { spacing } from "@mui/system";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import { GuestDeleteHandler } from "../../components/guest/GuestListItem";
import { GuestDraft, GuestSelectionData, GuestUpdatable } from "../api/guest";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabContainer(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      style={{ ...spacing({ pt: 2 }) }}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

function SettingsTab() {
  return <div>Settings</div>;
}

function GuestManagementTab({
  party,
  triggerSnackbar,
}: {
  party: Party;
  triggerSnackbar: (message: string) => void;
}) {
  const getBlankGuest = (): GuestDraft => {
    return {
      name: "",
      party_id: party.id,
      paid: 0,
    };
  };

  const { mutate } = useSWRConfig();
  const [[guestUpdatingOrCreating, creating], setGuestUpdatingOrCreating] =
    useState<[GuestUpdatable | GuestDraft, boolean]>([getBlankGuest(), true]);

  const endpointToFetchGuests = urljoin(API_GUEST_ENDPOINT, party.id);
  const errorHandler = async (r: Response) => {
    const responseBody = await r.text();
    if (!r.ok) {
      try {
        const error = await JSON.parse(responseBody);
        if (error.error && error.error.message) {
          triggerSnackbar(error.error.message);
        } else {
          triggerSnackbar("An unknown error occurred.");
        }
      } catch (error) {
        triggerSnackbar(`An unknown error occurred: '${responseBody}'.`);
      }
      throw r;
    }
    return r;
  };

  const mutateTrigger = (url: string) => async (r: Response) => {
    await mutate(url);
  };
  const handleSubmit: GuestSubmitHandler = () => {
    if (creating) {
      fetch(API_GUEST_ENDPOINT, {
        method: "POST",
        headers: new Headers([["Content-type", "application/json"]]),
        body: JSON.stringify({
          ...guestUpdatingOrCreating,
          party_id: party.id,
        }),
      })
        .then(errorHandler)
        .then(mutateTrigger(endpointToFetchGuests));
    } else {
      fetch(API_GUEST_ENDPOINT, {
        method: "PUT",
        headers: new Headers([["Content-type", "application/json"]]),
        body: JSON.stringify({
          id: (guestUpdatingOrCreating as GuestUpdatable).id,
          name: guestUpdatingOrCreating.name,
          paid: guestUpdatingOrCreating.paid,
        }),
      })
        .then(errorHandler)
        .then(mutateTrigger(endpointToFetchGuests));
    }

    setGuestUpdatingOrCreating([getBlankGuest(), true]);
  };

  const handleDelete: GuestDeleteHandler = (guest: GuestSelectionData) => {
    fetch(API_GUEST_ENDPOINT, {
      method: "DELETE",
      headers: new Headers([["Content-type", "application/json"]]),
      body: JSON.stringify({ id: guest.id }),
    })
      .then(errorHandler)
      .then(mutateTrigger(endpointToFetchGuests));
  };

  const handleClick = (guest: Guest) => {
    setGuestUpdatingOrCreating([guest, false]);
  };

  const { data: guestsData, error: guestsError } = useSWR(
    endpointToFetchGuests,
    (url) => fetch(url).then((r) => r.json())
  );

  if (guestsError) {
    return <ErrorMessage error={guestsError} />;
  }

  if (!guestsData) {
    return <Loading />;
  }

  const guests = guestsData as Guest[];

  let noGuestMessage = null;
  if (guests.length === 0)
    noGuestMessage = (
      <Grid item>
        <p>Currently there are no guests set up.</p>
      </Grid>
    );

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
    >
      <GuestForm
        guestInProgress={guestUpdatingOrCreating}
        creating={creating}
        partyInfoForGuest={party}
        handleSubmit={handleSubmit}
        handleUpdate={(
          guestUpdatingOrCreating: GuestDraft | GuestUpdatable
        ) => {
          setGuestUpdatingOrCreating([guestUpdatingOrCreating, creating]);
        }}
      />
      <GuestList
        guests={guests}
        selected={
          creating ? null : (guestUpdatingOrCreating as GuestUpdatable).id
        }
        handleDelete={handleDelete}
        costPerGuest={party.cost_per_guest}
        onClick={handleClick}
      />
      {noGuestMessage}
    </Stack>
  );
}

function PartyPage() {
  const partyId = useRouter().query.partyId as string;
  const [{ open, message }, setSnackbarInfo] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  const triggerSnackbar = (message: string) => {
    setSnackbarInfo({
      open: true,
      message,
    });
  };

  const { data: partyData, error: partyError } = useSWR(
    urljoin(API_PARTIES_ENDPOINT, partyId),
    (url) => {
      return fetch(url)
        .then((r) => r.json())
        .then((r) => {
          if (r.error && r.error.message) {
            throw new Error(r.error.message);
          } else {
            return r;
          }
        });
    }
  );

  const [currentTab, setCurrentTab] = useState<number>(0);

  if (partyError)
    return (
      <Layout>
        <ErrorMessage error={partyError.toString()} />
      </Layout>
    );

  if (!partyData)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  const party = partyData as Party;

  return (
    <Layout>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Box sx={{ margin: "2em 0 1em 0" }}>
          <Typography variant={"h4"}>{party.name}</Typography>
        </Box>

        <Divider variant="middle" style={{ width: "100%" }} />

        <Box>
          <Tabs
            value={currentTab}
            onChange={(_, nextTab) => setCurrentTab(nextTab)}
            aria-label="icon label tabs example"
          >
            <Tab icon={<SettingsIcon />} label="SETTINGS" />
            <Tab icon={<PeopleIcon />} label="GUESTS" />
          </Tabs>
        </Box>
        <Box>
          <TabContainer value={currentTab} index={0}>
            <SettingsTab />
          </TabContainer>
          <TabContainer value={currentTab} index={1}>
            <GuestManagementTab
              party={party}
              triggerSnackbar={triggerSnackbar}
            />
          </TabContainer>
        </Box>
      </Stack>
      <ErrorSnackbar
        open={open}
        message={message}
        onClose={(event, reason) =>
          setSnackbarInfo({ open: false, message: "" })
        }
      />
    </Layout>
  );
}
export default withPageAuthRequired(PartyPage);
