"use client";

import React, {useMemo, useState} from "react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, User} from "lucide-react";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {candidateRegisterSchema} from "@/validation/registerSchema";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import LoadingScreen from "../ui/loadingScreen";
import {useDispatch, useSelector} from "react-redux";
import {selectAuthLoading} from "@/features/auth/authSelectors";
import {registerThunk} from "@/features/auth/authSlice";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import clsx from "clsx";
import AfterRegisterPanel from "@/components/auth/AfterRegisterPanel";
import { t } from "@/i18n/i18n";

const TTL_SEC = 300;
const RESEND_COOLDOWN_FALLBACK_SEC = 120;

export default function CandidateRegisterForm({role, onRegistered}) {
    const dispatch = useDispatch();
    const router = useRouter();
    const isAuthLoading = useSelector(selectAuthLoading);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [phase, setPhase] = useState("form"); // "form" | "checkEmail"
    const [registeredEmail, setRegisteredEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, isValid},
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(candidateRegisterSchema),
        mode: "onChange",
        defaultValues: {terms: false},
    });

    const pwd = watch("password") || "";

    const rules = useMemo(() => {
        const len = pwd.length >= 8;
        const upper = /[A-Z]/.test(pwd);
        const lower = /[a-z]/.test(pwd);
        const digit = /\d/.test(pwd);
        const special = /[^A-Za-z0-9]/.test(pwd);
        const score = [len, upper, lower, digit, special].filter(Boolean).length;
        return {len, upper, lower, digit, special, score};
    }, [pwd]);

    const strengthLabelMap = ["Very weak", "Weak", "Fair", "Good", "Strong"];
    const strengthLabel =
        pwd.length === 0 ? "" : strengthLabelMap[Math.max(0, rules.score - 1)];

    const barColorMap = [
        "bg-blue-300",
        "bg-blue-400",
        "bg-blue-500",
        "bg-blue-600",
        "bg-blue-700",
    ];
    const barColor = barColorMap[Math.max(0, rules.score - 1)];
    const meterPct = (rules.score / 5) * 100;
    const scrollToTop = () => {
        const el = document.scrollingElement || document.documentElement;
        el.scrollTo({top: 0, behavior: "smooth"});
    };


    const onSubmit = async (data) => {
        const payload = {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: role || "CANDIDATE",
        };

        try {
            scrollToTop();
            const result = await dispatch(registerThunk(payload)).unwrap();

            const okMsg =
                result?.message ||
                "Registration successful! Please check your email to activate your account.";
            toast.success(okMsg, {autoClose: 1200});

            // Ở lại trang và hiển thị panel check email
            setRegisteredEmail(data.email);
            setPhase("checkEmail");
            try {
                localStorage.setItem(`activationResendAt:${data.email}`, String(Date.now()));
            } catch {
            }

            onRegistered?.(data.email);
        } catch (err) {
            const msg =
                err?.message ||
                err?.detail ||
                err?.title ||
                (typeof err === "string" ? err : "Registration failed. Please try again.");
            toast.error(msg);
        }
    };

    if (isAuthLoading) return <LoadingScreen message="Registering..."/>;

    return (
        <div className="w-full">
            {/* Header */}


            {/* Social */}
            <div className="space-y-3">
                <GoogleSignIn role={role ?? "CANDIDATE"}/>
            </div>

            {/* Separator */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-blue-100"/>
                </div>
                <div className="relative flex justify-center">
          <span className="px-3 text-xs font-medium tracking-wider text-blue-500 bg-white">
            OR
          </span>
                </div>
            </div>

            {/* Register form */}
            <div className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Full Name */}
                    <div>
                        <Label htmlFor="fullName" className="font-medium text-blue-900/80">
                            Full Name
                        </Label>
                        <div className="relative mt-1">
                            <User
                                className="absolute w-4 h-4 text-blue-300 -translate-y-1/2 pointer-events-none left-3 top-1/2"/>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                className="pl-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                                {...register("fullName")}
                                autoComplete="name"
                            />
                        </div>
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email" className="font-medium text-blue-900/80">
                            Email
                        </Label>
                        <div className="relative mt-1">
                            <Mail
                                className="absolute w-4 h-4 text-blue-300 -translate-y-1/2 pointer-events-none left-3 top-1/2"/>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="pl-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                                {...register("email")}
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <Label htmlFor="phone" className="font-medium text-blue-900/80">
                            Phone Number
                        </Label>
                        <div className="relative mt-1">
                            <Phone
                                className="absolute w-4 h-4 text-blue-300 -translate-y-1/2 pointer-events-none left-3 top-1/2"/>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="Enter your phone number"
                                className="pl-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                                {...register("phone")}
                                autoComplete="tel"
                            />
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <Label htmlFor="password" className="font-medium text-blue-900/80">
                            Password
                        </Label>
                        <div className="relative mt-1">
                            <Lock
                                className="absolute w-4 h-4 text-blue-300 -translate-y-1/2 pointer-events-none left-3 top-1/2"/>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                className="pl-10 pr-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                                {...register("password")}
                                autoComplete="new-password"
                                aria-describedby="pw-strength"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute text-blue-400 transition -translate-y-1/2 right-3 top-1/2 hover:text-blue-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                        )}

                        {/* Strength UI */}
                        {pwd.length > 0 && (
                            <div className="mt-2" aria-live="polite" id="pw-strength">
                                <div
                                    className="h-1.5 w-full rounded bg-blue-100 overflow-hidden"
                                    role="progressbar"
                                    aria-valuemin={0}
                                    aria-valuemax={5}
                                    aria-valuenow={rules.score}
                                >
                                    <div
                                        className={`h-full transition-all ${barColor}`}
                                        style={{width: `${meterPct}%`}}
                                    />
                                </div>
                                <div className="mt-1 text-[11px] font-medium text-blue-700">
                                    Strength: {strengthLabel}
                                </div>

                                <ul className="grid grid-cols-2 mt-2 text-xs gap-x-3 gap-y-1">
                                    <Rule ok={rules.len} label="At least 8 characters"/>
                                    <Rule ok={rules.digit} label="Contains a number"/>
                                    <Rule ok={rules.upper} label="Uppercase letter"/>
                                    <Rule ok={rules.lower} label="Lowercase letter"/>
                                    <Rule ok={rules.special} label="Special character"/>
                                </ul>
                            </div>
                        )}
                    </div>


                    {/* Confirm Password */}
                    <div>
                        <Label htmlFor="confirmPassword" className="font-medium text-blue-900/80">
                            Confirm Password
                        </Label>
                        <div className="relative mt-1">
                            <Lock
                                className="absolute w-4 h-4 text-blue-300 -translate-y-1/2 pointer-events-none left-3 top-1/2"/>
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter your password"
                                className="pl-10 pr-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                                {...register("confirmPassword")}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                onClick={() => setShowConfirmPassword((s) => !s)}
                                className="absolute text-blue-400 transition -translate-y-1/2 right-3 top-1/2 hover:text-blue-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="flex gap-3">
                        <Checkbox
                            id="recruiter-terms"
                            checked={!!watch("terms")}
                            onCheckedChange={(checked) =>
                                setValue("terms", !!checked, {shouldValidate: true})
                            }
                            className="mt-0.5 flex-shrink-0 border-gray-300 hover:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <div className="flex-1">
                            <Label
                                htmlFor="recruiter-terms"
                                className="block text-sm leading-6 cursor-pointer text-blue-900/80"
                            >
                                {t`I have read and agree to the`}{" "}
                                <Link href="#"
                                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                    {t`Terms of Service`}
                                </Link>{" "}
                                {t`and`}{" "}
                                <Link href="#"
                                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                    {t`Privacy Policy`}
                                </Link>{" "}
                                {t`of JobHuntly`}
                            </Label>
                        </div>
                    </div>
                    {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={clsx(
                            "w-full",
                            "bg-blue-600 hover:bg-blue-700",
                            "focus-visible:ring-2 focus-visible:ring-blue-500",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                        )}
                    >
                        {isSubmitting ? "Creating account..." : "Sign Up"}
                    </Button>
                </form>
            </div>

            {/* After-register panel (ngay tại trang) */}
            {phase === "checkEmail" && registeredEmail && (
                <AfterRegisterPanel email={registeredEmail}/>
            )}

            {/* Optional: đi tới login */}
            {phase === "checkEmail" && (
                <div className="flex justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-4 text-blue-700 border-blue-200 rounded-xl hover:bg-blue-50"
                        onClick={() => router.push("/login")}
                    >
                        Go to Login
                    </Button>
                </div>
            )}
        </div>
    );
}

function Rule({ok, label}) {
    return (
        <li className={`flex items-center gap-2 ${ok ? "text-green-600" : "text-gray-500"}`}>
            <CheckCircle2 className={`h-3.5 w-3.5 ${ok ? "" : "opacity-40"}`}/>
            <span>{label}</span>
        </li>
    );
}

