"use client";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { X, Save } from "lucide-react";
import api from "@/lib/api";
import LoadingScreen from "@/components/ui/loadingScreen";

const validationSchema = yup.object().shape({
    categoryId: yup.string().required("Category is required"),
    industryId: yup.string().required("Industry is required"),
    skillId: yup.string().required("Skill is required"),
    levelId: yup.string().required("Level is required"),
});

export default function CandidateSkillModal({
    sectionId,
    sectionTitle,
    initialData = {},
    existingSkills = [],
    onClose,
    onSave,
}) {
    const [categories, setCategories] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [skills, setSkills] = useState([]);
    const [levels, setLevels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            categoryId: "",
            industryId: "",
            skillId: "",
            levelId: "",
        },
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = methods;

    const watchedValues = watch();

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/category/roots");
            setCategories(response.data);
            return response.data;
        } catch (err) {
            setError("Failed to fetch categories");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLevels = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/levels");
            setLevels(response.data);
            return response.data;
        } catch (err) {
            setError("Failed to fetch levels");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchIndustries = async (categoryId) => {
        if (!categoryId) return;
        setIsLoading(true);
        try {
            const response = await api.get(
                `/category/children-by-id/${categoryId}`
            );
            setIndustries(response.data);
            return response.data;
        } catch (err) {
            setError("Failed to fetch industries");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSkills = async (industryName) => {
        if (!industryName) return;
        setIsLoading(true);
        try {
            const response = await api.get(
                `/skill/by-category?name=${encodeURIComponent(industryName)}`
            );
            setSkills(response.data);
            return response.data;
        } catch (err) {
            setError("Failed to fetch skills");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchCategories(), fetchLevels()]);

            if (Object.keys(initialData).length > 0) {
                const categoryId = initialData.parentCategoryId?.toString();
                const industryId = initialData.categoryId?.toString();
                const skillId = initialData.skillId?.toString();
                const levelId = initialData.levelId?.toString();
                const industryName = initialData.categoryName;

                setValue("categoryId", categoryId, { shouldValidate: true });

                const industriesData = await fetchIndustries(categoryId);
                if (industriesData) {
                    setValue("industryId", industryId, {
                        shouldValidate: true,
                    });
                }
                const skillsData = await fetchSkills(industryName);
                if (skillsData) {
                    setValue("skillId", skillId, { shouldValidate: true });
                }

                setValue("levelId", levelId, { shouldValidate: true });
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (
            watchedValues.categoryId &&
            watchedValues.categoryId !==
                initialData.parentCategoryId?.toString()
        ) {
            fetchIndustries(watchedValues.categoryId);
            setValue("industryId", "");
            setValue("skillId", "");
            setSkills([]);
        }
    }, [watchedValues.categoryId]);

    useEffect(() => {
        if (
            watchedValues.industryId &&
            watchedValues.industryId !== initialData.categoryId?.toString()
        ) {
            const industry = industries.find(
                (ind) => ind.id.toString() === watchedValues.industryId
            );
            if (industry) {
                fetchSkills(industry.name);
                setValue("skillId", "");
            }
        }
    }, [watchedValues.industryId, industries]);

    const onSubmit = (data) => {
        const isDuplicate = existingSkills.some(
            (skill) =>
                skill.skillId.toString() === data.skillId &&
                skill.id !== initialData.id
        );
        if (isDuplicate) {
            toast.error("This skill already exists in your profile.");
            return;
        }

        const payload = {
            skillId: data.skillId,
            levelId: data.levelId,
        };

        onSave(payload);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
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
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {isLoading && <p>Loading ...</p>}
                        {error && <p className="text-red-500">{error}</p>}

                        {/* Category */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Category{" "}
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <select
                                {...register("categoryId")}
                                className={`w-full p-2 border rounded-md ${
                                    errors.categoryId
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:border-blue-500"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="text-xs text-red-500">
                                    {errors.categoryId.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Industry{" "}
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <select
                                {...register("industryId")}
                                disabled={!watchedValues.categoryId}
                                className={`w-full p-2 border rounded-md ${
                                    errors.industryId
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:border-blue-500"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                    !watchedValues.categoryId
                                        ? "bg-gray-100"
                                        : ""
                                }`}
                            >
                                <option value="">Select Industry</option>
                                {industries.map((industry) => (
                                    <option
                                        key={industry.id}
                                        value={industry.id}
                                    >
                                        {industry.name}
                                    </option>
                                ))}
                            </select>
                            {errors.industryId && (
                                <p className="text-xs text-red-500">
                                    {errors.industryId.message}
                                </p>
                            )}
                        </div>

                        {/* Skill */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Skill{" "}
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <select
                                {...register("skillId")}
                                disabled={!watchedValues.industryId}
                                className={`w-full p-2 border rounded-md ${
                                    errors.skillId
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:border-blue-500"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                    !watchedValues.industryId
                                        ? "bg-gray-100"
                                        : ""
                                }`}
                            >
                                <option value="">Select Skill</option>
                                {skills.map((skill) => (
                                    <option key={skill.id} value={skill.id}>
                                        {skill.name}
                                    </option>
                                ))}
                            </select>
                            {errors.skillId && (
                                <p className="text-xs text-red-500">
                                    {errors.skillId.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Level{" "}
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <select
                                {...register("levelId")}
                                className={`w-full p-2 border rounded-md ${
                                    errors.levelId
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:border-blue-500"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                            >
                                <option value="">Select Level</option>
                                {levels.map((level) => (
                                    <option key={level.id} value={level.id}>
                                        {level.name}
                                    </option>
                                ))}
                            </select>
                            {errors.levelId && (
                                <p className="text-xs text-red-500">
                                    {errors.levelId.message}
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-3 mt-5 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isDirty}
                                className={`px-3 py-1.5 text-sm text-white rounded-md flex items-center gap-2 ${
                                    isDirty
                                        ? "bg-blue-500 hover:bg-blue-600"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <Save className="inline w-4 h-4 mr-1" />
                                Save
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
