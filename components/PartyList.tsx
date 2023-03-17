import useSWR, { mutate } from "swr";
import { Party as PartyType } from "@prisma/client";
import { API_PARTIES_ENDPOINT } from "../lib/constants";
import { Container, Stack } from "@mui/material";
import Party from "./Party";
import React from "react";
import uj from "url-join";

const PartyList = () => {
  const { data, error } = useSWR<PartyType[]>(
    API_PARTIES_ENDPOINT,
    (url: string) => fetch(url).then((r) => r.json())
  );

  if (error) return <div>Cannot load parties...</div>;
  if (!data) return <div>Loading...</div>;

  const parties = data;

  const getPostDeleteHandler = (party_id: string) => async (_: any) => {
    const specificPartyEndpoint = uj(API_PARTIES_ENDPOINT, party_id);
    await fetch(specificPartyEndpoint, { method: "DELETE" });
    await mutate(API_PARTIES_ENDPOINT);
  };

  const formPartyList = (parties_to_list: PartyType[]) => {
    if (parties_to_list.length > 0) {
      return (
        <Container>
          <Stack spacing={2}>
            <p>Total number of parties: {parties_to_list.length}</p>
            {parties_to_list.map((party) => (
              <Party
                key={party.id}
                party={party}
                handlePostDelete={getPostDeleteHandler(party.id)}
              />
            ))}
          </Stack>
        </Container>
      );
    } else {
      return <div>No parties 😔.</div>;
    }
  };

  return <div>{formPartyList(parties)}</div>;
};

export default PartyList;
