import Box from "@mui/material/Box";

const FloatingImages = (props) => {
  const {
    header_portrait: portraitHeader,
    header_landscape: landscapeHeader,
    footer_portrait: portraitFooter,
    footer_landscape: landscapeFooter,
  } = props.eventInfo;
  return (
    <>
      <Box
        component="img"
        sx={{
          content: {
            xs: `url(${portraitHeader})`,
            md: `url(${landscapeHeader})`,
          },
          position: "absolute",
          top: {
            xs: "auto",
            md: "25px",
          },
          bottom: {
            xs: "25px",
            md: "auto",
          },
          left: "25px",
          height: {
            xs: "auto",
            md: "clamp(250px, 45%, 375px)",
          },
          width: {
            xs: "clamp(200px, 70%, 300px)",
            md: "auto",
          },
        }}
        alt="Header"
      />
      <Box component="footer">
        <Box
          component="img"
          sx={{
            content: {
              xs: `url(${portraitFooter})`,
              md: `url(${landscapeFooter})`,
            },
            position: "absolute",
            top: {
              xs: "13px",
              md: "auto",
            },
            bottom: {
              xs: "auto",
              md: "13px",
            },
            right: "7px",
            height: "auto",
            width: "clamp(150px, 25%, 275px)",
          }}
          alt="Footer"
        />
      </Box>
    </>
  );
};

export default FloatingImages;
