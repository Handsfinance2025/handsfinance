import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyTelegramWebAppData, generateJWT, getOrCreateUser, TelegramUserData, UserProfile } from '../../lib/authUtils'; // Pastikan path ini benar
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { initData } = req.body;

  if (!initData || typeof initData !== 'string') {
    return res.status(400).json({ message: 'initData is required and must be a string.' });
  }

  const telegramUser = verifyTelegramWebAppData(initData);

  if (!telegramUser) {
    return res.status(401).json({ message: 'Invalid or tampered Telegram data.' });
  }

  // At this point, telegramUser is validated
  // Now, get or create user in Supabase
  try {
    const userProfile = await getOrCreateUser(telegramUser);

    if (!userProfile) {
      return res.status(500).json({ message: 'Could not get or create user profile in Supabase.' });
    }

    // Prepare JWT payload
    const jwtPayload = {
      sub: userProfile.id, // Subject (user ID from your database)
      tid: telegramUser.id, // Telegram ID
      username: userProfile.username || telegramUser.username,
      firstName: userProfile.first_name || telegramUser.first_name,
      // Add any other relevant user data you want in the JWT
      // Be mindful of JWT size and security of data included
    };

    const token = generateJWT(jwtPayload, '1d'); // Token expires in 1 day

    // Set JWT as an HTTP-Only cookie for security
    // Also send it in the response body for client-side access if needed,
    // though httpOnly cookie is the primary secure way for web apps.
    // For Telegram Mini Apps, direct access to the token might be useful for API calls.
    res.setHeader('Set-Cookie', serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'lax', // Or 'strict' or 'none' (if 'none', secure must be true)
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: '/',
    }));

    return res.status(200).json({
      message: 'Authentication successful',
      token: token, // Sending token in body as well for flexibility
      user: {
        id: userProfile.id,
        telegramId: telegramUser.id,
        username: userProfile.username || telegramUser.username,
        firstName: userProfile.first_name || telegramUser.first_name,
      }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ message: 'Internal Server Error during login process.' });
  }
}
