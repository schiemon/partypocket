import { Guest } from "@prisma/client";
import List from "@mui/material/List";
import GuestListItem, { GuestDeleteHandler } from "./GuestListItem";

type GuestCheckedChangeHandler = (guest: Guest) => void;
export type CheckableGuests = Guest & { checked: boolean };

const GuestList = ({
  guests,
  handleDelete,
  costPerGuest,
  onClick,
  selected,
}: {
  guests: Guest[];
  handleDelete: GuestDeleteHandler;
  costPerGuest: number;
  onClick: (guest: Guest) => void;
  selected: string | null;
}) => {
  const guestListItems = guests.map((guest) => (
    <GuestListItem
      key={guest.id}
      guest={guest}
      costPerGuest={costPerGuest}
      handleDelete={handleDelete}
      selected={selected !== null && guest.id === selected}
      onClick={onClick}
    />
  ));

  return <List sx={{ width: "100%" }}>{guestListItems}</List>;
};

export default GuestList;
