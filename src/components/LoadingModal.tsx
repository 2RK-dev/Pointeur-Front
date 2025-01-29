"use client";

import React from "react";

interface LoadingModalProps {
	isLoading: boolean;
	msg: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isLoading, msg }) => {
	if (!isLoading) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-xl">
				<div className="flex items-center space-x-4">
					<div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
					<p className="text-lg font-semibold text-gray-700">{msg}</p>
				</div>
			</div>
		</div>
	);
};

export default LoadingModal;
