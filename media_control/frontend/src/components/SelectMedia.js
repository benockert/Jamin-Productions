import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function ChooseMediaPopupDialog({
  screen,
  media,
  handleClose,
  handleSubmit,
}) {
  const [selectedMediaId, setSelectedMediaId] = useState(
    screen.current_media_id
  );

  const handleChange = (event) => {
    event.preventDefault();
    setSelectedMediaId(event.target.value || "");
  };

  const options = Array.from(Object.values(media)).map((m) => {
    return (
      m.orientation == screen.orientation && (
        <MenuItem key={m.id} value={m.id}>
          {m.short_name}
        </MenuItem>
      )
    );
  });

  return (
    <div>
      <Dialog disableEscapeKeyDown open={!!screen} onClose={handleClose}>
        <DialogTitle>{screen.name}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-dialog-select-label">
                Select new media
              </InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={selectedMediaId}
                onChange={handleChange}
                input={<OutlinedInput label="Select new media" />}
              >
                {options}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={(event) => handleSubmit(event, screen.id, selectedMediaId)}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
