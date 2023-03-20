/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */
import { CLIENT_ID, API_KEY } from "./modules/api_keys.js";
// TODO(developer): Set to client ID and API key from the Developer Console
// const CLIENT_ID = '691109895020-o5jgr4nbtch2c36218l6d5va9nbh44tv.apps.googleusercontent.com';
// const API_KEY = 'AIzaSyBMfTC-82TdxMI7SDAX356xwei6KMkkbOU';

console.log("client", CLIENT_ID, API_KEY)

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOCS = [
    'https://docs.googleapis.com/$discovery/rest?version=v1',
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/documents";

let tokenClient;
let gapiInited = false;
let gisInited = false;

// let api_ready_callback;

// function setApiCallback(callback){
//     api_ready_callback = callback;
// }

//   document.getElementById('authorize_button').style.visibility = 'hidden';
//   document.getElementById('signout_button').style.visibility = ' hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', intializeGapiClient);
    gapiInited = true;
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function intializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    let session_token = sessionStorage.getItem('token')
    if (session_token) {
        session_token = JSON.parse(session_token);
        gapi.client.setToken(session_token)
    }

}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;

}



/**
 * Enables user interaction after all libraries are loaded.
 */
// function apiReady() {
//     if (gapiInited && gisInited) {
//         console.log('api')
//         api_ready_callback()
//     }
// }

/**
 *  Sign in the user upon button click.
 */
async function handleAuthClick(callback) {

    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            console.log('error handleauthClick')
            throw (resp);
        }
        // document.getElementById('signout_button').style.visibility = 'visible';
        // document.getElementById('authorize_button').style.visibility = 'hidden';
        let token_string = JSON.stringify(gapi.client.getToken());
        sessionStorage.setItem('token', token_string);
        if(callback)
            await callback();

    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        console.log('token is null', gapi.client.getToken())
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        console.log('token is not null', gapi.client.getToken());
        tokenClient.requestAccessToken({ prompt: '' });
    }

}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        // document.getElementById('authorize_button').innerText = 'Authorize';
        // document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

export {gisLoaded, gapiLoaded, handleAuthClick};