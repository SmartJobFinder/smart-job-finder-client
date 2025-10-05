"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    FileText,
    Gift,
    MapPin,
    Clock,
    Share2,
} from "lucide-react";
import { toast } from "react-toastify";
import JobReviewPage from "./reviewpage.jsx";
// Import custom components
import StepIndicator from "@/app/recruiter/create-job/components/StepIndicator";
import JobInformationForm from "@/app/recruiter/create-job/components/JobInformationForm";
import JobDescriptionForm from "@/app/recruiter/create-job/components/JobDescriptionForm";
import BenefitsForm from "@/app/recruiter/create-job/components/BenefitsForm";
import RecentJobsList from "@/app/recruiter/create-job/components/RecentJobsList";
import { useAppDispatch } from "@/store/hooks.js";
import {
    getLevels,
    getCities,
    getWards,
    getCategories,
    getSkillsByCategory,
    getWorkTypes,
    createJob,
} from "@/services/jobCreateService";
import { getMyCompany } from "@/services/companyService";

export default function JobPostingForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [showReview, setShowReview] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [errors, setErrors] = useState({
        jobTitle: "",
        workType: "",
        city: "",
        address: "",
        categories: "",
    });

    // API data states
    const [jobLevels, setJobLevels] = useState([]);
    const [cities, setCities] = useState([]);
    const [wards, setWards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);

    // Loading states
    const [isLoadingLevels, setIsLoadingLevels] = useState(true);
    const [isLoadingCities, setIsLoadingCities] = useState(true);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingWorkTypes, setIsLoadingWorkTypes] = useState(true);
    const [isLoadingSkills, setIsLoadingSkills] = useState(false);

    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        jobTitle: "",
        categories: [],
        city: "",
        address: "",
        workType: [],
        salaryMin: 0,
        salaryMax: 0,
        salaryType: 0, // 0: range, 1: thỏa thuận
        level: [],
        skill: [],
        benefits: [
            {
                id: "1",
                title: "Full Healthcare",
                description:
                    "We believe in thriving communities and that starts with our team being happy and healthy.",
                icon: "heart",
            },
            {
                id: "2",
                title: "Unlimited Vacation",
                description:
                    "We believe you should have a flexible schedule that makes space for family, wellness, and fun.",
                icon: "plane",
            },
            {
                id: "3",
                title: "Skill Development",
                description:
                    "We believe in always learning and leveling up our skills. Whether it's a conference or online course.",
                icon: "graduation",
            },
        ],
        jobDescription: "",
        niceToHaves: "",
        requirements: "",
        datePost: new Date().toISOString().split("T")[0],
        expiredDate: "",
        wardIds: [],
    });

    const [companyId, setCompanyId] = useState(null);
    const [companyName, setCompanyName] = useState("");

    const steps = [
        { number: 1, title: "Job Information", icon: Briefcase },
        { number: 2, title: "Job Description", icon: FileText },
        { number: 3, title: "Perks & Benefit", icon: Gift },
    ];

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []);

    // Load skills when categories change (merge skills from all selected categories)
    useEffect(() => {
        if (formData.categories && formData.categories.length > 0) {
            loadSkillsForCategories(formData.categories);
        } else {
            setSkills([]);
        }
    }, [formData.categories]);

    // Load wards when city changes
    useEffect(() => {
        if (formData.city) {
            loadWards(formData.city);
        } else {
            // Clear wards when no city is selected
            setWards([]);
            setFormData((prev) => ({
                ...prev,
                wardIds: [],
            }));
        }
    }, [formData.city]);

    // Load company info when component mounts
    useEffect(() => {
        loadMyCompany();
    }, []);

    const loadInitialData = async () => {
        try {
            await Promise.all([
                loadLevels(),
                loadCities(),
                loadCategories(),
                loadWorkTypes(),
            ]);
        } catch (error) {
            console.error("Error loading initial data:", error);
        }
    };

    const loadLevels = async () => {
        try {
            setIsLoadingLevels(true);
            const data = await getLevels();
            setJobLevels(data);
        } catch (error) {
            console.error("Error loading levels:", error);
        } finally {
            setIsLoadingLevels(false);
        }
    };

    const loadCities = async () => {
        try {
            setIsLoadingCities(true);
            const data = await getCities();
            setCities(data);
        } catch (error) {
            console.error("Error loading cities:", error);
        } finally {
            setIsLoadingCities(false);
        }
    };

    const loadWards = async (cityName) => {
        try {
            const data = await getWards(cityName);
            setWards(data);
            // Clear selected wards when city changes
            setFormData((prev) => ({
                ...prev,
                wardIds: [],
            }));
        } catch (error) {
            console.error("Error loading wards:", error);
            setWards([]);
        }
    };

    const loadCategories = async () => {
        try {
            setIsLoadingCategories(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error loading categories:", error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const loadSkillsByCategory = async (categoryName) => {
        try {
            setIsLoadingSkills(true);
            const data = await getSkillsByCategory(categoryName);
            setSkills(data);
        } catch (error) {
            console.error("Error loading skills:", error);
        } finally {
            setIsLoadingSkills(false);
        }
    };

    const loadSkillsForCategories = async (categoryNames = []) => {
        try {
            setIsLoadingSkills(true);
            const results = await Promise.all(
                (categoryNames || []).map((name) =>
                    getSkillsByCategory(name).catch(() => [])
                )
            );
            const merged = [];
            const seen = new Set();
            results.forEach((arr) => {
                (arr || []).forEach((skill) => {
                    const key = skill?.id ?? skill?.name;
                    if (key != null && !seen.has(key)) {
                        seen.add(key);
                        merged.push(skill);
                    }
                });
            });
            setSkills(merged);
        } catch (error) {
            console.error("Error loading skills for categories:", error);
            setSkills([]);
        } finally {
            setIsLoadingSkills(false);
        }
    };

    const loadWorkTypes = async () => {
        try {
            setIsLoadingWorkTypes(true);
            const data = await getWorkTypes();
            setWorkTypes(data);
        } catch (error) {
            console.error("Error loading work types:", error);
        } finally {
            setIsLoadingWorkTypes(false);
        }
    };

    const loadMyCompany = async () => {
        try {
            const company = await getMyCompany();
            setCompanyId(company.id);
            setCompanyName(company.companyName);
        } catch (error) {
            console.error("Error loading company:", error);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.jobTitle.trim())
                newErrors.jobTitle = "Please enter job title";
            if (!formData.categories || formData.categories.length === 0)
                newErrors.categories = "Please select categories";
            if (!formData.city) newErrors.city = "Please select city";
            if (!formData.address.trim())
                newErrors.address = "Please enter address";
            if (!formData.workType.length)
                newErrors.workType = "Please select work type";
        }

        if (step === 2) {
            // Check job description (remove HTML tags to check actual content)
            const jobDescText = formData.jobDescription
                ? formData.jobDescription.replace(/<[^>]*>/g, "").trim()
                : "";
            if (!jobDescText) {
                newErrors.jobDescription = "Please enter job description";
            }

            // Check requirements (remove HTML tags to check actual content)
            const requirementsText = formData.requirements
                ? formData.requirements.replace(/<[^>]*>/g, "").trim()
                : "";
            if (!requirementsText) {
                newErrors.requirements = "Please enter job requirements";
            }

            // Check expired date
            if (!formData.expiredDate) {
                newErrors.expiredDate = "Please select expired date";
            } else {
                // Check expired date must be after post date
                const postDate = new Date(formData.datePost);
                const expiredDate = new Date(formData.expiredDate);
                if (expiredDate <= postDate) {
                    newErrors.expiredDate =
                        "Expired date must be after post date";
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep < 3) {
            if (validateStep(currentStep)) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            setShowReview(true);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            setShowReview(false);
        }
    };

    const formatDateForAPI = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Check if company ID is available
            if (!companyId) {
                toast.error(
                    "Cannot find company information. Please login again."
                );
                return false;
            }

            // Build location string with address, ward, and city
            const buildLocationString = () => {
                let locationParts = [];

                // Add address detail
                if (formData.address) {
                    locationParts.push(formData.address);
                }

                // Add ward if available
                if (formData.wardIds && formData.wardIds.length > 0) {
                    const selectedWards = wards.filter((ward) =>
                        formData.wardIds.includes(ward.id)
                    );
                    if (selectedWards.length > 0) {
                        const wardNames = selectedWards
                            .map((ward) => ward.name)
                            .join(", ");
                        locationParts.push(wardNames);
                    }
                }

                // Add city
                if (formData.city) {
                    locationParts.push(formData.city);
                }

                return locationParts.join(", ");
            };

            // Prepare data according to API spec
            const jobData = {
                company_id: companyId,
                title: formData.jobTitle,
                date_post: formatDateForAPI(formData.datePost),
                expired_date: formatDateForAPI(formData.expiredDate),
                description: formData.jobDescription,
                requirements: formData.requirements,
                benefits: JSON.stringify(
                    formData.benefits.map((benefit) => ({
                        title: benefit.title,
                        description: benefit.description,
                        icon: benefit.icon,
                    }))
                ),
                location: buildLocationString(),
                status: "active",
                salary_min: formData.salaryMin,
                salary_max: formData.salaryMax,
                salary_type: formData.salaryType,
                category_names: formData.categories || [],
                skill_names: formData.skill,
                level_names: formData.level,
                work_type_names: formData.workType,
                ward_ids: formData.wardIds,
            };

            const response = await createJob(jobData);

            // Always show success toast if we reach here (no exception thrown)
            toast.success("Job created successfully!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Reset form
            setFormData({
                jobTitle: "",
                categories: [],
                city: "",
                address: "",
                workType: [],
                salaryMin: 0,
                salaryMax: 0,
                salaryType: 0,
                level: [],
                skill: [],
                benefits: [],
                jobDescription: "",
                niceToHaves: "",
                requirements: "",
                datePost: new Date().toISOString().split("T")[0],
                expiredDate: "",
                wardIds: [],
            });
            setCurrentStep(1);
            setShowReview(false);

            return true; // Return success
        } catch (error) {
            console.error("Error creating job:", error);
            toast.error("Error creating job", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return false; // Return failure
        } finally {
            setIsLoading(false);
        }
    };

    if (showReview) {
        return (
            <JobReviewPage
                formData={formData}
                onEdit={() => setShowReview(false)}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                setParentFormData={setFormData}
                setParentIsLoading={setIsLoading}
                setParentJobs={setJobs}
                parentJobs={jobs}
                companyName={companyName}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create New Job
                    </h1>
                    <p className="text-gray-600">
                        Fill in the details to create a job
                    </p>
                </div>

                <StepIndicator currentStep={currentStep} steps={steps} />

                <Card className="mt-8">
                    <CardContent className="p-8">
                        {currentStep === 1 && (
                            <JobInformationForm
                                formData={formData}
                                onInputChange={handleInputChange}
                                errors={errors}
                                jobLevels={jobLevels}
                                cities={cities}
                                wards={wards}
                                categories={categories}
                                skills={skills}
                                workTypes={workTypes}
                                isLoadingLevels={isLoadingLevels}
                                isLoadingCities={isLoadingCities}
                                isLoadingCategories={isLoadingCategories}
                                isLoadingWorkTypes={isLoadingWorkTypes}
                                isLoadingSkills={isLoadingSkills}
                            />
                        )}

                        {currentStep === 2 && (
                            <JobDescriptionForm
                                formData={formData}
                                onInputChange={handleInputChange}
                                errors={errors}
                            />
                        )}

                        {currentStep === 3 && (
                            <BenefitsForm
                                formData={formData}
                                onInputChange={handleInputChange}
                            />
                        )}

                        <div className="flex justify-between mt-8">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            <Button onClick={handleNext} disabled={isLoading}>
                                {currentStep === 3 ? "Previous" : "Next"}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <RecentJobsList jobs={jobs} />
            </div>
        </div>
    );
}
