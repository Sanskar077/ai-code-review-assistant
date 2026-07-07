export function DashboardFooter() {
  return (
    <footer className="border-t border-border px-4 py-4 sm:px-6">
      <p className="text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} ReviewAI. All rights reserved.
      </p>
    </footer>
  );
}
