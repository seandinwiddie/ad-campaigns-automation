/**
 * The internal domain names for the application's core logic modules.
 * This union acts as a controlled vocabulary for referring to shared infrastructure domains
 * like API access, settings management, and global UI coordination.
 *
 * **User Story:**
 * - As a developer organizing shared infrastructure, I want a typed list of core domain names so
 *   cross-cutting code can refer to those modules consistently and without string drift.
 */
export type CoreDomain = 'api' | 'settings' | 'ui';
