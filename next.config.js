/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "https://stunning-guacamole-jjjw45qvw55wf5w66-3000.app.github.dev/",
        "localhost:3000",
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default config;
