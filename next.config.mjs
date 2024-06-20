/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "assets.vogue.com",
				port: "",
				pathname: "/photos/**",
			},
		],
	},
};

export default nextConfig;
