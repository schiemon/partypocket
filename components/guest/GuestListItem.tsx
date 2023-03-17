import { Paper } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { Guest } from "@prisma/client";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { red, green } from "@mui/material/colors";

export type GuestDeleteHandler = (guest: Guest) => void;
type GuestCheckedChangeHandler = (guest: Guest) => void;

const GuestListItem = ({
  guest,
  handleDelete,
  costPerGuest,
  onClick,
  selected,
}: {
  guest: Guest;
  handleDelete: GuestDeleteHandler;
  costPerGuest: number;
  selected: boolean;
  onClick: (guest: Guest) => void;
}) => {
  const labelId = `checkbox-list-label-${guest.id}`;

  return (
    <Paper>
      <ListItem
        key={guest.id}
        sx={{
          marginBottom: 1,
        }}
        selected={selected}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="comments"
            onClick={() => handleDelete(guest)}
          >
            <DeleteIcon />
          </IconButton>
        }
        disablePadding
        onClick={() => onClick(guest)}
      >
        <ListItemButton role={undefined} dense>
          <ListItemIcon>
            {guest.paid === costPerGuest ? (
              <CheckCircleIcon sx={{ color: green[300] }} />
            ) : (
              <CancelIcon sx={{ color: red[300] }} />
            )}
          </ListItemIcon>
          <ListItemText
            id={labelId}
            primary={`${guest.name}`}
            secondary={`Paid: ${guest.paid} / ${costPerGuest}`}
          />
        </ListItemButton>
      </ListItem>
    </Paper>
  );
};

export default GuestListItem;
