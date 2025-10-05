"use client";

import {useSearchParams} from "next/navigation";
import ActivationNotice from "@/components/auth/ActivationNotice";

export default function RegisterSuccessPage() {
    const sp = useSearchParams();
    const email = sp.get("email") || "";

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <ActivationNotice email={email}/>
        </div>
    );
}
