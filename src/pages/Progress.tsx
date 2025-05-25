import { Progress as ProgressComponent } from "@/components/Progress";
import { AuthDebug } from "@/components/AuthDebug";

export default function Progress() {
  return (
    <div className="container py-6">
      <ProgressComponent />
      <AuthDebug />
    </div>
  );
} 