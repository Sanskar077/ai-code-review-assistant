import { FormField } from "@/components/forms/FormField";
import { Select } from "@/components/ui/select";
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/features/review/types";

interface LanguageSelectorProps {
  value: SupportedLanguage | "";
  onChange: (value: SupportedLanguage) => void;
  error?: string;
}

export function LanguageSelector({ value, onChange, error }: LanguageSelectorProps) {
  return (
    <FormField id="review-language" label="Programming language" error={error} required>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as SupportedLanguage)}
        invalid={Boolean(error)}
      >
        <option value="" disabled>
          Select a language
        </option>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {LANGUAGE_LABELS[lang]}
          </option>
        ))}
      </Select>
    </FormField>
  );
}
