"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UpdateUserRoleValues, UserRoles, userRoleSchema} from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionColumns } from "@/components/dashboard/section-columns";
import  {UserTypes}  from "@/db/schema/user";
import { Icons } from "../shared/icons";
import { updateUserRole,  } from "@/actions/update-user-role";

interface UserNameFormProps {
  user: Pick<UserTypes, "id" | "role">;
}


export function UserRoleForm({ user }: UserNameFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserRoleWithId = updateUserRole.bind(null, user.id);

  const [role, setRole] = useState(user.role);

 
  const form = useForm<UpdateUserRoleValues>({
    resolver: zodResolver(userRoleSchema),
    values: {
      role: role 
    },
  });

  const onSubmit = (data: UpdateUserRoleValues) => {
    startTransition(async () => {
      const { status } = await updateUserRoleWithId(data);

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: "Your role was not updated. Please try again.",
        });
      } else {
        await update();
        setUpdated(false);
        toast.success("Your role has been updated.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SectionColumns
          title="Your Role"
          description="Select the role what you want for test the app."
        >
          <div className="flex w-full items-center gap-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel className="sr-only">Role</FormLabel>
                  <Select                   
                    onValueChange={(value: UserRoles) => {
                      setUpdated(user.role !== value);
                      setRole(value);
                                         }}
                    name={field.name}
                    defaultValue={user.role}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value={UserRoles.Enum.patient}>Patient</SelectItem>
                    <SelectItem value={UserRoles.Enum.provider}>Provider</SelectItem>
                    <SelectItem value={UserRoles.Enum.admin}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant={updated ? "default" : "disable"}
              disabled={isPending || !updated}
              className="w-[67px] shrink-0 px-0 sm:w-[130px]"
            >
              {isPending ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <p>
                  Save
                  <span className="hidden sm:inline-flex">&nbsp;Changes</span>
                </p>
              )}
            </Button>
          </div>
          
        </SectionColumns>
      </form>
    </Form>
  );
}