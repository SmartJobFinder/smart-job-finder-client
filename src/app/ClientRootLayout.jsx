"use client";

import { Provider } from "react-redux";
import PageWrapper from "@/components/PageWrapper";
import { store } from "@/store";
import { ToastProvider } from "@/components/providers/ToastProvider";
import CustomConfirmDialog from "@/components/ui/CustomConfirmDialog";

export default function ClientRootLayout({ children }) {
    return (
        <Provider store={store}>
            <PageWrapper>{children}</PageWrapper>
            <ToastProvider />
            <CustomConfirmDialog />
        </Provider>
    );
}
