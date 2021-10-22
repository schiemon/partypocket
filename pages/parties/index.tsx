import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Party as PartyType } from "@prisma/client";
import Party from "../components/Party";
import useSWR, { mutate, SWRConfig } from "swr";
import {
  API_PARTIES_ENDPOINT,
  PARTY_DESCRIPTION_MAX_LEN,
  PARTY_MAX_COST_PER_GUEST,
  PARTY_NAME_MAX_LEN,
  PARTY_NAME_MIN_LEN,
} from "../lib/constants";
import urljoin from "url-join";
import { ChangeEvent, FormEvent, useState } from "react";
import assert from "assert";
import { PartyCreationData } from "../lib/Party";
import useDidMountEffect from "../utils/useDidMountEffect";

type PartySubmitData = PartyCreationData;
type PartySubmitAttribute = keyof PartySubmitData;

const PartyForm = () => {
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

  const onSubmit = async (e: FormEvent) => {
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

      await fetch(API_PARTIES_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(partySubmitData),
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

  return (
    <>
      <form onSubmit={onSubmit}>
        {displayValidationErrorsFor("name")}
        <label htmlFor={"party_name"}>Name: </label>
        <input
          name={"party_name"}
          value={name}
          onChange={handleNameChange}
        />{" "}
        <br />
        {displayValidationErrorsFor("description")}
        <label
          className={description === null ? "deactivated" : ""}
          htmlFor={"party_description"}
        >
          Description:
          <textarea
            name={"party_description"}
            value={description === null ? "" : description}
            placeholder={"Hello friends..."}
            onChange={handleDescriptionChange}
          />{" "}
        </label>
        <br />
        {displayValidationErrorsFor("cost_per_guest")}
        <label htmlFor={"party_cost_per_guest"}>Cost per guest: </label>
        <input
          name={"party_cost_per_guest"}
          type={"number"}
          min={1}
          max={PARTY_MAX_COST_PER_GUEST}
          value={costPerGuest}
          onChange={handleCostPerGuestChange}
        />{" "}
        <br />
        <button>Create</button>
      </form>
    </>
  );
};

const PartyList = () => {
  const { data, error } = useSWR<PartyType[]>(
    API_PARTIES_ENDPOINT,
    (url: string) => fetch(url).then((r) => r.json())
  );

  if (error) return <div>Cannot load parties...</div>;
  if (!data) return <div>Loading...</div>;

  const parties = data;

  const getPostDeleteHandler = (party_id: string) => async (_: any) => {
    const specificPartyEndpoint = urljoin(API_PARTIES_ENDPOINT, party_id);
    await fetch(specificPartyEndpoint, { method: "DELETE" });
    await mutate(API_PARTIES_ENDPOINT);
  };

  const formPartyList = (parties_to_list: PartyType[]) => {
    if (parties_to_list.length > 0) {
      return (
        <>
          <p>Total number of parties: {parties_to_list.length}</p>
          {parties_to_list.map((party) => (
            <Party
              key={party.id}
              party={party}
              handlePostDelete={getPostDeleteHandler(party.id)}
            />
          ))}
        </>
      );
    } else {
      return <div>No parties 😔.</div>;
    }
  };

  return <div>{formPartyList(parties)}</div>;
};

const Parties = () => {
  return (
    <>
      <h1>Parties 🎉</h1>
      <PartyForm />
      <SWRConfig
        value={{
          refreshInterval: 3000,
        }}
      >
        <PartyList />
      </SWRConfig>
    </>
  );
};

export default withPageAuthRequired(Parties);
