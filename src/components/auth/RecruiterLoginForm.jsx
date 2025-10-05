"use client";

import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Eye, EyeOff, Lock, Mail} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {loginSchema} from "@/validation/loginSchema";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import LoadingScreen from "../ui/loadingScreen";
import {loginThunk} from "@/features/auth/authSlice";
import {toast} from "react-toastify";
import {selectAuthLoading} from "@/features/auth/authSelectors";
import clsx from "clsx";

const RecruiterLoginForm = ({role, onForgot}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isAuthLoading = useSelector(selectAuthLoading);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (form) => {
        const payload = {
            email: form.email,
            password: form.password,
            role: role ?? "RECRUITER",
        };

        try {
            const result = await dispatch(loginThunk(payload)).unwrap();
            const roleRes = result?.user?.role;

            const okMsg = result?.message || "Login successful!";

            router.replace("/recruiter/dashboard");

            toast.success(okMsg, {
                autoClose: 3000,
            });
        } catch (err) {
            const msg =
                err?.detail ||
                err?.title ||
                err?.message ||
                err?.data?.message ||
                "Login failed";
            toast.error(msg);
        }
    };

    if (isAuthLoading) {
        return <LoadingScreen message="Logging in..." loaderClassName="loader--blue"/>;
    }
    return (
        <div className="w-full">
            <div className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div>
                        <Label
                            htmlFor="recruiter-email"
                            className="font-medium text-blue-900/80"
                        >
                            Email
                        </Label>
                        <div className="relative mt-1">
                            <Mail
                                className="absolute w-4 h-4 text-blue-300 -translate-y-1/2 pointer-events-none left-3 top-1/2"/>
                            <Input
                                id="recruiter-email"
                                type="email"
                                placeholder="you@company.com"
                                autoComplete="username"
                                className={clsx(
                                    "pl-10",
                                    "focus-visible:ring-blue-500 focus-visible:ring-2",
                                )}
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="recruiter-password"
                            className="font-medium text-blue-900/80"
                        >
                            Password
                        </Label>
                        <div className="relative mt-1">
                            <Lock
                                className="absolute w-4 h-4 text-blue-300 -translate-y-1/2 pointer-events-none left-3 top-1/2"/>
                            <Input
                                id="recruiter-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                className={clsx(
                                    "pl-10 pr-10",
                                    "focus-visible:ring-blue-500 focus-visible:ring-2",
                                )}
                                {...register("password")}
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
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={clsx(
                            "w-full",
                            "bg-blue-600 hover:bg-blue-700",
                            "focus-visible:ring-2 focus-visible:ring-blue-500",
                        )}
                    >
                        {isSubmitting ? "Signing in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default RecruiterLoginForm;

