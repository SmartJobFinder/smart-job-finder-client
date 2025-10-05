"use client";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, Save, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import DatePicker from "./DatePicker";
import { format, parse, isValid } from "date-fns";

const PersonalDetailModal = ({
    sectionTitle,
    config,
    validationSchema,
    initialData = {},
    onClose,
    onSave,
}) => {
    const [hasChanges, setHasChanges] = useState(false);
    const [imageError, setImageError] = useState(false); 
    const [previewAvatar, setPreviewAvatar] = useState(
        initialData.avatar || ""
    ); 
    const fileInputRef = useRef(null);

    const transformInitialData = () => {
        const transformed = { ...initialData };
        config.fields.forEach((field) => {
            if (field.type === "date" && transformed[field.key]) {
                let parsed = parse(
                    transformed[field.key],
                    "yyyy-MM-dd",
                    new Date()
                );
                if (!isValid(parsed)) {
                    parsed = parse(
                        transformed[field.key],
                        "dd/MM/yyyy",
                        new Date()
                    );
                }
                transformed[field.key] = isValid(parsed) ? parsed : null;
            }
        });
        return transformed;
    };

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: transformInitialData(),
        mode: "onBlur",
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = methods;

    const watchedValues = watch();

    // Detect changes
    useEffect(() => {
        const hasFormChanges = Object.keys(watchedValues).some((key) => {
            const currentValue = watchedValues[key];
            const initialValue = initialData[key];

            const field = config.fields.find((f) => f.key === key);
            if (field?.type === "date" && currentValue) {
                const formattedCurrent = currentValue
                    ? format(currentValue, "dd/MM/yyyy")
                    : "";
                const formattedInitial = initialValue || "";
                return formattedCurrent !== formattedInitial;
            }

            if (field?.type === "file") {
                return currentValue?.[0] !== initialValue;
            }

            const normalizedCurrent =
                currentValue == null || currentValue === ""
                    ? ""
                    : String(currentValue);
            const normalizedInitial =
                initialValue == null || initialValue === ""
                    ? ""
                    : String(initialValue);

            return normalizedCurrent !== normalizedInitial;
        });

        setHasChanges(hasFormChanges);
    }, [watchedValues, initialData, config.fields]);

    const handleAvatarChange = (event, fieldKey) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue(fieldKey, event.target.files);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewAvatar(e.target.result);
                setImageError(false); // Reset lỗi khi upload thành công
            };
            reader.onerror = () => {
                setImageError(true); // Đặt lỗi nếu đọc file thất bại
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = (data) => {
        const processedData = { ...data };

        config.fields.forEach((field) => {
            if (
                field.type === "file" &&
                data[field.key] &&
                data[field.key][0]
            ) {
                processedData[`${field.key}File`] = data[field.key][0];
                delete processedData[field.key];
            } else if (field.type === "date" && data[field.key]) {
                processedData[field.key] = format(
                    data[field.key],
                    "yyyy-MM-dd"
                );
            }
        });

        onSave(processedData);
        onClose();
    };

    if (!config) return null;

    // Debug giá trị (tạm thời để kiểm tra)
    useEffect(() => {
        console.log("initialData.avatar:", initialData.avatar);
        console.log("previewAvatar:", previewAvatar);
        console.log("imageError:", imageError);
    }, [initialData.avatar, previewAvatar, imageError]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
            <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {Object.keys(initialData).length > 0 ? "Edit" : "Add"}{" "}
                        {sectionTitle}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 max-h-[65vh] overflow-y-auto"
                    >
                        <div className="flex gap-6">
                            {/* Avatar Section */}
                            {config.fields.some((f) => f.key === "avatar") && (
                                <div className="flex flex-col items-center w-full gap-3 md:w-auto">
                                    <div className="w-32 h-32">
                                        <div className="flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-100 border-4 border-gray-200 rounded-full">
                                            {previewAvatar && !imageError ? (
                                                <Image
                                                    src={previewAvatar}
                                                    alt="Avatar preview"
                                                    width={128}
                                                    height={128}
                                                    className="object-cover w-full h-full"
                                                    unoptimized={true} // Cho phép tất cả URL, kể cả bên ngoài
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                        setImageError(true);
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-xs text-center text-gray-400">
                                                    No image
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Change Avatar
                                    </button>
                                    <input
                                        {...register("avatar")}
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleAvatarChange(e, "avatar")
                                        }
                                        className="hidden"
                                    />
                                    <div className="w-full mt-1 text-xs text-center min-h-[1rem]">
                                        {errors.avatar ? (
                                            <span className="block max-w-[8rem] text-red-500 break-words">
                                                {errors.avatar.message?.includes(
                                                    "5MB"
                                                )
                                                    ? `${
                                                          errors.avatar.message
                                                      }. Current size: ${(
                                                          (watchedValues
                                                              .avatar?.[0]
                                                              ?.size || 0) /
                                                          (1024 * 1024)
                                                      ).toFixed(2)} MB`
                                                    : errors.avatar.message}
                                            </span>
                                        ) : (
                                            <span className="opacity-0">
                                                placeholder
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Other Fields */}
                            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                                {config.fields
                                    .filter((field) => field.key !== "avatar")
                                    .map((field) => (
                                        <div
                                            key={field.key}
                                            className={`flex flex-col gap-1 ${
                                                field.type === "textarea"
                                                    ? "md:col-span-2"
                                                    : ""
                                            }`}
                                        >
                                            <label className="text-sm font-medium text-gray-700 capitalize">
                                                {field.label}
                                                {field.required && (
                                                    <span className="ml-1 text-red-500">
                                                        *
                                                    </span>
                                                )}
                                            </label>

                                            {field.type === "textarea" ? (
                                                <textarea
                                                    {...register(field.key)}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    rows={4}
                                                    className={`w-full p-3 border rounded-md resize-none ${
                                                        errors[field.key]
                                                            ? "border-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:border-blue-500"
                                                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                                />
                                            ) : field.type === "select" ? (
                                                <select
                                                    {...register(field.key)}
                                                    className={`w-full p-3 border rounded-md ${
                                                        errors[field.key]
                                                            ? "border-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:border-blue-500"
                                                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                                >
                                                    <option value="">
                                                        Select {field.label}
                                                    </option>
                                                    {field.options?.map(
                                                        (option) => (
                                                            <option
                                                                key={
                                                                    option.value ||
                                                                    option
                                                                }
                                                                value={
                                                                    option.value ||
                                                                    option
                                                                }
                                                            >
                                                                {option.label ||
                                                                    option}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            ) : field.type === "date" ? (
                                                <DatePicker
                                                    value={
                                                        watchedValues[
                                                            field.key
                                                        ] || null
                                                    }
                                                    onChange={(date) =>
                                                        setValue(
                                                            field.key,
                                                            date
                                                        )
                                                    }
                                                    placeholder={
                                                        field.placeholder ||
                                                        "Select date"
                                                    }
                                                    name={field.key}
                                                    error={
                                                        errors[field.key]
                                                            ?.message
                                                    }
                                                />
                                            ) : (
                                                <input
                                                    type={field.type || "text"}
                                                    {...register(field.key)}
                                                    readOnly={
                                                        field.key === "email"
                                                    }
                                                    aria-readonly={
                                                        field.key === "email"
                                                    }
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    className={`w-full p-3 border rounded-md ${
                                                        errors[field.key]
                                                            ? "border-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:border-blue-500"
                                                    }
                                                    ${
                                                        field.key === "email"
                                                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                            : ""
                                                    }
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                                />
                                            )}

                                            {errors[field.key] &&
                                                field.type !== "date" && (
                                                    <p className="text-xs text-red-500">
                                                        {
                                                            errors[field.key]
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </form>
                </FormProvider>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={!hasChanges}
                        className={`px-4 py-2 text-sm text-white rounded-md flex items-center gap-2 ${
                            hasChanges
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <Save className="w-4 h-4" />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailModal;