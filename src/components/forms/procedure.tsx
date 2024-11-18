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
import { createProcedureAction } from "@/actions/procedure";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { CalendarIcon, Send, Terminal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { EncounterProps } from "@/types";
import { insertProcedureSchema } from "@/db/schema/procedure";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";




export function ProcedureForm  ({ onSuccess, encounterId }: EncounterProps)  {

    
  const { isPending, execute,  error } = useServerAction(createProcedureAction, {
    onSuccess() {
        toast.success("Procedure has been created.");     
        onSuccess(); 
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Procedure was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof insertProcedureSchema>>({
    resolver: zodResolver(insertProcedureSchema),
          defaultValues: {
      name: "", description: "", duration: "", date: new Date(), time: "", note: "", status: "completed",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof insertProcedureSchema>> = (
    values
  ) => {
    execute({
              name: values.name, description: values.description, duration: values.duration, date: values.date, time: values.time, note: values.note, status: values.status, encounter_id: encounterId
        
    });
  };


       form.reset({
    name: "", description: "", duration: "", date: new Date(), time: "", note: "", status: "completed",
    },
)

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      


<FormField
control={form.control}
name="name"
render={({ field }) => (
  <FormItem>
    <FormLabel>Name</FormLabel>
    <FormControl>
      <Input placeholder="Name" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="description"
render={({ field }) => (
  <FormItem>
    <FormLabel>Description</FormLabel>
    <FormControl>
      <Textarea placeholder="Description" {...field} />
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
      <Select {...field}>
        <SelectTrigger>
          <Input placeholder="Status"  />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="incomplete">Incomplete</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>


<FormField
          control={form.control}
          name="date"
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
name="time"
render={({ field }) => (
  <FormItem>
    <FormLabel>Time</FormLabel>
    <FormControl>
      <Input placeholder="Time" type="time" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="duration"
render={({ field }) => (
  <FormItem>
    <FormLabel>Duration</FormLabel>
    <FormControl>
      <Input placeholder="Duration" type="number" {...field} />
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
      <AlertTitle>Error creating procedure</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send />Create Procedure
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
