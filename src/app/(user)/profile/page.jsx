"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    useGetCombinedProfileQuery,
    useLazyGetSectionItemsQuery,
    useUpdateProfileMutation,
    useAddSectionItemMutation,
    useUpdateSectionItemMutation,
    useDeleteSectionItemMutation,
} from "@/services/profileService";
import { getProfileSectionData } from "@/app/(user)/profile/components/profileData";
import ProfileSidebarRight from "@/app/(user)/profile/components/ProfileSidebarRight";
import SectionCard from "@/app/(user)/components/SectionCard";
import GenericModal from "@/app/(user)/components/GenericModal";
import { profileSectionConfigs } from "@/app/(user)/profile/components/profileSectionConfigs";
import {
    setNormalizedProfile,
    selectNormalizedProfile,
    setCompletion,
} from "@/features/profile/profileSlice";
import PersonalDetailModal from "../components/PersonalDetailModal";
import CandidateSkillModal from "../components/CandidateSkillModal";
import { calculateProfileCompletion } from "@/features/profile/profileCompletion";
import LoadingScreen from "@/components/ui/loadingScreen";
import { normalizeProfileData } from "@/features/profile/normalizeProfileData";
import { setPersonalDetail } from "@/features/profile/personalDetailSlice";
import { toast } from "react-toastify";
import { meThunk } from "@/features/auth/authSlice";

const sectionToEndpointMap = {
    candidateSkills: "candidateSkills",
    education: "education",
    workExperience: "workExperience",
    softSkills: "softSkills",
    certificates: "certificates",
    awards: "awards",
};

