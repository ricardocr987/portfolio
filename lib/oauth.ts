import { OAuth2Client } from "google-auth-library";

const oauthConfig = {
    clientId: "828488844397-sehbahjega829kjemrf738uag7i0vq1g.apps.googleusercontent.com",
    clientSecret: "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",
    redirectUri: 'http://localhost:3000/api/google/redirect',
};

const oauth2Client = new OAuth2Client(oauthConfig);
export default oauth2Client;