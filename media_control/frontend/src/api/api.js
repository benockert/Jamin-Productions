export const API_HOST =
  process.env.NODE_ENV === "production"
    ? "https://api.event-media-control.com"
    : "https://olrk6aszw4.execute-api.us-east-1.amazonaws.com";
export const SOCKET_HOST =
  process.env.NODE_ENV === "production"
    ? "wss://ws.event-media-control.com"
    : "wss://7u2mqu2n2i.execute-api.us-east-1.amazonaws.com/dev";

async function api_get(path, token) {
  const req = {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(`${API_HOST}/${path}`, req);
  const data = await response.json();
  return data;
}

async function api_put(path, body, token) {
  const req = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(`${API_HOST}/${path}`, req);
  const data = await response.json();
  return { status: response.status, body: data };
}

async function api_post(path, body, token) {
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(`${API_HOST}/${path}`, req);
  const data = await response.json();
  return data;
}

export function get_event(token) {
  const path = `v1/event`;
  return api_get(path, token);
}

export function get_media(token) {
  const path = `v1/media`;
  return api_get(path, token);
}

export function get_screens(token) {
  const path = `v1/screens`;
  return api_get(path, token);
}

export function get_session(accessCode) {
  const path = `v1/session`;
  const body = {
    access_code: accessCode,
  };
  return api_post(path, body);
}

export function validate_token(token) {
  const path = `v1/session/validate`;
  const body = {
    jwt: token,
  };
  return api_post(path, body);
}

export function get_screen_media(screenId, token) {
  const path = `v1/media/${screenId}`;
  return api_get(path, token);
}

export function update_screen_media(token, screenId, mediaId) {
  const path = `v1/screens/${screenId}/media`;
  const body = {
    new_media_id: mediaId,
  };
  return api_put(path, body, token);
}

export function set_playback_volume(token, eventId, screenId, newVolume) {
  const path = `v1/playback/${eventId}/screens/${screenId}/volume?v=${newVolume}`;
  return api_put(path, {}, token);
}

export function update_video_playback(token, screenId, action) {
  const path = `v1/playback/video`;
  const body = {
    screen: screenId,
    action: action,
  };
  return api_post(path, body, token);
}
