import React, { useState, useEffect } from "react";
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
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Typography from "@mui/material/Typography";

export const ChooseMediaPopupDialog = ({
  screen,
  media,
  handleClose,
  handleSubmit,
}) => {
  const [selectedMediaId, setSelectedMediaId] = useState(
    screen.current_media_id
  );

  const handleChange = (event) => {
    event.preventDefault();
    setSelectedMediaId(event.target.value || "");
  };

  useEffect(() => {
    setSelectedMediaId(screen.current_media_id);
  }, [screen.current_media_id]);

  const options = Array.from(Object.values(media)).map((m) => {
    return (
      m.orientation === parseInt(screen.orientation) && (
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
};

export const VolumeSliderPopup = ({ screen, handleClose, handleSubmit }) => {
  const [volume, setVolume] = useState(
    parseInt(screen.current_playback_volume)
  );

  const handleVolumeChange = (event, newVolume) => {
    event.preventDefault();
    // TODO: errored on 0
    setVolume(newVolume);
  };

  useEffect(() => {
    setVolume(parseInt(screen.current_playback_volume));
  }, [screen.current_playback_volume]);

  return (
    <Dialog onClose={handleClose} open={!!screen}>
      <DialogTitle>
        <Typography variant="body2" color="text.secondary">
          Playback volume
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: 200, padding: 1 }}>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <VolumeOffIcon />
            <Slider
              min={0}
              max={100}
              aria-label="Volume"
              value={volume}
              onChange={handleVolumeChange}
              onChangeCommitted={() => handleSubmit(volume)}
            />
            <VolumeUpIcon />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ marginTop: -3 }}>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
