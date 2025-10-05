"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const SuccessDialog = ({ onClose, title, message }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <Button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SuccessDialog;
