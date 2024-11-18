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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServerAction } from "zsa-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAllergyAction } from "@/actions/allergy";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Send, Terminal } from "lucide-react";
import { Textarea } from "../ui/textarea";

import { EncounterProps } from "@/types";
import { insertAllergySchema } from "@/db/schema/allergy";




export function AllergyForm  ({ onSuccess, encounterId }: EncounterProps)  {

    
  const { isPending, execute,  error } = useServerAction(createAllergyAction, {
    onSuccess() {
        toast.success("Allergy has been created.");    
        onSuccess();  
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Allergy was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof insertAllergySchema>>({
    resolver: zodResolver(insertAllergySchema),
          defaultValues: {
      allergen: "", severity: "mild", note: "", allergy_reaction:"",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof insertAllergySchema>> = (
    values
  ) => {
    execute({
              allergen: values.allergen,  severity: values.severity, note: values.note, allergy_reaction: values.allergy_reaction, encounter_id: encounterId
    });
  };


       form.reset({
    allergen: "", severity: "mild", note: "", allergy_reaction:"",
})

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      


<FormField
control={form.control}
name="allergen"
render={({ field }) => (
  <FormItem>
    <FormLabel>Allergen</FormLabel>
    <FormControl>
      <Input placeholder="Allergen" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="severity"
render={({ field }) => (
  <FormItem>
    <FormLabel>Severity</FormLabel>
    <FormControl>
      <Select {...field}>
        <SelectTrigger>{field.value || 'Select severity'}</SelectTrigger>
        <SelectContent>
          <SelectItem value="mild">Mild</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
          <SelectItem value="severe">Severe</SelectItem>
        </SelectContent>
      </Select>
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="note"
render={({ field }) => (
  <FormItem>
    <FormLabel>Note</FormLabel>
    <FormControl>
      <Textarea placeholder="Note" {...field} />
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
      <AlertTitle>Error creating order</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send /> Order Allergy
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
