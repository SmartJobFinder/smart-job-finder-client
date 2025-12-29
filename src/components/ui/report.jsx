"use client";

import React, { useState, useEffect } from "react";
import { t } from "@/i18n/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import reportService from "@/services/reportService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReportModal({ open, onClose, type, contentId }) {
  const [description, setDescription] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const reportTypeText = {
    0: t`Report Job Posting`,
    1: t`Report User`,
    2: t`Report Company`,
  };

  useEffect(() => {
    if (open) {
      setDescription("");
      setAgree(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!agree) {
      toast.warning(t`You must confirm the report is accurate`);
      return;
    }
    try {
      setLoading(true);
      await reportService.create({
        reportType: type,
        reportedContentId: contentId,
        description,
      });
      toast.success(t`Report submitted successfully`);
      onClose();
    } catch (err) {
      console.error("Report error", err);
      toast.error(err?.response?.data?.message || t`Failed to submit report`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] gap-4">
        <DialogHeader>
          <DialogTitle>
            {t`Report`} {reportTypeText[type] || t`Content`}
          </DialogTitle>
          <DialogDescription>
            {t`Please provide details for your report below.`}
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="reportType" className={`pb-0`}>
          {t`Report type`}
        </Label>
        <Select value={String(type)} disabled>
          <SelectTrigger className="w-full font-semibold">
            <SelectValue className="" />
          </SelectTrigger>
          <SelectContent>
            <SelectContent>
              <SelectItem value="0">{t`Report Job Posting`}</SelectItem>
              <SelectItem value="1">{t`Report User`}</SelectItem>
              <SelectItem value="2">{t`Report Company`}</SelectItem>
            </SelectContent>
          </SelectContent>
        </Select>

        <Label htmlFor="description" className={`pb-0`}>
          {t`Report Description`}
        </Label>
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={t`Enter detailed description...`}
          className="min-h-[100px] "
        />

        <div className="flex items-start gap-2 mt-3">
          <Checkbox
            id="confirm-report"
            checked={agree}
            onCheckedChange={val => setAgree(!!val)}
          />
          <label
            htmlFor="confirm-report"
            className="text-sm leading-tight text-gray-600"
          >
            {t`I confirm this report is accurate and complies with our policies.`}
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t`Cancel`}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t`Submitting...` : t`Submit`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