export default function ProfilePage() {
    const dispatch = useDispatch();
    const normalizedProfileData = useSelector(selectNormalizedProfile);

    const {
        data: candidateProfileData,
        isLoading: isProfileLoading,
        error: profileError,
        isSuccess: profileSuccess,
        refetch: refetchProfile,
    } = useGetCombinedProfileQuery();

    const [updateCandidateProfile] = useUpdateProfileMutation();
    const [addSectionItem] = useAddSectionItemMutation();
    const [updateSectionItem] = useUpdateSectionItemMutation();
    const [deleteSectionItem] = useDeleteSectionItemMutation();

    const [getSectionItems] = useLazyGetSectionItemsQuery();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);
    const [editingItemIndex, setEditingItemIndex] = useState(null);

    const [refreshedSections, setRefreshedSections] = useState(new Set());

    const sectionIds = [
        "education",
        "candidateSkills",
        "workExperience",
        "softSkills",
        "certificates",
        "awards",
    ];

    useEffect(() => {
        if (profileSuccess && candidateProfileData) {
            const normalized = normalizeProfileData(candidateProfileData);
            dispatch(setNormalizedProfile(normalized));
            dispatch(setCompletion(calculateProfileCompletion(normalized)));
            dispatch(setPersonalDetail(normalized.personalDetail));
        }
    }, [candidateProfileData, profileSuccess, dispatch]);

    // useEffect(() => {
    //     if (!normalizedProfileData && !isProfileLoading && !profileError) {
    //         refetchProfile();
    //     }
    // }, [normalizedProfileData, isProfileLoading, profileError, refetchProfile]);

    const profileSectionData = getProfileSectionData(
        normalizedProfileData || {}
    );

    const isArraySection = (sectionId) => sectionIds.includes(sectionId);

    const hasMeaningfulContent = (sectionId, sectionData) => {
        if (sectionId === "aboutMe") {
            return sectionData?.text?.trim().length > 0;
        }
        if (sectionId === "personalDetail") {
            return Object.keys(sectionData || {}).length > 0;
        }
        return Array.isArray(sectionData)
            ? sectionData.length > 0
            : Object.keys(sectionData || {}).length > 0;
    };

    const refreshSectionAfterCRUD = async (sectionId) => {
        try {
            const { data: freshData } = await getSectionItems(
                sectionId
            ).unwrap();

            if (freshData && normalizedProfileData) {
                const updatedProfile = {
                    ...normalizedProfileData,
                    [sectionId]: freshData,
                };
                dispatch(setNormalizedProfile(updatedProfile));
                setRefreshedSections((prev) => new Set(prev).add(sectionId));
            }
        } catch (error) {
            console.error(`Failed to refresh ${sectionId}:`, error);
        }
    };

    const handleEdit = (section) => {
        setCurrentSection(section);
        setEditingItemIndex(null);
        setIsModalOpen(true);
    };

    const handleAdd = (section) => {
        setCurrentSection(section);
        setEditingItemIndex(null);
        setIsModalOpen(true);
    };

    const handleEditItem = (section, itemIndex) => {
        setCurrentSection(section);
        setEditingItemIndex(itemIndex);
        setIsModalOpen(true);
    };

    const handleDeleteItem = async (section, itemIndex) => {
        if (
            await window.customConfirm({
                title: "Delete Item",
                description: `Are you sure you want to delete this ${section.title} item?`,
                confirmText: "Yes",
                cancelText: "No",
            })
        ) {
            setIsDeleting(true);
            try {
                const itemId =
                    normalizedProfileData[section.id]?.[itemIndex]?.id;

                if (itemId) {
                    await deleteSectionItem({
                        section: sectionToEndpointMap[section.id] || section.id,
                        itemId: itemId,
                    }).unwrap();

                    toast.success("Item deleted successfully");
                    await refetchProfile();
                } else {
                    toast.error("Cannot delete: Item ID not found");
                }
            } catch (error) {
                console.error("Delete error:", error);
                if (error.status === 401) {
                    toast.warning(
                        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
                    );
                    window.location.href = "/login";
                } else {
                    toast.error(
                        "Failed to delete item: " +
                            (error.data?.message || error.message)
                    );
                }
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleSave = async (newData) => {
        try {
            if (
                currentSection.id === "personalDetail" ||
                currentSection.id === "aboutMe"
            ) {
                const updatedData = {
                    id: normalizedProfileData?.personalDetail?.id,
                    fullName:
                        currentSection.id === "personalDetail"
                            ? newData.fullName ||
                              normalizedProfileData?.personalDetail?.fullName
                            : normalizedProfileData?.personalDetail?.fullName,
                    title:
                        currentSection.id === "personalDetail"
                            ? newData.title ||
                              normalizedProfileData?.personalDetail?.title
                            : normalizedProfileData?.personalDetail?.title,
                    email:
                        currentSection.id === "personalDetail"
                            ? newData.email ||
                              normalizedProfileData?.personalDetail?.email
                            : normalizedProfileData?.personalDetail?.email,
                    dateOfBirth:
                        currentSection.id === "personalDetail"
                            ? newData.dateOfBirth ||
                              normalizedProfileData?.personalDetail?.dateOfBirth
                            : normalizedProfileData?.personalDetail
                                  ?.dateOfBirth,
                    phone:
                        currentSection.id === "personalDetail"
                            ? newData.phone ||
                              normalizedProfileData?.personalDetail?.phone
                            : normalizedProfileData?.personalDetail?.phone,
                    gender:
                        currentSection.id === "personalDetail"
                            ? newData.gender ||
                              normalizedProfileData?.personalDetail?.gender
                            : normalizedProfileData?.personalDetail?.gender,
                    personalLink:
                        currentSection.id === "personalDetail"
                            ? newData.personalLink ||
                              normalizedProfileData?.personalDetail
                                  ?.personalLink
                            : normalizedProfileData?.personalDetail
                                  ?.personalLink,
                    aboutMe:
                        currentSection.id === "aboutMe"
                            ? newData.text
                            : normalizedProfileData?.aboutMe?.text,
                };

                const formData = new FormData();
                for (const key in updatedData) {
                    if (
                        updatedData[key] !== undefined &&
                        updatedData[key] !== null
                    ) {
                        formData.append(key, updatedData[key]);
                    }
                }
                if (newData.avatarFile && newData.avatarFile instanceof File) {
                    formData.append("avatar", newData.avatarFile);
                }

                await updateCandidateProfile(formData).unwrap();
                toast.success("Profile updated successfully");

                const updated = await refetchProfile();
                const normalized = normalizeProfileData(updated.data);
                dispatch(setPersonalDetail(normalized.personalDetail));
                await dispatch(meThunk()).unwrap();
            } else if (isArraySection(currentSection.id)) {
                if (editingItemIndex !== null) {
                    const itemId =
                        normalizedProfileData[currentSection.id]?.[
                            editingItemIndex
                        ]?.id;

                    if (itemId) {
                        await updateSectionItem({
                            section:
                                sectionToEndpointMap[currentSection.id] ||
                                currentSection.id,
                            itemId: itemId,
                            data: newData,
                        }).unwrap();
                        toast.success("Item updated successfully");
                    } else {
                        toast.error("Cannot update: Item ID not found");
                        return;
                    }
                } else {
                    await addSectionItem({
                        section:
                            sectionToEndpointMap[currentSection.id] ||
                            currentSection.id,
                        data: newData,
                    }).unwrap();
                    toast.success("Item added successfully");
                }

                await refetchProfile();
            }

            setIsModalOpen(false);
            setCurrentSection(null);
            setEditingItemIndex(null);
        } catch (error) {
            if (error.status === 401) {
                toast.error(
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
                );
                window.location.href = "/login";
            } else {
                toast.error(
                    "Failed to save data: " +
                        (error.data?.message || error.message)
                );
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSection(null);
        setEditingItemIndex(null);
    };

    if (isProfileLoading) return <LoadingScreen message="Loading ..." />;

    if (profileError) {
        if (profileError.status === 401) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            window.location.href = "/login";
            return null;
        }
        return (
            <div>
                Error:{" "}
                {profileError?.data?.message ||
                    profileError?.error ||
                    profileError?.message ||
                    "Unable to load data"}
            </div>
        );
    }

    if (!isProfileLoading && !profileError && !normalizedProfileData) {
        return <div>No profile data available</div>;
    }

    return (
        <div className="flex flex-col w-full gap-6 lg:flex-row lg:items-start">
            <div className="flex-1 w-full xl:max-w-[78%]">
                <div className="grid grid-cols-1 gap-4">
                    {profileSectionData.map((section) => {
                        const sectionData =
                            normalizedProfileData?.[section.id] ||
                            (isArraySection(section.id) ? [] : {});
                        const hasContent = hasMeaningfulContent(
                            section.id,
                            sectionData
                        );

                        let content = null;
                        if (hasContent && section.renderComponent) {
                            const Component = section.renderComponent;
                            content = (
                                <Component
                                    data={sectionData}
                                    onEdit={
                                        isArraySection(section.id)
                                            ? (itemIndex) =>
                                                  handleEditItem(
                                                      section,
                                                      itemIndex
                                                  )
                                            : () => handleEdit(section)
                                    }
                                    onDelete={
                                        isArraySection(section.id)
                                            ? (itemIndex) =>
                                                  handleDeleteItem(
                                                      section,
                                                      itemIndex
                                                  )
                                            : undefined
                                    }
                                />
                            );
                        }

                        return (
                            <SectionCard
                                key={section.id}
                                id={section.id}
                                title={section.title}
                                description={section.description}
                                imageSrc={section.imageSrc}
                                imageAlt={section.imageAlt}
                                content={content}
                                data={sectionData}
                                onEdit={
                                    hasContent && !isArraySection(section.id)
                                        ? () => handleEdit(section)
                                        : undefined
                                }
                                onAdd={
                                    isArraySection(section.id) || !hasContent
                                        ? () => handleAdd(section)
                                        : undefined
                                }
                            />
                        );
                    })}
                </div>
            </div>
            <div className="w-full lg:max-w-[25%] shrink-0 sticky top-24 h-fit max-h-[calc(100vh-2rem)] z-2">
                <ProfileSidebarRight />
            </div>
            {isModalOpen && currentSection && (
                <>
                    {currentSection.id === "personalDetail" ? (
                        <PersonalDetailModal
                            sectionTitle={currentSection.title}
                            config={profileSectionConfigs[currentSection.id]}
                            validationSchema={
                                profileSectionConfigs[currentSection.id]
                                    .validationSchema
                            }
                            initialData={
                                normalizedProfileData?.personalDetail || {}
                            }
                            onSave={handleSave}
                            onClose={handleCloseModal}
                        />
                    ) : currentSection.id === "candidateSkills" ? (
                        <CandidateSkillModal
                            sectionId={currentSection.id}
                            sectionTitle={currentSection.title}
                            initialData={
                                editingItemIndex !== null
                                    ? normalizedProfileData?.[
                                          currentSection.id
                                      ]?.[editingItemIndex] || {}
                                    : {}
                            }
                            existingSkills={
                                normalizedProfileData?.candidateSkills || []
                            }
                            onSave={handleSave}
                            onClose={handleCloseModal}
                        />
                    ) : (
                        <GenericModal
                            sectionId={currentSection.id}
                            sectionTitle={currentSection.title}
                            config={profileSectionConfigs[currentSection.id]}
                            validationSchema={
                                profileSectionConfigs[currentSection.id]
                                    .validationSchema
                            }
                            initialData={
                                editingItemIndex !== null
                                    ? normalizedProfileData?.[
                                          currentSection.id
                                      ]?.[editingItemIndex] || {}
                                    : isArraySection(currentSection.id)
                                    ? {}
                                    : normalizedProfileData?.[
                                          currentSection.id
                                      ] || {}
                            }
                            onSave={handleSave}
                            onClose={handleCloseModal}
                        />
                    )}
                </>
            )}
        </div>
    );
}
