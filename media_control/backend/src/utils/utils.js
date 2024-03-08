import * as url from "url";

// reference the src/ directory, which is the parent directory of the current directory, hence ..
const __dirname = url.fileURLToPath(new URL("..", import.meta.url));

const options = {
  root: __dirname + "/html/",
  dotfiles: "deny",
};

export const redirectPage = (res, eventId, sourceName, statusCode) => {
  res
    .status(statusCode || 200)
    .sendFile(`${eventId}/${sourceName}.html`, options);
};
