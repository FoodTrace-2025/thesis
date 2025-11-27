/**
 * Wallet Encryption Utility
 *
 * Provides AES-256-GCM encryption/decryption for Ethereum wallet private keys.
 * Uses Node.js built-in crypto module for industry-standard encryption.
 *
 * Security Notes:
 * - IV (12 bytes) is unique per encryption as per NIST recommendation
 * - Auth tag prevents tampering (authenticated encryption)
 * - Keys are never logged or exposed to clients
 *
 * @module lib/crypto/wallet-encryption
 */

import crypto from 'crypto';

/** AES-256-GCM algorithm identifier */
const ALGORITHM = 'aes-256-gcm';

/** Initialization Vector length in bytes (96 bits - NIST recommended for GCM) */
const IV_LENGTH = 12;

/** Authentication tag length in bytes */
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts an Ethereum wallet private key using AES-256-GCM.
 *
 * @param privateKey - The wallet private key to encrypt (hex string with or without 0x prefix)
 * @param encryptionKey - 64-character hex string (256-bit key)
 * @returns Encrypted data as hex string: IV (24 chars) + AuthTag (32 chars) + Ciphertext
 *
 * @example
 * ```typescript
 * const encrypted = encryptWalletKey(
 *   '0x1234...abcd',
 *   process.env.WALLET_ENCRYPTION_KEY
 * );
 * ```
 */
export function encryptWalletKey(
  privateKey: string,
  encryptionKey: string
): string {
  // Generate unique IV for each encryption (critical for GCM security)
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create cipher with encryption key
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(encryptionKey, 'hex'),
    iv
  );

  // Encrypt private key
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get authentication tag (integrity verification)
  const authTag = cipher.getAuthTag();

  // Return: IV + authTag + ciphertext (all hex-encoded)
  // Format: [24 chars IV][32 chars authTag][variable ciphertext]
  return iv.toString('hex') + authTag.toString('hex') + encrypted;
}

/**
 * Decrypts an encrypted wallet private key using AES-256-GCM.
 *
 * @param encryptedData - Encrypted data from encryptWalletKey (hex string)
 * @param encryptionKey - 64-character hex string (256-bit key)
 * @returns Decrypted private key string, or null if decryption fails
 *
 * @example
 * ```typescript
 * const privateKey = decryptWalletKey(
 *   encryptedData,
 *   process.env.WALLET_ENCRYPTION_KEY
 * );
 * if (!privateKey) {
 *   console.error('Decryption failed');
 * }
 * ```
 */
export function decryptWalletKey(
  encryptedData: string,
  encryptionKey: string
): string | null {
  try {
    // Validate minimum length: IV (24) + AuthTag (32) = 56 chars minimum
    // Note: Empty string encryption produces 56 chars (no ciphertext), which is valid
    const minLength = IV_LENGTH * 2 + AUTH_TAG_LENGTH * 2;
    if (!encryptedData || encryptedData.length < minLength) {
      console.error('Wallet decryption failed: malformed encrypted data');
      return null;
    }

    // Extract IV, authTag, ciphertext from hex string
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
    const authTag = Buffer.from(
      encryptedData.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2),
      'hex'
    );
    const encrypted = encryptedData.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2);

    // Create decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(encryptionKey, 'hex'),
      iv
    );

    // Set auth tag for integrity verification (must be set before decryption)
    decipher.setAuthTag(authTag);

    // Decrypt
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // Log error for debugging but never log sensitive data
    console.error('Wallet decryption failed:', (error as Error).message);
    return null;
  }
}

/**
 * Retrieves and validates the wallet encryption key from environment variables.
 *
 * @returns The validated 64-character hex encryption key
 * @throws Error if WALLET_ENCRYPTION_KEY is not configured or invalid format
 *
 * @example
 * ```typescript
 * const key = getEncryptionKey();
 * const encrypted = encryptWalletKey(privateKey, key);
 * ```
 */
export function getEncryptionKey(): string {
  const key = process.env.WALLET_ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      'WALLET_ENCRYPTION_KEY environment variable is not configured'
    );
  }

  if (!/^[a-fA-F0-9]{64}$/.test(key)) {
    throw new Error(
      'WALLET_ENCRYPTION_KEY must be a 64-character hex string (256 bits)'
    );
  }

  return key;
}
