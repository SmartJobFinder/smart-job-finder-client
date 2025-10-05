"use client";

import { useState, useEffect } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"; 

let resolveCallback = null;

export default function CustomConfirmDialog() {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState({
        title: "Confirm",
        description: "Are you sure?",
        confirmText: "OK",
        cancelText: "Cancel",
    });

    const handleClose = (result) => {
        setOpen(false);
        if (resolveCallback) {
            resolveCallback(result);
            resolveCallback = null;
        }
    };

    useEffect(() => {
        // gắn customConfirm vào window
        window.customConfirm = (opts = {}) => {
            return new Promise((resolve) => {
                setOptions((prev) => ({ ...prev, ...opts }));
                setOpen(true);
                resolveCallback = resolve;
            });
        };
    }, []);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{options.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {options.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => handleClose(false)}>
                        {options.cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleClose(true)}>
                        {options.confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
