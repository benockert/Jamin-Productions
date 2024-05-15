import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
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
import CircularProgress from "@mui/material/CircularProgress";

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
  const [loading, setLoading] = useState(false);

  const iconSize = 25;

  const handleVolumeChange = (event, newVolume) => {
    event.preventDefault();
    setVolume(newVolume);
  };

  // handle when the screen updates with new playback volume
  useEffect(() => {
    setVolume(parseInt(screen.current_playback_volume));
    setLoading(false);
  }, [screen.current_playback_volume]);

  const changeVolume = async (newVolume) => {
    setLoading(true);
    const success = await handleSubmit(newVolume);
    if (!success) {
      // reset on error
      setVolume(parseInt(screen.current_playback_volume));
      setLoading(false);
    }
  };

  const handleVolumeChangeCommitted = async () => {
    changeVolume(volume);
  };

  const handleVolumePresetClick = async (event) => {
    event.preventDefault();
    const newVolume = parseInt(event.target.innerText, 0);
    setVolume(newVolume);
    changeVolume(newVolume);
  };

  return (
    <Dialog onClose={handleClose} open={!!screen}>
      <DialogTitle>
        <Typography variant="body2" color="text.secondary">
          Music volume
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mb: -1 }}>
        <Stack alignItems="center">
          <Box sx={{ width: 250, padding: 1 }}>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 2, width: "100%" }}
              alignItems="center"
            >
              <VolumeOffIcon sx={{ fontSize: iconSize }} />
              <Slider
                min={0}
                max={100}
                aria-label="Volume"
                value={volume}
                onChange={handleVolumeChange}
                onChangeCommitted={handleVolumeChangeCommitted}
              />
              <VolumeUpIcon sx={{ fontSize: iconSize }} />
            </Stack>
          </Box>
          <ButtonGroup
            sx={{ height: 38, maxHeight: 38, width: "90%", maxWidth: "90%" }}
            variant="outlined"
            aria-label="Preset volume buttons"
          >
            <Button onClick={handleVolumePresetClick}>0</Button>
            <Button onClick={handleVolumePresetClick}>25</Button>
            <Button onClick={handleVolumePresetClick}>50</Button>
            <Button onClick={handleVolumePresetClick}>75</Button>
            <Button onClick={handleVolumePresetClick}>100</Button>
          </ButtonGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        {loading && <CircularProgress size={iconSize} />}
        <Button sx={{ fontSize: 16 }} onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
