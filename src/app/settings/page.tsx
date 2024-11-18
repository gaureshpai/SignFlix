import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";



import { UserNameForm } from "@/components/forms/user-name-form";
import { UserRoleForm } from "@/components/forms/user-role-form";
import { DashboardHeader } from "@/components/dashboard/header";



export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
   
    <main className="px-3 py-10">
   <section className="mx-auto max-w-7xl space-y-6"> 
       <DashboardHeader
        heading="Settings"
        text="Manage account settings."
      /> 
      <div className="divide-y divide-muted pb-10">
        <UserNameForm  user={{ id: user.id, name: user.name || "" }} />
        <UserRoleForm user={{ id: user.id, role: user.role }} />     
      </div>
    </section>
    </main> 
    
  );
}