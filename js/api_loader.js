import { gapiLoaded, gisLoaded } from "./auth.js";

let gapi_script = document.createElement("script");
gapi_script.src = "https://apis.google.com/js/api.js";
gapi_script.onload = gapiLoaded

let gsi_script = document.createElement("script");
gsi_script.src = "https://accounts.google.com/gsi/client";
gsi_script.onload = gisLoaded

document.body.append(gapi_script, gsi_script);