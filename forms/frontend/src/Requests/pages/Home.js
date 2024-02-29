import Header from "../components/Header";
import { ThemeProvider } from "@mui/material/styles";
import { requestsFormTheme } from "../themes";

import "./Home.css";

const Home = () => {
  return (
    <ThemeProvider theme={requestsFormTheme}>
      <div className="container">
        <Header
          title={"Song Requests Submission Form"}
          subtitle={
            "Please ask your event coordinator for the link to your event's request form!"
          }
        ></Header>
      </div>
    </ThemeProvider>
  );
};

export default Home;
