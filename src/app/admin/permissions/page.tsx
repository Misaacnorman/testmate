
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PERMISSION_GROUPS } from "@/lib/permissions";

export default function AdminPermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Permissions Matrix</h1>
        <p className="text-muted-foreground">
          A read-only view of all available permissions in the system.
        </p>
      </div>

      <div className="space-y-4">
        {PERMISSION_GROUPS.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.label}</CardTitle>
              <CardDescription>
                Permissions related to {group.label.toLowerCase()}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {group.permissions.map((permission) => (
                  <div key={permission.id} className="p-3 bg-muted/50 rounded-md">
                    <p className="font-medium text-sm">{permission.label}</p>
                    <p className="text-xs text-muted-foreground font-mono">{permission.id}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
