import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Database, AlertCircle, CheckCircle2, XCircle, Play } from "lucide-react";
import { migrateUsersToCustomIds, checkMigrationStatus } from "@/lib/firebase/migration";
import { useToast } from "@/hooks/use-toast";

const Migration = () => {
  const { toast } = useToast();
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<{
    needsMigration: boolean;
    oldFormatUsers: number;
    newFormatUsers: number;
  } | null>(null);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    migratedCount: number;
    errors: string[];
    mappings: { oldId: string; newId: string; role: string }[];
  } | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const status = await checkMigrationStatus();
      setMigrationStatus(status);
    } catch (error) {
      console.error('Error checking migration status:', error);
      toast({
        title: "Error",
        description: "Failed to check migration status",
        variant: "destructive",
      });
    }
  };

  const handleMigration = async () => {
    if (!confirm('This will migrate all users to the new custom ID system. This cannot be undone. Continue?')) {
      return;
    }

    setMigrating(true);
    setMigrationResult(null);

    try {
      const result = await migrateUsersToCustomIds();
      setMigrationResult(result);
      
      if (result.success) {
        toast({
          title: "Migration Complete",
          description: `Successfully migrated ${result.migratedCount} users`,
        });
      } else {
        toast({
          title: "Migration Completed with Errors",
          description: `Migrated ${result.migratedCount} users with ${result.errors.length} errors`,
          variant: "destructive",
        });
      }

      // Refresh status
      await checkStatus();
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Migration Failed",
        description: "An error occurred during migration",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">User ID Migration</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Status Card */}
        <Card className="rounded-[2rem] p-6 shadow-soft border-border/30">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-semibold">Migration Status</h2>
          </div>

          {migrationStatus && (
            <div className="space-y-3">
              {migrationStatus.needsMigration ? (
                <Alert className="border-amber-500/20 bg-amber-500/10">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertTitle className="text-amber-700">Migration Required</AlertTitle>
                  <AlertDescription className="text-amber-600">
                    Found {migrationStatus.oldFormatUsers} users using old Firebase UID format
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-green-500/20 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-700">Up to Date</AlertTitle>
                  <AlertDescription className="text-green-600">
                    All users are using the new custom ID format
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-muted/50 p-4 rounded-2xl">
                  <p className="text-sm text-muted-foreground mb-1">Old Format Users</p>
                  <p className="text-2xl font-bold">{migrationStatus.oldFormatUsers}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-2xl">
                  <p className="text-sm text-muted-foreground mb-1">New Format Users</p>
                  <p className="text-2xl font-bold text-green-600">{migrationStatus.newFormatUsers}</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Information Card */}
        <Card className="rounded-[2rem] p-6 shadow-soft border-border/30">
          <h3 className="font-semibold mb-3">What This Migration Does</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Generates custom readable IDs (CUST-0001, LAUN-0001, ADMIN-0001)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Creates mapping between Firebase UID and custom IDs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Updates all related documents (orders, disputes, messages, addresses)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Maintains all existing data and functionality</span>
            </li>
          </ul>

          {migrationStatus?.needsMigration && (
            <div className="mt-6">
              <Button
                onClick={handleMigration}
                disabled={migrating}
                className="w-full rounded-2xl"
                size="lg"
              >
                {migrating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Migrating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Migration
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Migration Result */}
        {migrationResult && (
          <Card className="rounded-[2rem] p-6 shadow-soft border-border/30">
            <div className="flex items-center gap-3 mb-4">
              {migrationResult.success ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
              <h2 className="text-lg font-semibold">Migration Results</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-2xl">
                <p className="text-sm text-muted-foreground mb-1">Users Migrated</p>
                <p className="text-2xl font-bold text-green-600">{migrationResult.migratedCount}</p>
              </div>

              {migrationResult.errors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-destructive mb-2">Errors:</h3>
                  <div className="space-y-2">
                    {migrationResult.errors.map((error, index) => (
                      <Alert key={index} className="border-destructive/20 bg-destructive/10">
                        <AlertDescription className="text-destructive text-sm">
                          {error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {migrationResult.mappings.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">ID Mappings:</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {migrationResult.mappings.map((mapping, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl text-sm">
                        <div>
                          <Badge className="mb-1">{mapping.role}</Badge>
                          <p className="text-xs text-muted-foreground font-mono truncate">
                            {mapping.oldId}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{mapping.newId}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Migration;
