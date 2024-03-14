import React, { useState, useEffect } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
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
  border: "none",
  outlineStyle: "solid", // border with transparency
  outlineWidth: outlinecolor === "success" ? "2px" : "1px", // appear bold if success
  outlineColor: outlinecolor
    ? theme.palette.primary[outlinecolor]
    : "rgba(255,255,255,0.25)",
  borderRadius: "1em",
  MozBorderRadius: "1em",
  WebkitBorderRadius: "1em",
  width: "98%", // make fill same size as form field (minus a bit for outline (vs. border))
  height: "98%", // make fill same size as form field (minus a bit for outline (vs. border))
  boxShadow: "none", // remove shadow
  "&:hover": {
    outline: "solid " + theme.palette.primary.main,
    outlineWidth: outlinecolor === "success" ? "2px" : "1px",
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
  const [submissionInProgress, setSubmissionInProgress] = useState(false);

  const handleFormFieldChange = (event) => {
    setFormMessage({});
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
  };

  const clearFile = (error) => {
    setFileError(error);
    setFile();
    setFileUploaded();
    document.getElementById("file-upload").value = ""; // reset input file name so next upload triggers change even if same file
  };

  const resetForm = () => {
    clearFile(false);
    setFormFields(defaultFormFields);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!fileUploaded) {
      console.log("No file selected");
      clearFile(true);
    } else {
      setSubmissionInProgress(true);
      postData(`media/${eventId}/photo_mosaic`, {
        name: data.get("name"),
        message: data.get("message"),
        fileName: data.get("photo-upload").name,
        fileType: data.get("photo-upload").type,
      }).then(async (data) => {
        if (data.result === "success") {
          console.log("Got presigned url, uploading photo");
          const result = await putImage(data.presignedUrl, file);
          if (result.statusCode !== 200) {
            console.error("Photo did not upload successfully");
            // override for message with file upload error
            data = { result: "error", message: "Error uploading your photo." };
          }
          resetForm();
        }
        setSubmissionInProgress(false);
        setFormMessage({ result: data.result, message: data.message });
      });
    }
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
        setFormMessage({
          message: "Selected photo is too large.",
        });
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
          <Grid item xs={12} sm={4} order={{ xs: 1, sm: 2 }}>
            <FileButton
              disabled={submissionInProgress}
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
                id="file-upload"
                onChange={handleUpload}
                accept=".jpg,.jpeg,.png"
                required="required"
                type="file"
                name="photo-upload"
                hidden
              />
            </FileButton>
          </Grid>
          <Grid item xs={12} sm={8} order={{ xs: 2, sm: 1 }}>
            <TextInput
              autoComplete="off" // change to full name
              name="name"
              fullWidth
              id="form-field-name"
              label="Name (optional)"
              onChange={handleFormFieldChange}
              inputProps={{ maxLength: 30, tabIndex: "1" }}
              value={formFields.name}
              disabled={submissionInProgress}
            />
          </Grid>
          <Grid item xs={12} order={{ xs: 3 }}>
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
              disabled={submissionInProgress}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          disabled={submissionInProgress ? true : fileUploaded ? false : true}
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            height: "40px", // hard set so Circular Progress doesn't change size
            background: fileUploaded
              ? "linear-gradient(to right, #f21f4d, #f7eb3b)"
              : undefined,
          }}
        >
          {submissionInProgress ? (
            <CircularProgress sx={{ p: 1, m: 0 }} variant="indeterminate" />
          ) : (
            "Submit"
          )}
        </Button>
        {formMessage.message && (
          <Box
            className="form-message"
            sx={{
              "& .MuiChip-outlined": {
                border: "none",
                width: "100%",
                fontSize: {
                  xs: "1em",
                  sm: "1.1em",
                },
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
