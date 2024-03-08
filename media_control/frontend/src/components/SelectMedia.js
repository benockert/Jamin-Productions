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
  openDialog,
  media,
  handleClose,
  handleSubmit,
  selected,
  setSelected,
}) {
  const handleChange = (event) => {
    setSelected(event.target.value || "");
  };

  return (
    <div>
      <Dialog disableEscapeKeyDown open={!!openDialog} onClose={handleClose}>
        <DialogTitle>{openDialog.screen_name}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-dialog-select-label">
                Select new media
              </InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={selected}
                onChange={handleChange}
                input={<OutlinedInput label="Select new media" />}
              >
                {media.map((m) => {
                  return (
                    m.orientation == openDialog.orientation && (
                      <MenuItem key={m.url_name} value={m.url_name}>
                        {m.short_name}
                      </MenuItem>
                    )
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={(event) => handleSubmit(event, selected)}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
