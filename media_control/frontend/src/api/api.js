export const API_HOST =
  process.env.NODE_ENV === "production"
    ? "https://api.event-media-control.com"
    : "https://olrk6aszw4.execute-api.us-east-1.amazonaws.com";
export const SOCKET_HOST =
  process.env.NODE_ENV === "production"
    ? "http://44.198.176.45:5002"
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

export function get_session(access_code) {
  const path = `v1/session`;
  const body = {
    access_code,
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

export function get_screen_media(screen_url, token) {
  const path = `v1/media/${screen_url}`;
  return api_get(path, token);
}

export function update_screen_media(token, screenId, mediaId) {
  const path = `v1/screens/${screenId}/media`;
  const body = {
    new_media_id: mediaId,
  };
  return api_put(path, body, token);
}

export function set_playback_volume(token, new_volume) {
  const path = `v1/playback/music/volume?level=${new_volume}`;
  return api_put(path, {}, token);
}

export function update_video_playback(token, screen_url, action) {
  const path = `v1/playback/video`;
  const body = {
    screen: screen_url,
    action: action,
  };
  return api_post(path, body, token);
}
