import type { ReactNode } from 'react';

export type ToastState = {
	isOpen: boolean;
	message: string;
	isSuccess: boolean;
};

export type ToastContextType = {
	showSuccess: (msg: string) => void;
	showError: (msg: string) => void;
};

// Props cho Provider
export type ToastProviderProps = {
	children: ReactNode;
};
