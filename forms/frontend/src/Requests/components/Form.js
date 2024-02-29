import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import "./Form.css";

const formValidationSchema = yup.object({
  song: yup.string().required("Song title is required"),
  artist: yup.string().required("Artist name is required"),
  name: yup.string(),
  notes: yup.string(),
});

export const Form = ({
  children,
  handleSubmit,
  clearMessages,
  formDisabled,
}) => {
  const formik = useFormik({
    validationSchema: formValidationSchema,
    initialValues: {
      name: "",
      song: "",
      artist: "",
      notes: "",
    },
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values);
      resetForm();
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
      className="requests-form"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          clearMessages();
          formik.handleSubmit();
        }}
      >
        <TextField
          fullWidth
          className="form-field"
          id="form-song-title"
          name="song"
          label="Song title"
          disabled={formDisabled}
          value={formik.values.song}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.song && Boolean(formik.errors.song)}
          helperText={formik.touched.song && formik.errors.song}
        />
        <TextField
          fullWidth
          className="form-field"
          id="form-song-artist"
          name="artist"
          label="Artist name"
          disabled={formDisabled}
          value={formik.values.artist}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.artist && Boolean(formik.errors.artist)}
          helperText={formik.touched.artist && formik.errors.artist}
        />
        <TextField
          fullWidth
          className="form-field"
          id="form-name"
          name="name"
          label="Your name (optional)"
          disabled={formDisabled}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          className="form-field"
          id="form-request-notes"
          name="notes"
          label="Notes (optional)"
          disabled={formDisabled}
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.notes && Boolean(formik.errors.notes)}
          helperText={formik.touched.notes && formik.errors.notes}
        />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          disabled={formDisabled || formik.isSubmitting}
        >
          Submit
        </Button>
      </form>
      {!!children && <div className="form-children">{children}</div>}
    </Box>
  );
};
