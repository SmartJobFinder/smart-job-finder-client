"use client";

import { ToastContainer } from "react-toastify";

export function ToastProvider() {
    return (
        <ToastContainer
            position="top-center"
            newestOnTop
            closeOnClick
            draggable
            pauseOnHover
            theme="colored"
            containerClassName="z-[9999]"
        />
    );
}
