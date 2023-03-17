import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import React from "react";
import PartyForm from "../../components/PartyForm";
import PartyList from "../../components/PartyList";

const PartiesPage = () => {
  return (
    <>
      <PartyForm />
      <PartyList />
    </>
  );
};

export default withPageAuthRequired(PartiesPage);
