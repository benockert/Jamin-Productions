import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Chip from "@mui/material/Chip";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { postData, putImage } from "../../api";

// styled text field
const TextInput = styled(TextField)(({ theme }) => ({}));
TextInput.defaultProps = {
  InputProps: {
    // rounded edges
    sx: {
      borderRadius: "1em",
      MozBorderRadius: "1em",
      WebkitBorderRadius: "1em",
    },
  },
  variant: "outlined",
};

// make the file upload button look similar to a text field
const FileButton = styled(Button)(({ outlinecolor, theme }) => ({
  background: "rgba(0, 0, 0, 0)", // transparent
  borderStyle: "solid", // border with transparency
  borderWidth: outlinecolor == "success" ? "2px" : "1px", // appear bold if success
  borderColor: outlinecolor
    ? theme.palette.primary[outlinecolor]
    : "rgba(255,255,255,0.25)",
  borderRadius: "1em",
  MozBorderRadius: "1em",
  WebkitBorderRadius: "1em",
  width: "100%", // make fill same size as form field
  height: "100%", // make fill same size as form field
  boxShadow: "none", // remove shadow
  "&:hover": {
    border: "solid " + theme.palette.primary.main,
    borderWidth: outlinecolor == "success" ? "2px" : "1px",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
}));

const defaultFormFields = { name: "", message: "" };

const PhotoMosaicForm = ({ eventId, formTitle, maxMessageLength }) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [file, setFile] = useState();
  const [formMessage, setFormMessage] = useState({});
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [fileError, setFileError] = useState(false);

  const handleFormFieldChange = (event) => {
    setFormMessage({});
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
  };

  const clearFile = (error) => {
    setFileError(error);
    setFile();
    setFileUploaded();
  };

  const resetForm = () => {
    clearFile(false);
    setFormFields(defaultFormFields);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!fileUploaded) {
      console.error("No file uploaded");
      clearFile(true);
    }

    postData(`media/${eventId}/photo_mosaic`, {
      name: data.get("name"),
      message: data.get("message"),
      fileName: data.get("photo-upload").name,
      fileType: data.get("photo-upload").type,
    }).then(async (data) => {
      setFormMessage({ result: data.result, message: data.message });
      if (data.result === "success") {
        resetForm();
        console.log("Got presigned url, uploading photo");
        const result = await putImage(data.presignedUrl, file);
        console.log("Photo upload result:", result.statusCode);
      }
    });
  };

  const handleUpload = (event) => {
    event.preventDefault();
    const file = event.target?.files[0];

    if (file) {
      // 15MB limit
      if (file.size > 15000000) {
        setFileUploaded(false);
        setFile();
        setFileError(true);
        setFormMessage({ message: "Selected photo is too large (max 15 MB)" });
      } else {
        setFileUploaded(true);
        setFile(file);
        setFormMessage({});
      }
    } else {
      // upload dialog was likely cancelled by the user
      console.log("File upload dialog cancelled by user");
      clearFile(true);
    }
  };

  return (
    <Grid
      item
      sx={{
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        pb: 1.5, // bottom padding below button/chip
        m: 3,
        backgroundColor: "rgba(80,60,80,.7)",
        color: "#fff",
        borderRadius: "12px",
        minWidth: "40vw",
        maxHeight: "70vh",
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        sx={{
          marginTop: 1,
        }}
      >
        {formTitle}
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          marginTop: 1,
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          p: {
            xs: 1,
            sm: 2,
          }, // padding between the scrollbar
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <TextInput
              autoComplete="off" // change to full name
              name="name"
              fullWidth
              id="form-field-name"
              label="Name (optional)"
              onChange={handleFormFieldChange}
              inputProps={{ maxLength: 30, tabIndex: "1" }}
              value={formFields.name}
            />
          </Grid>
          <Grid item xs={12} sm={4} order={{ xs: 3, sm: 2 }}>
            <FileButton
              variant="contained"
              component="label"
              startIcon={
                fileUploaded ? (
                  <TaskAltIcon color="success" />
                ) : (
                  <FileUploadIcon color="primary" />
                )
              }
              outlinecolor={
                fileUploaded ? "success" : fileError ? "error" : undefined
              }
            >
              Upload Photo
              <input
                onChange={handleUpload}
                accept=".jpg,.jpeg,.png"
                required="required"
                type="file"
                name="photo-upload"
                hidden
              />
            </FileButton>
          </Grid>
          <Grid item xs={12} order={{ xs: 2, sm: 3 }}>
            <TextInput
              fullWidth
              multiline
              id="form-field-message"
              label="Message (optional)"
              name="message"
              autoComplete="off"
              inputProps={{ maxLength: maxMessageLength ?? 60, tabIndex: "2" }}
              onChange={handleFormFieldChange}
              value={formFields.message}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          disabled={fileUploaded ? false : true}
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            background: fileUploaded
              ? "linear-gradient(to right, #f21f4d, #f7eb3b)"
              : undefined,
          }}
        >
          Submit
        </Button>
        {formMessage.message && (
          <Box
            className="form-message"
            sx={{
              "& .MuiChip-outlined": {
                border: "none",
                width: "100%",
                fontSize: "1em",
                fontWeight: 600,
              },
            }}
          >
            {formMessage.result === "success" ? (
              <Chip
                icon={<FileDownloadDoneIcon />}
                label={formMessage.message}
                color="success"
                variant="outlined"
              />
            ) : formMessage.result === "error" ? (
              <Chip
                icon={<HighlightOffIcon />}
                label={formMessage.message}
                color="primary"
                variant="outlined"
              />
            ) : (
              <Chip
                icon={<WarningAmberIcon />}
                label={formMessage.message}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default PhotoMosaicForm;
