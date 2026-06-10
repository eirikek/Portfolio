/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled: React StrictMode double-mounts components in dev, which makes
  // @react-three/postprocessing set up its composer twice and causes the
  // scene to flicker. This only affects local dev behaviour.
  reactStrictMode: false,
  transpilePackages: ["three"],
};

module.exports = nextConfig;
