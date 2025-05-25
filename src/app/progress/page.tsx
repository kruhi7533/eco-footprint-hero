import { Progress } from "@/components/Progress";
import { AuthDebug } from "@/components/AuthDebug";

export default function ProgressPage() {
  return (
    <div className="container py-6">
      <Progress />
      {process.env.NODE_ENV === 'development' && <AuthDebug />}
    </div>
  );
} 