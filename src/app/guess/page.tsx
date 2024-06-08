"use client";

import { useGameplay } from "@/context/GameplayContext";
import { useRouter } from "next/navigation";

export default function GuessScreen() {
	const router = useRouter();
	const gameplay = useGameplay();

	return (
		<body>
			<p className="font-sans w-full px-4 py-10 text-black text-center text-base gap-4">
				Guess Screen
			</p>
			<div className="flex justify-center">
				<p>{gameplay?.playBrands[0]}</p>
			</div>
			<div className="flex justify-center">
				<button
					onClick={() => router.push("/answer")}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Submit
				</button>
			</div>
		</body>
	);
}
