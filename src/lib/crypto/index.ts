/**
 * Crypto utilities for FoodTrace
 *
 * This module provides encryption/decryption utilities for sensitive data,
 * primarily Ethereum wallet private keys stored in the database.
 *
 * @module lib/crypto
 */

export {
  encryptWalletKey,
  decryptWalletKey,
  getEncryptionKey,
} from './wallet-encryption';
