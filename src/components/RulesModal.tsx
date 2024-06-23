"use client";

import {
	Description,
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

interface RulesModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const RulesModal = (props: RulesModalProps) => {
	const { isOpen, setIsOpen } = props;
	return (
		<Dialog
			open={isOpen}
			onClose={() => setIsOpen(false)}
			className="relative z-50"
		>
			<DialogBackdrop className="fixed inset-0 bg-black/30" />
			<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
				<DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
					<DialogTitle className="font-bold">How to Play</DialogTitle>
					<Description>
						You'll be shown 10 random images from high fashion runway shows. Try
						to guess the brand, season, and year as fast as possible to maximize
						your points!
					</Description>
					<p>
						1000 points is a perfect score. Each correct brand gives you 60
						points, each correct season gives you 10 points, and each correct
						year gives you 30 points. You'll have a minute to make guesses for
						each runway image, and the slower you are the more points will be
						deducted from your score.
					</p>
					<div className="flex gap-4">
						<button onClick={() => setIsOpen(false)}>Close</button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};
