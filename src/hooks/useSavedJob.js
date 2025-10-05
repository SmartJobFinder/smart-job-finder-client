import {
    useGetStatusQuery,
    useSaveJobMutation,
    useUnsaveJobMutation,
} from "@/services/savedJobService";
import { useSelector } from "react-redux";

export function useSavedJob(jobId, { onNeedLogin, onToast } = {}) {
    const isLoggedIn = useSelector((state) => !!state.auth?.user);

    const { data, isLoading, isFetching } = useGetStatusQuery(jobId, {
        skip: !isLoggedIn || !jobId, 
        refetchOnMountOrArgChange: true, 
    });

    const [saveJob, { isLoading: savingSave }] = useSaveJobMutation();
    const [unsaveJob, { isLoading: savingUnsave }] = useUnsaveJobMutation();

    const liked = data?.saved ?? false;
    const saving = savingSave || savingUnsave || isFetching;

    const toggle = async () => {
        if (!jobId) return;

        if (!isLoggedIn) {
            onNeedLogin?.();
            return;
        }

        try {
            if (!liked) {
                await saveJob({ jobId }).unwrap();
                onToast?.("Saved job", "success");
            } else {
                await unsaveJob({ jobId }).unwrap();
                onToast?.("Unsaved job", "neutral");
            }
        } catch (e) {
            console.error(e);
            onToast?.("Có lỗi xảy ra", "error");
        }
    };

    return { liked, saving, toggle, isLoggedIn, isLoading };
}
