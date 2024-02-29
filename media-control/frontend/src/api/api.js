const API_HOST =
  process.env.NODE_ENV === "production"
    ? "http://44.198.176.45:5002"
    : "http://localhost:5002";

async function api_get(path, token) {
  const req = {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(`${API_HOST}/api/${path}`, req);
  const data = await response.json();
  return data;
}

async function api_put(path, token) {
  const req = {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(`${API_HOST}/api/${path}`, req);
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
  const response = await fetch(`${API_HOST}/api/${path}`, req);
  const data = await response.json();
  return data;
}

export function get_event(token) {
  const path = `v1/events`;
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

export function new_screen(token, media_url_name, user_new_screen_name) {
  const path = `v1/screens`;
  const body = {
    media_url_name,
    user_new_screen_name,
  };
  return api_post(path, body, token);
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

export function update_screen_media(token, screen_url, media_url) {
  const path = `v1/screens/update_media`;
  const body = {
    screen: screen_url,
    media: media_url,
  };
  return api_post(path, body, token);
}

export function set_playback_volume(token, new_volume) {
  const path = `v1/playback/music/volume?level=${new_volume}`;
  return api_put(path, token);
}

export function update_video_playback(token, screen_url, action) {
  const path = `v1/playback/video`;
  const body = {
    screen: screen_url,
    action: action,
  };
  return api_post(path, body, token);
}
