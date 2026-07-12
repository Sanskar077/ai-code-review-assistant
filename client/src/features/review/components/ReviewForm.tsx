"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { AIReviewSummary } from "@/components/review/AIReviewSummary";
import { AnalysisStatusBanner } from "@/components/review/AnalysisStatusBanner";
import { CodeEditor } from "@/components/review/CodeEditor";
import { FileUploader } from "@/components/review/FileUploader";
import { FindingsList } from "@/components/review/FindingsList";
import { LanguageSelector } from "@/components/review/LanguageSelector";
import { ReviewTitleInput } from "@/components/review/ReviewTitleInput";
import { SubmissionMethodToggle } from "@/components/review/SubmissionMethodToggle";
import { SubmitReviewButton } from "@/components/review/SubmitReviewButton";
import { UploadProgress } from "@/components/review/UploadProgress";
import { ValidationMessage } from "@/components/review/ValidationMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/FormField";
import { ROUTES } from "@/constants/routes";
import { reviewFormSchema, type ReviewFormValues } from "@/features/review/schemas";
import { useCreateReviewFromPaste, useCreateReviewFromUpload } from "@/features/review/hooks/use-create-review";
import type { Review, SubmissionMethod, SupportedLanguage } from "@/features/review/types";

export function ReviewForm() {
  const searchParams = useSearchParams();
  const initialMethod: SubmissionMethod = searchParams.get("method") === "upload" ? "upload" : "paste";

  const [uploadPercent, setUploadPercent] = React.useState(0);
  const [completedReview, setCompletedReview] = React.useState<Review | null>(null);

  const createFromPaste = useCreateReviewFromPaste();
  const createFromUpload = useCreateReviewFromUpload();
  const isSubmitting = createFromPaste.isPending || createFromUpload.isPending;

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      method: initialMethod,
      title: "",
      language: "",
      sourceCode: "",
      file: undefined,
    },
  });

  const method = watch("method");
  const language = watch("language");

  function onSubmit(values: ReviewFormValues) {
    setUploadPercent(0);

    if (values.method === "paste") {
      createFromPaste.mutate(
        {
          title: values.title,
          language: values.language as SupportedLanguage,
          sourceCode: values.sourceCode ?? "",
        },
        { onSuccess: (review) => setCompletedReview(review) }
      );
    } else {
      createFromUpload.mutate(
        {
          title: values.title,
          language: values.language as SupportedLanguage,
          file: values.file as File,
          onProgress: setUploadPercent,
        },
        { onSuccess: (review) => setCompletedReview(review) }
      );
    }
  }

  function handleSubmitAnother() {
    setCompletedReview(null);
    reset();
  }

  const submissionError = createFromPaste.error ?? createFromUpload.error;

  // Analysis started / in progress is reflected via the submit button and
  // upload progress bar below (isSubmitting / createFromUpload.isPending) —
  // once the request resolves, "completed" or "failed" is shown here.
  if (completedReview) {
    return (
      <div className="space-y-6">
        <AnalysisStatusBanner
          status={completedReview.analysisStatus}
          error={completedReview.analysisError}
          findingCount={completedReview.findings.length}
        />

        <AIReviewSummary
          status={completedReview.aiReviewStatus}
          summary={completedReview.aiSummary}
          error={completedReview.aiReviewError}
        />

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">{completedReview.title}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.reviewDetail(completedReview.id)}>View full details</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSubmitAnother}>
                Submit another review
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <FindingsList findings={completedReview.findings} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {submissionError && (
        <ValidationMessage variant="error" className="text-sm">
          {submissionError.message}
        </ValidationMessage>
      )}

      <Card>
        <CardContent className="space-y-5 p-6">
          <ReviewTitleInput
            error={errors.title?.message}
            disabled={isSubmitting}
            {...register("title")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <LanguageSelector value={field.value} onChange={field.onChange} error={errors.language?.message} />
              )}
            />

            <FormField id="submission-method" label="Submission method">
              <Controller
                control={control}
                name="method"
                render={({ field }) => (
                  <SubmissionMethodToggle
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // Clear the other method's field so stale data can't be submitted.
                      if (value === "paste") setValue("file", undefined);
                      else setValue("sourceCode", "");
                    }}
                  />
                )}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          {method === "paste" ? (
            <>
              <Controller
                control={control}
                name="sourceCode"
                render={({ field }) => (
                  <CodeEditor value={field.value ?? ""} onChange={field.onChange} language={language} />
                )}
              />
              {errors.sourceCode?.message && (
                <ValidationMessage variant="error">{errors.sourceCode.message}</ValidationMessage>
              )}
            </>
          ) : (
            <>
              <Controller
                control={control}
                name="file"
                render={({ field }) => (
                  <FileUploader file={field.value ?? null} onFileChange={field.onChange} error={errors.file?.message} />
                )}
              />
              {createFromUpload.isPending && (
                <UploadProgress percent={uploadPercent} fileName={watch("file")?.name ?? "file"} />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <SubmitReviewButton
          loading={isSubmitting}
          loadingLabel="Running static analysis & AI review…"
          size="lg"
        />
      </div>
    </form>
  );
}
