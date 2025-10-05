"use client";
import { useEffect, useState } from "react";
import { interviewSchema } from "@/validation/interviewSchema";
import { useCreateInterviewMutation } from "@/services/interviewService";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CreateInterviewModal({
    open,
    onOpenChange,
    // IDs (hidden from user but still sent to server)
    defaultCompanyId,
    defaultJobId,
    candidateId,
    // Read-only display info for better UX
    jobTitle,
    candidateName,
    candidateEmail,
}) {
    const [form, setForm] = useState({
        companyId: defaultCompanyId || "",
        jobId: defaultJobId || "",
        candidateId: candidateId || "",
        scheduledAt: "",
        durationMinutes: 30,
    });

    const [errors, setErrors] = useState({});
    const [createInterview, { isLoading }] = useCreateInterviewMutation();

    useEffect(() => {
        if (open) {
            setForm((f) => ({
                ...f,
                companyId: defaultCompanyId || "",
                jobId: defaultJobId || "",
                candidateId: candidateId || "",
            }));
            setErrors({});
        }
    }, [open, defaultCompanyId, defaultJobId, candidateId]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    async function onSubmit() {
        try {
            setErrors({});
            const payload = await interviewSchema.validate(form, {
                abortEarly: false,
            });
            await createInterview(payload).unwrap();
            toast.success("Interview created successfully");
            onOpenChange(false);
        } catch (e) {
            if (e.name === "ValidationError") {
                const map = {};
                e.inner.forEach((err) => (map[err.path] = err.message));
                setErrors(map);
            } else {
                toast.error(e?.data?.message || "Failed to create interview");
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-md"
                key={`${defaultCompanyId}-${defaultJobId}-${candidateId}-${open}`}
            >
                <DialogHeader>
                    <DialogTitle>Create interview</DialogTitle>
                    <DialogDescription>
                        Send a Google Calendar invite and email to the
                        candidate.
                    </DialogDescription>
                </DialogHeader>

                {/* Display-only summary (not sent to API) */}
                <div className="p-3 space-y-4 border rounded-md bg-gray-50">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <Label className="text-gray-600">Job</Label>
                            <div className="mt-1 font-medium">
                                {jobTitle || `Job #${form.jobId || "-"}`}
                            </div>
                        </div>
                        <div>
                            <Label className="text-gray-600">Candidate</Label>
                            <div className="mt-1 font-medium">
                                {candidateName || "—"}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label className="text-gray-600">Candidate email</Label>
                        <div className="mt-1 font-medium break-all">
                            {candidateEmail || "—"}
                        </div>
                    </div>
                </div>

                {/* Editable fields */}
                <div className="mt-4 space-y-3">
                    <div>
                        <Label>Scheduled at</Label>
                        <Input
                            type="datetime-local"
                            name="scheduledAt"
                            value={form.scheduledAt}
                            onChange={onChange}
                        />
                        {errors.scheduledAt && (
                            <p className="mt-1 text-xs text-rose-600">
                                {errors.scheduledAt}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                            type="number"
                            name="durationMinutes"
                            min={15}
                            value={form.durationMinutes}
                            onChange={onChange}
                            placeholder="30"
                        />
                        {errors.durationMinutes && (
                            <p className="mt-1 text-xs text-rose-600">
                                {errors.durationMinutes}
                            </p>
                        )}
                    </div>
                </div>

                {/* Hidden IDs (kept in state only) */}
                {/* Optional: keep as hidden inputs if you prefer; not necessary */}
                {/* <input type="hidden" name="companyId" value={form.companyId} />
        <input type="hidden" name="jobId" value={form.jobId} />
        <input type="hidden" name="candidateId" value={form.candidateId} /> */}

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
