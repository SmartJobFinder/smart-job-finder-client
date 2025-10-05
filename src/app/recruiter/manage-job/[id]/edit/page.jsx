"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { patchJobById } from "@/services/recruiterJobsService";

function toIsoDateFromDDMMYYYY(value) {
    if (!value) return "";
    const [d, m, y] = String(value).split("-");
    if (!y) return value;
    const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    return iso;
}

function toDDMMYYYYFromIso(value) {
    if (!value) return "";
    const parts = String(value).split("-");
    if (parts[0].length === 4) {
        const [y, m, d] = parts;
        return `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
    }
    return value;
}

export default function EditJobPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ title: "", status: "ACTIVE", expired_date: "", description: "" });

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/job/${jobId}`);
                setForm({
                    title: data.title || "",
                    status: (data.status || "ACTIVE").toUpperCase(),
                    expired_date: data.expired_date || "",
                    description: data.description || "",
                });
            } catch (e) {
                setError(e?.message || "Unable to load job");
            } finally {
                setLoading(false);
            }
        };
        if (jobId) load();
    }, [jobId]);

    const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const onSave = async () => {
        try {
            setSaving(true);
            setError("");
            const payload = {
                title: form.title,
                status: form.status,
                description: form.description,
                expired_date: form.expired_date ? toDDMMYYYYFromIso(form.expired_date) : undefined,
            };
            await patchJobById(jobId, payload);
            router.push("/recruiter/manage-job");
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-4">
            <h1 className="text-xl font-semibold">Edit Job #{jobId}</h1>
            <Card className="p-4 space-y-4">
                <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                    You can only edit basic information (title, status, expired date, description). To edit everything, please deactivate the job and create a new one.
                </div>
                <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input value={form.title} onChange={onChange("title")} />
                </div>
                <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="mt-1">
                        <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                                <SelectItem value="DRAFT">DRAFT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium">Expired date</label>
                    <Input
                        type="date"
                        value={form.expired_date ? toIsoDateFromDDMMYYYY(form.expired_date) : ""}
                        onChange={(e) => setForm((f) => ({ ...f, expired_date: e.target.value }))}
                    />
                    <div className="text-xs text-muted-foreground mt-1">Format: dd-MM-yyyy</div>
                </div>
                <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea value={form.description} onChange={onChange("description")} rows={6} />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex gap-2">
                    <Button disabled={saving} onClick={onSave}>Save</Button>
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                </div>
            </Card>
        </div>
    );
} 