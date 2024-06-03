"use client";

import { useRouter } from "next/navigation";

export default function AnswerScreen() {
	const router = useRouter();

	return (
		<body>
			<p className="font-sans w-full px-4 py-10 text-black text-center text-base gap-4">
				Answer Screen
			</p>
			<div className="flex justify-center">
				<button
					onClick={() => router.push("/game-end")}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Next
				</button>
			</div>
		</body>
	);
}
