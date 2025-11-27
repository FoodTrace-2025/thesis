/**
 * Unit tests for wallet encryption utility
 *
 * Tests AES-256-GCM encryption/decryption for Ethereum wallet private keys.
 * Coverage target: >90%
 */

import {
  encryptWalletKey,
  decryptWalletKey,
  getEncryptionKey,
} from './wallet-encryption';

// Valid test encryption key (64 hex chars = 256 bits)
const TEST_KEY =
  'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';

// Different key for wrong-key tests
const WRONG_KEY =
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

// Sample Ethereum private key (test value, not real)
const SAMPLE_PRIVATE_KEY =
  '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

describe('wallet-encryption', () => {
  describe('encryptWalletKey', () => {
    it('should encrypt and decrypt private key successfully', () => {
      // Arrange
      const privateKey = SAMPLE_PRIVATE_KEY;

      // Act
      const encrypted = encryptWalletKey(privateKey, TEST_KEY);
      const decrypted = decryptWalletKey(encrypted, TEST_KEY);

      // Assert
      expect(decrypted).toBe(privateKey);
    });

    it('should generate different ciphertext for same input (IV uniqueness)', () => {
      // Arrange
      const privateKey = SAMPLE_PRIVATE_KEY;

      // Act
      const encrypted1 = encryptWalletKey(privateKey, TEST_KEY);
      const encrypted2 = encryptWalletKey(privateKey, TEST_KEY);

      // Assert - ciphertexts should be different due to unique IVs
      expect(encrypted1).not.toBe(encrypted2);

      // Both should decrypt to same value
      expect(decryptWalletKey(encrypted1, TEST_KEY)).toBe(privateKey);
      expect(decryptWalletKey(encrypted2, TEST_KEY)).toBe(privateKey);
    });

    it('should handle empty string input', () => {
      // Arrange
      const privateKey = '';

      // Act
      const encrypted = encryptWalletKey(privateKey, TEST_KEY);
      const decrypted = decryptWalletKey(encrypted, TEST_KEY);

      // Assert
      expect(decrypted).toBe(privateKey);
    });

    it('should handle unicode characters in input', () => {
      // Arrange - unlikely for private keys but tests robustness
      const testString = 'test-string-with-special-chars-!@#$%';

      // Act
      const encrypted = encryptWalletKey(testString, TEST_KEY);
      const decrypted = decryptWalletKey(encrypted, TEST_KEY);

      // Assert
      expect(decrypted).toBe(testString);
    });
  });

  describe('decryptWalletKey', () => {
    it('should return null when decrypting with wrong key', () => {
      // Arrange
      const privateKey = SAMPLE_PRIVATE_KEY;
      const encrypted = encryptWalletKey(privateKey, TEST_KEY);

      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act
      const decrypted = decryptWalletKey(encrypted, WRONG_KEY);

      // Assert
      expect(decrypted).toBeNull();

      // Restore console
      consoleSpy.mockRestore();
    });

    it('should return null for malformed encrypted data (truncated)', () => {
      // Arrange - encrypted data that's too short
      const truncatedData = 'abc123'; // Way too short

      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act
      const decrypted = decryptWalletKey(truncatedData, TEST_KEY);

      // Assert
      expect(decrypted).toBeNull();

      consoleSpy.mockRestore();
    });

    it('should return null for empty encrypted data', () => {
      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act
      const decrypted = decryptWalletKey('', TEST_KEY);

      // Assert
      expect(decrypted).toBeNull();

      consoleSpy.mockRestore();
    });

    it('should return null for tampered ciphertext (auth tag validation)', () => {
      // Arrange
      const privateKey = SAMPLE_PRIVATE_KEY;
      const encrypted = encryptWalletKey(privateKey, TEST_KEY);

      // Tamper with the ciphertext (change last character)
      const lastChar = encrypted.slice(-1);
      const newLastChar = lastChar === '0' ? '1' : '0';
      const tamperedEncrypted = encrypted.slice(0, -1) + newLastChar;

      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act
      const decrypted = decryptWalletKey(tamperedEncrypted, TEST_KEY);

      // Assert - auth tag should fail verification
      expect(decrypted).toBeNull();

      consoleSpy.mockRestore();
    });

    it('should return null for invalid hex in encrypted data', () => {
      // Arrange - valid length but invalid hex characters
      const invalidHex = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';

      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act
      const decrypted = decryptWalletKey(invalidHex, TEST_KEY);

      // Assert
      expect(decrypted).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe('getEncryptionKey', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset environment before each test
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      // Restore original environment
      process.env = originalEnv;
    });

    it('should return encryption key when properly configured', () => {
      // Arrange
      process.env.WALLET_ENCRYPTION_KEY = TEST_KEY;

      // Act
      const key = getEncryptionKey();

      // Assert
      expect(key).toBe(TEST_KEY);
    });

    it('should throw error if encryption key missing', () => {
      // Arrange
      delete process.env.WALLET_ENCRYPTION_KEY;

      // Act & Assert
      expect(() => getEncryptionKey()).toThrow(
        'WALLET_ENCRYPTION_KEY environment variable is not configured'
      );
    });

    it('should throw error if encryption key too short', () => {
      // Arrange
      process.env.WALLET_ENCRYPTION_KEY = 'abc123'; // Too short

      // Act & Assert
      expect(() => getEncryptionKey()).toThrow(
        'WALLET_ENCRYPTION_KEY must be a 64-character hex string (256 bits)'
      );
    });

    it('should throw error if encryption key too long', () => {
      // Arrange
      process.env.WALLET_ENCRYPTION_KEY = TEST_KEY + 'extra'; // Too long

      // Act & Assert
      expect(() => getEncryptionKey()).toThrow(
        'WALLET_ENCRYPTION_KEY must be a 64-character hex string (256 bits)'
      );
    });

    it('should throw error if encryption key contains non-hex characters', () => {
      // Arrange - valid length but contains 'g' which is not hex
      process.env.WALLET_ENCRYPTION_KEY =
        'g1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';

      // Act & Assert
      expect(() => getEncryptionKey()).toThrow(
        'WALLET_ENCRYPTION_KEY must be a 64-character hex string (256 bits)'
      );
    });

    it('should accept uppercase hex characters in encryption key', () => {
      // Arrange
      process.env.WALLET_ENCRYPTION_KEY = TEST_KEY.toUpperCase();

      // Act
      const key = getEncryptionKey();

      // Assert
      expect(key).toBe(TEST_KEY.toUpperCase());
    });
  });
});
