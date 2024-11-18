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
import { createImmunizationAction } from "@/actions/immunization";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Send, Terminal,CalendarIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { EncounterProps } from "@/types";
import { insertImmunizationSchema } from "@/db/schema/immunization";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";





export function ImmunizationForm  ({ encounterId, onSuccess }: EncounterProps)  {

    
  const { isPending, execute,  error } = useServerAction(createImmunizationAction, {
    onSuccess() {
        toast.success("Immunization has been created.");   
        onSuccess();   
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Immunization was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof insertImmunizationSchema>>({
    resolver: zodResolver(insertImmunizationSchema),
          defaultValues: {
      vaccine_name: "", site: "", vaccination_date: new Date(), vaccination_time: "",vaccinator: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof insertImmunizationSchema>> = (
    values
  ) => {
    execute({
              vaccine_name: values.vaccine_name, site: values.site, vaccination_date: values.vaccination_date, vaccination_time: values.vaccination_time, vaccinator: values.vaccinator,encounter_id: encounterId
        
    });
  };


       form.reset({
   vaccine_name: "", site: "", vaccination_time: "", vaccination_date: new Date(),vaccinator: "",
  },
    
)

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      

<FormField
control={form.control}
name="vaccine_name"
render={({ field }) => (
  <FormItem>
    <FormLabel>Vaccine Name</FormLabel>
    <FormControl>
      <Input placeholder="vaccine name" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="vaccinator"
render={({ field }) => (
  <FormItem>
    <FormLabel>Vaccinator</FormLabel>
    <FormControl>
      <Input placeholder="Vaccinator" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>









<FormField
control={form.control}
name="site"
render={({ field }) => (
  <FormItem>
    <FormLabel>Site</FormLabel>
    <FormControl>
    <Textarea rows={7} {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
          control={form.control}
          name="vaccination_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        field.value, "PPP"
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? field.value : undefined}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("2024-12-31")
                    }
                    
                  />
                </PopoverContent>
              </Popover>
              
              <FormMessage />
            </FormItem>
          )}
        />
    

<FormField
control={form.control}
name="vaccination_time"
render={({ field }) => (
  <FormItem>
    <FormLabel>Vaccination Time</FormLabel>
    <FormControl>
      <Input type="time" placeholder="Vaccination Time" {...field} />
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
      <AlertTitle>Error creating immunization</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send /> Create Immunization
  </LoaderButton>

  </form>
  </Form>
  </>
);
}
