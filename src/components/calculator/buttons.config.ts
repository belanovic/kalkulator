
// This file re-exports from the .tsx version to ensure correct module resolution
// and to avoid JSX parsing errors if this file were to contain JSX directly.
export * from './buttons.config.tsx';
export type { ButtonConfig } from './buttons.config.tsx';
