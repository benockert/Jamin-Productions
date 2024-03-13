const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.jaminproductions.com/"
    : "https://pm0v1kb80m.execute-api.us-west-2.amazonaws.com/"; // https://hb222ae3qg.execute-api.us-east-1.amazonaws.com/

export async function postData(path, data = {}) {
  try {
    console.log(data);
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    });
    const json = response.json();
    return json;
  } catch (error) {
    return {
      result: "error",
      message: "An error has occurred. Please try again.",
    };
  }
}

export async function putImage(url, file) {
  // const blob = new Blob([file]);
  const headers = new Headers({
    "Content-Type": file.type,
    "Content-Length": file.size,
  });
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: file,
  });
  return { statusCode: response.status };
}

export async function getData(path) {
  try {
    const response = await fetch(`${API_URL}${path}`);
    const body = await response.json();
    return { statusCode: response.status, data: body };
  } catch (error) {
    return {};
  }
}
