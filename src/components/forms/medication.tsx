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
import { createMedicationAction } from "@/actions/medication";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { CalendarIcon, Send, Terminal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { EncounterProps } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { insertMedicationSchema } from "@/db/schema/medication";




export function MedicationForm  ({ onSuccess, encounterId }: EncounterProps)  {

    
  const { isPending, execute,  error } = useServerAction(createMedicationAction, {
    onSuccess() {
        toast.success("Medication has been created.");    
        onSuccess();  
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Medication was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof insertMedicationSchema>>({
    resolver: zodResolver(insertMedicationSchema),
          defaultValues: {
     medication_name: "", code: "", dosage: "", frequency: "", route: "oral", status: "completed", start_date: new Date(), end_date: new Date(), note: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof insertMedicationSchema>> = (
    values
  ) => {
    execute({
              
        medication_name: values.medication_name, code: values.code, dosage: values.dosage, frequency: values.frequency, route: values.route, status: values.status, note: values.note, start_date: values.start_date, end_date: values.end_date, encounter_id: encounterId
    });
  };


       form.reset({
   medication_name: "", code: "", dosage: "", frequency: "", route: "oral", status: "completed", start_date: new Date(), end_date: new Date(), note: "",
    },
)

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      

<FormField
control={form.control}
name="medication_name"
render={({ field }) => (
  <FormItem>
    <FormLabel>Brand Name</FormLabel>
    <FormControl>
      <Input placeholder="Band name of medication" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="frequency"
render={({ field }) => (
  <FormItem>
    <FormLabel>Frequency</FormLabel>
    <FormControl>
      <Input placeholder="Frequency" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>



<FormField
control={form.control}
name="status"
render={({ field }) => (
  <FormItem>
    <FormLabel>Status</FormLabel>
    <FormControl>
    <Select>
              <SelectTrigger asChild>                     
                <SelectValue placeholder='Status' {...field}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active </SelectItem>
                <SelectItem value="inactive"> Inactive</SelectItem>
                <SelectItem value="complete">Complete</SelectItem> 
                <SelectItem value="suspended">Suspended</SelectItem>                    
              </SelectContent>
            </Select>
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="route"
render={({ field }) => (
  <FormItem>
    <FormLabel>Route</FormLabel>
    <FormControl>
    <Select>
              <SelectTrigger asChild>                     
                <SelectValue placeholder='Route' {...field}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Oral </SelectItem>
                <SelectItem value="inactive"> IV</SelectItem>                
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
    <Textarea rows={7} {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
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
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
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
name="dosage"
render={({ field }) => (
  <FormItem>
    <FormLabel>Dosage</FormLabel>
    <FormControl>
      <Input  {...field} />
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
  <Send /> Order Medication
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
