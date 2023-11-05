import oauth2Client from '@/lib/oauth';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest) {
    if (req.url) {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        if (code) {
            try {
                const { tokens } = await oauth2Client.getToken(code);
                oauth2Client.setCredentials(tokens);
                console.log(oauth2Client.credentials)
                return Response.json({ tokens })
            } catch (error) {
                return Response.json({ error: error })
            }
        }
    }
};
