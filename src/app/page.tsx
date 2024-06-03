"use client";

// import { useWebDeviceDetection } from "@/context/WindowWidthContext";
import { useRouter } from "next/navigation";
import fetchImage from "@/database/graphql";
import { useEffect, useState } from "react";

interface ImageResult {
	count: number;
	images: string[];
}

export default function Home() {
	// const isWebDevice = useWebDeviceDetection();
	const router = useRouter();
	const [result, setResult] = useState<ImageResult>({ count: 0, images: [] });

	useEffect(() => {
		fetchImage("fall-2016-ready-to-wear/prada").then((result: ImageResult) =>
			setResult(result)
		);
	}, []);

	return (
		<body>
			<p className="font-sans w-full px-4 py-10 text-black text-center text-base gap-4">
				VoGuesser
			</p>
			<div className="flex justify-center">
				<p>{result.count}</p>
				<button
					onClick={() => router.push("/guess")}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Play
				</button>
			</div>
		</body>
	);
}
