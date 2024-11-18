import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServerAction } from "zsa-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsuranceAction } from "@/actions/insurance";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Send, Terminal } from "lucide-react";
import { insertInsuranceSchema } from "@/db/schema/insurance";





export function InsuranceForm  ()  {

    
  const { isPending, execute,  error } = useServerAction(createInsuranceAction, {
    onSuccess() {
        toast.success("Insurance has been created.");      
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Insurance was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof insertInsuranceSchema>>({
    resolver: zodResolver(insertInsuranceSchema),
          defaultValues: {
      insurance_provider: "", policy_number:"", group_number:""
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof insertInsuranceSchema>> = (
    values
  ) => {
    execute({
              insurance_provider: values.insurance_provider, policy_number: values.policy_number, group_number: values.group_number
        
    });
  };


       form.reset({
    insurance_provider:"",  policy_number:"", group_number:""
})

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      
<FormField
control={form.control}
name="insurance_provider"
render={({ field }) => (
  <FormItem>
    <FormLabel>Insurance Provider</FormLabel>
    <FormControl>
      <Input placeholder="Insurance Provider" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="policy_number"
render={({ field }) => (
  <FormItem>
    <FormLabel>Policy Number</FormLabel>
    <FormControl>
      <Input placeholder="Policy Number" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="group_number"
render={({ field }) => (
  <FormItem>
    <FormLabel>Group Number</FormLabel>
    <FormControl>
      <Input placeholder="Group Number" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>


<Button disabled={isPending} type="submit" className="w-full">
        {isPending ? "Saving..." : "Save"}
      </Button>
      {error && (
    <Alert variant="destructive">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Error adding insurance.</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send /> Add Insurance
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
