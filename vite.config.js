import { defineConfig } from 'vite';

export default defineConfig({
    clearScreen: false,
    envPrefix: ['VITE_', 'NASA_'], // Allow Vite to expose variables starting with NASA_ to import.meta.env
});
