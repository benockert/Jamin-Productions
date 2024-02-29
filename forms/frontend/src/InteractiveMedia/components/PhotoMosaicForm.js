import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FileUploadIcon from "@mui/icons-material/FileUpload";
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
const FileButton = styled(Button)(({ theme }) => ({
  background: "rgba(0, 0, 0, 0)", // transparent
  border: "1px solid rgba(255,255,255,0.25)", // border with transparency
  borderRadius: "1em",
  MozBorderRadius: "1em",
  WebkitBorderRadius: "1em",
  width: "100%", // make fill same size as form field
  height: "100%", // make fill same size as form field
  boxShadow: "none", // remove shadow
  "&:hover": {
    border: "1px solid " + theme.palette.primary.main,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
}));

const FormDetails = {
  title: "Submit A Photo to the Class of 2024 Photo Mosaic",
};

const PhotoMosaicForm = ({ eventId }) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [file, setFile] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({ data });
    console.log({
      name: data.get("name"),
      email: data.get("message"),
      file: data.get("photo-upload"),
    });

    postData(`media/${eventId}/photo_mosaic`, {
      name: data.get("name"),
      message: data.get("message"),
      fileName: data.get("photo-upload").name,
      // todo add photo type
    }).then((data) => {
      console.log(data);
      if (data.result === "success") {
        console.log("Got presigned url, uploading photo");
        const result = putImage(data.presignedUrl, file);
        console.log(result.statusCode);
      }
    });
  };

  const handleUpload = (event) => {
    event.preventDefault();
    setFileUploaded(true);
    setFile(event.target.files[0]);
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
        m: 3,
        backgroundColor: "rgba(80,60,80,.6)",
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
        {FormDetails.title}
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
              id="name"
              label="Name (optional)"
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
            >
              Upload Photo
              <input
                onChange={handleUpload}
                accept="image/*"
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
              id="message"
              label="Message (optional)"
              name="message"
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Submit
        </Button>
      </Box>
    </Grid>
  );
};

export default PhotoMosaicForm;
