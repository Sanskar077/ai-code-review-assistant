import { GuestOnly } from "@/features/auth/components/GuestOnly";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GuestOnly>{children}</GuestOnly>;
}
