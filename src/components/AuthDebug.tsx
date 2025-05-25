import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthDebug() {
  const { user, profile, loading } = useAuth();

  return (
    <Card className="fixed bottom-4 right-4 w-96 bg-white/90 backdrop-blur shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm">Auth Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Loading:</strong> {loading ? 'true' : 'false'}
        </div>
        <div>
          <strong>User ID:</strong> {user?.id || 'Not authenticated'}
        </div>
        <div>
          <strong>Email:</strong> {user?.email || 'N/A'}
        </div>
        <div>
          <strong>Profile ID:</strong> {profile?.id || 'No profile'}
        </div>
        <div>
          <strong>Profile Name:</strong> {profile?.name || 'N/A'}
        </div>
        <div>
          <strong>Level:</strong> {profile?.level || 0}
        </div>
      </CardContent>
    </Card>
  );
} 