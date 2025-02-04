import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateCredentialDialog from "./_components/CreateCredentialsDialog";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialsDialog from "./_components/DeleteCredentialsDialog";

const Credentialspage = () => {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className=" flex justify-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialDialog />
      </div>

      <div className="h-full py-6 space-y-8">
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring your data remains
            safe
          </AlertDescription>
        </Alert>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
};

export default Credentialspage;

async function UserCredentials() {
  const credentials = GetCredentialsForUser();

  if (!credentials) {
    return <div>Something went wrong</div>;
  }

  if ((await credentials).length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <ShieldOffIcon size={40} className=" stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No credentials create yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first credentials{" "}
            </p>
          </div>
          <CreateCredentialDialog triggerText="create your first credential" />
        </div>
      </Card>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {credentials.map((credential) => {
        const createAt = formatDistanceToNow(credential.createAt, {
          addSuffix: true,
        });

        return (
          <Card key={credential.id} className="w-full p-4 flex justify-between">
            <div className="felx gap-2 items-center">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                <LockKeyholeIcon size={18} className="stroke-primary" />
              </div>

              <div>
                <p className="font-bold">{credential.name}</p>
                <p className="text-sm text-muted-foreground">{createAt}</p>
              </div>
            </div>
            <DeleteCredentialsDialog name={credential.name} />
          </Card>
        );
      })}
    </div>
  );
}
