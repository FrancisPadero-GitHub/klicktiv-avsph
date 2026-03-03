"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ReviewSummaryCards } from "@/components/dashboard/reviews/review-summary-cards";
import { ReviewsTable } from "@/components/dashboard/reviews/reviews-table";
import { AddEditReviewDialog } from "@/components/dashboard/reviews/form-review-dialog";
import { Button } from "@/components/ui/button";
import type { Database } from "@/database.types";

type ReviewRecordViewRow =
  Database["public"]["Views"]["v_review_records"]["Row"];

export default function ReviewsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedReview, setSelectedReview] =
    useState<ReviewRecordViewRow | null>(null);

  const handleOpenAddDialog = () => {
    setSelectedReview(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (review: ReviewRecordViewRow) => {
    setSelectedReview(review);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Review Records
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Manage and track all review records for completed jobs
          </p>
        </div>
        <Button onClick={handleOpenAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Review
        </Button>
      </div>

      <AddEditReviewDialog
        open={isDialogOpen}
        mode={dialogMode}
        selectedReview={selectedReview}
        onOpenChange={setIsDialogOpen}
      />

      {/* Summary Cards */}
      <ReviewSummaryCards />

      {/* Reviews Table */}
      <ReviewsTable onEdit={handleOpenEditDialog} />
    </div>
  );
}
