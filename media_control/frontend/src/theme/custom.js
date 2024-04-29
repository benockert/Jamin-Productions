import Chip from "@mui/material/Chip";
import { styled } from "@mui/system";

export const ScreenInfoChip = styled(Chip)(({ theme }) => ({
  outline: "2px solid",
  outlineColor: theme.palette.primary.secondary,
  backgroundColor: theme.palette.primary.main,
  paddingLeft: 5,
  ".MuiChip-icon": {
    color: theme.palette.secondary.main,
  },
  fontSize: "13px",
}));
