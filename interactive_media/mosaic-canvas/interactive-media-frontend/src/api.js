const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.jaminproductions.com/"
    : "https://api.jaminproductions.com/"; //"https://pm0v1kb80m.execute-api.us-west-2.amazonaws.com/"; // https://hb222ae3qg.execute-api.us-east-1.amazonaws.com/

export async function getData(path) {
  try {
    const response = await fetch(`${API_URL}${path}`);
    const body = await response.json();
    return { statusCode: response.status, data: body };
  } catch (error) {
    return {};
  }
}
