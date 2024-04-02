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

export async function getMedia(path, lek = "") {
  try {
    const fullPath = lek ? `${path}&lek=${lek}` : path;
    return await getData(fullPath).then(async (res) => {
      // check for a key that signifies there are more items to fetch
      if (!!res.data?.lek) {
        const rest = await getMedia(path, res.data.lek);
        return {
          ...res,
          data: { items: res.data.items.concat(rest.data.items) },
        };
      } else {
        return res;
      }
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
