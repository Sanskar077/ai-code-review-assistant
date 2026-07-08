import type { AxiosProgressEvent } from "axios";

import { apiClient } from "@/services/api-client";
import type { ApiSuccess } from "@/types/auth";
import type { Review, SupportedLanguage } from "@/features/review/types";

export interface CreateReviewFromPastePayload {
  title: string;
  language: SupportedLanguage;
  sourceCode: string;
}

export interface CreateReviewFromUploadPayload {
  title: string;
  language: SupportedLanguage;
  file: File;
  onProgress?: (percent: number) => void;
}

export const reviewService = {
  async createFromPaste(payload: CreateReviewFromPastePayload): Promise<Review> {
    const { data } = await apiClient.post<ApiSuccess<{ review: Review }>>("/v1/reviews", payload);
    return data.data.review;
  },

  async createFromUpload({ onProgress, ...payload }: CreateReviewFromUploadPayload): Promise<Review> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("language", payload.language);
    formData.append("file", payload.file);

    const { data } = await apiClient.post<ApiSuccess<{ review: Review }>>(
      "/v1/reviews/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event: AxiosProgressEvent) => {
          if (!onProgress || !event.total) return;
          onProgress(Math.round((event.loaded / event.total) * 100));
        },
      }
    );
    return data.data.review;
  },
};
