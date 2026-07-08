"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { CodeEditor } from "@/components/review/CodeEditor";
import { FileUploader } from "@/components/review/FileUploader";
import { LanguageSelector } from "@/components/review/LanguageSelector";
import { ReviewTitleInput } from "@/components/review/ReviewTitleInput";
import { SubmissionMethodToggle } from "@/components/review/SubmissionMethodToggle";
import { SubmitReviewButton } from "@/components/review/SubmitReviewButton";
import { UploadProgress } from "@/components/review/UploadProgress";
import { ValidationMessage } from "@/components/review/ValidationMessage";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/forms/FormField";
import { ROUTES } from "@/constants/routes";
import { reviewFormSchema, type ReviewFormValues } from "@/features/review/schemas";
import { useCreateReviewFromPaste, useCreateReviewFromUpload } from "@/features/review/hooks/use-create-review";
import type { SubmissionMethod, SupportedLanguage } from "@/features/review/types";

export function ReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMethod: SubmissionMethod = searchParams.get("method") === "upload" ? "upload" : "paste";

  const [uploadPercent, setUploadPercent] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);

  const createFromPaste = useCreateReviewFromPaste();
  const createFromUpload = useCreateReviewFromUpload();
  const isSubmitting = createFromPaste.isPending || createFromUpload.isPending;

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
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
        { onSuccess: () => handleSuccess() }
      );
    } else {
      createFromUpload.mutate(
        {
          title: values.title,
          language: values.language as SupportedLanguage,
          file: values.file as File,
          onProgress: setUploadPercent,
        },
        { onSuccess: () => handleSuccess() }
      );
    }
  }

  function handleSuccess() {
    setSubmitted(true);
    setTimeout(() => router.push(ROUTES.dashboard), 1600);
  }

  const submissionError = createFromPaste.error ?? createFromUpload.error;

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <ValidationMessage variant="success" className="text-base">
            Review submitted successfully — taking you to your dashboard…
          </ValidationMessage>
        </CardContent>
      </Card>
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
        <SubmitReviewButton loading={isSubmitting} size="lg" />
      </div>
    </form>
  );
}
