import packageJson from '../package.json';

export const CONFIG = {
    appName: "Dashboard PSB",
    appVersion: packageJson.version,
    assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
}