import Box from "@mui/material/Box";

const FloatingImages = () => {
  const portraitHeader = "CommencementWeek2024_portrait.png";
  const landscapeHeader = "CommencementWeek2024_landscape.png";
  const footer = "LikeAHusky.png";

  return (
    <>
      <Box
        component="img"
        sx={{
          content: {
            xs: `url(/images/photos/${portraitHeader})`,
            md: `url(/images/photos/${landscapeHeader})`,
          },
          position: "absolute",
          top: {
            xs: "auto",
            md: "2em",
          },
          bottom: {
            xs: "2em",
            md: "auto",
          },
          left: "2em",
          height: {
            xs: "auto",
            md: "clamp(300px, 400px, 40%)",
          },
          width: {
            xs: "clamp(200px, 70%, 300px)",
            md: "auto",
          },
        }}
        alt="Header"
      />
      <Box
        component="img"
        sx={{
          content: `url(/images/photos/${footer})`,
          position: "absolute",
          top: {
            xs: "1em",
            md: "auto",
          },
          bottom: {
            xs: "auto",
            md: "1em",
          },
          right: "0.5em",
          height: "auto",
          width: "clamp(150px, 20%, 250px)",
        }}
        alt="Header"
      />
    </>
  );
};

export default FloatingImages;
