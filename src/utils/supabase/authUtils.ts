// lib/authUtils.ts
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { createHmac } from 'crypto';
import { supabase } from './server'; // Ensuring supabase is explicitly imported

const JWT_SECRET = process.env.JWT_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}
if (!TELEGRAM_BOT_TOKEN) {
  console.warn("TELEGRAM_BOT_TOKEN is not defined. Telegram data verification will be skipped if not in Telegram environment.");
}

export interface TelegramUserData {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
  [key: string]: unknown; // For additional, less-defined properties from Telegram
}

/**
 * Verifies the integrity of data received from Telegram Web App.
 * @param initData The initData string from Telegram.
 * @returns The parsed user data if valid, otherwise false.
 */
export function verifyTelegramWebAppData(initData: string): TelegramUserData | false {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not set. Cannot verify Telegram data.");
    return false;
  }

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return false;

  const dataToCheck: string[] = [];
  params.forEach((value, key) => {
    if (key !== 'hash') {
      dataToCheck.push(`${key}=${value}`);
    }
  });

  dataToCheck.sort(); // Sort alphabetically
  const dataCheckString = dataToCheck.join('\n');

  try {
    const secretKey = createHmac('sha256', 'WebAppData').update(TELEGRAM_BOT_TOKEN).digest();
    const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash === hash) {
      const userString = params.get('user');
      if (userString) {
        const parsedUser = JSON.parse(userString);
        const authDateString = params.get('auth_date');
        if (!authDateString) return false;

        // Construct the object explicitly to ensure type safety for known fields
        const result: TelegramUserData = {
          id: Number(parsedUser.id), // Ensure id is a number
          first_name: parsedUser.first_name,
          last_name: parsedUser.last_name,
          username: parsedUser.username,
          language_code: parsedUser.language_code,
          photo_url: parsedUser.photo_url,
          auth_date: parseInt(authDateString, 10),
          hash: hash,
        };
        // If there are other fields from parsedUser that match [key: string]: unknown, they are implicitly allowed.
        // To explicitly include them if they don't overlap with defined keys:
        // Object.keys(parsedUser).forEach(key => {
        //   if (!(key in result)) {
        //     (result as any)[key] = parsedUser[key];
        //   }
        // });
        return result;
      }
    }
    return false;
  } catch (error) {
    console.error("Error verifying Telegram data:", error);
    return false;
  }
}

/**
 * Generates a JWT token.
 * @param payload The data to include in the token. Should be an object with string keys.
 * @param expiresInVal Token expiration time (e.g., '1h', '7d'). Renamed from expiresIn to avoid conflict.
 * @returns The generated JWT.
 */
export function generateJWT(payload: Record<string, unknown>, expiresInVal: string = '1d'): string {
  const options: SignOptions = {
    expiresIn: expiresInVal as jwt.SignOptions['expiresIn'], // Cast to the correct type expected by SignOptions
  };
  return jwt.sign(payload, JWT_SECRET!, options); // Pass the explicitly typed options object
}

/**
 * Verifies a JWT token.
 * @param token The JWT to verify.
 * @returns The decoded payload if valid, otherwise null.
 */
export function verifyJWT(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload | string;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * Represents the user profile structure in your Supabase 'profiles' table.
 */
export interface UserProfile {
  id: string; // UUID, typically matches Supabase auth.user.id if using Supabase Auth
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Gets or creates a user profile in Supabase based on Telegram user data.
 * @param telegramUser Validated Telegram user data.
 * @returns The user profile from Supabase.
 */
export async function getOrCreateUser(telegramUser: TelegramUserData): Promise<UserProfile | null> {
  // Check if user exists by telegram_id
  const { data: existingUser, error: fetchError } = await supabase
    .from('profiles') // Assuming your table is named 'profiles'
    .select('*')
    .eq('telegram_id', telegramUser.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: "Searched item was not found"
    console.error('Error fetching user from Supabase:', fetchError);
    return null;
  }

  if (existingUser) {
    // Optionally update user details if they've changed
    const updates: Partial<UserProfile> = {};
    if (existingUser.username !== telegramUser.username) updates.username = telegramUser.username;
    if (existingUser.first_name !== telegramUser.first_name) updates.first_name = telegramUser.first_name;
    if (existingUser.last_name !== telegramUser.last_name) updates.last_name = telegramUser.last_name;
    // Note: photo_url from Telegram might be temporary. Decide on your update strategy.
    // if (existingUser.photo_url !== telegramUser.photo_url) updates.photo_url = telegramUser.photo_url;

    if (Object.keys(updates).length > 0) {
      updates.updated_at = new Date().toISOString();
      const { data: updatedUser, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('telegram_id', telegramUser.id)
        .select()
        .single();
      if (updateError) {
        console.error('Error updating user in Supabase:', updateError);
        // Return existing user even if update fails, or handle error differently
        return existingUser as UserProfile;
      }
      return updatedUser as UserProfile;
    }
    return existingUser as UserProfile;
  } else {
    // Create new user
    // The 'id' for the profiles table should ideally be a UUID.
    // If you're not using Supabase Auth, you can generate one or let Postgres do it.
    // For this example, we'll let Supabase/Postgres handle 'id' (assuming it's auto-generated UUID)
    // and 'created_at'.
    const newUserProfileData = {
      telegram_id: telegramUser.id,
      username: telegramUser.username,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name,
      photo_url: telegramUser.photo_url,
      // 'id' will be generated by Supabase if it's a UUID primary key with default gen_random_uuid()
    };

    const { data: newUser, error: insertError } = await supabase
      .from('profiles')
      .insert(newUserProfileData)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user in Supabase:', insertError);
      return null;
    }
    return newUser as UserProfile;
  }
}