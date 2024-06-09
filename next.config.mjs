/** @type {import('next').NextConfig} */
const nextConfig = {
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
