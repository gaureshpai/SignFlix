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
import { createLabAction } from "@/actions/lab";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { CalendarIcon, Send, Terminal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { EncounterProps } from "@/types";
import { insertLabSchema } from "@/db/schema/labs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";




export function LabForm  ({ onSuccess, encounterId }: EncounterProps) {

    
  const { isPending, execute,  error } = useServerAction(createLabAction, {
    onSuccess() {
        toast.success("Lab has been created.");    
        onSuccess();  
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Lab was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof insertLabSchema>>({
    resolver: zodResolver(insertLabSchema),
          defaultValues: {
      test_Name: "", date_Ordered: new Date(), test_Code: "", result: "", status: "completed", result_Date: new Date(), note: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof insertLabSchema>> = (
    values
  ) => {
    execute({
              test_Name: values.test_Name, date_Ordered: values.date_Ordered, test_Code: values.test_Code, result: values.result, status: values.status, result_Date: values.result_Date,  note :values.note, encounter_id: encounterId
        
    });
  };


       form.reset({
    test_Name: "", date_Ordered: new Date(), test_Code: "", result: "", status: "completed", result_Date: new Date(),  note: "",
    },
)

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      

<FormField
control={form.control}
name="test_Name"
render={({ field }) => (
  <FormItem>
    <FormLabel>Lab Name</FormLabel>
    <FormControl>
      <Input placeholder="Lab Name" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="test_Code"
render={({ field }) => (
  <FormItem>
    <FormLabel>test_Code</FormLabel>
    <FormControl>
      <Input placeholder="Lab Code" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="result"
render={({ field }) => (
  <FormItem>
    <FormLabel>Result</FormLabel>
    <FormControl>
      <Input placeholder="Result" {...field} />
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
                <SelectItem value="pending">Pending </SelectItem>
                <SelectItem value="completed"> Completed</SelectItem>
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
          name="date_Ordered"
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
name="result_Date"
render={({ field }) => (
  <FormItem>
    <FormLabel>Result Date</FormLabel>
    <FormControl>
      <Input type="date" placeholder="Result Date" {...{...field, value: field.value.toISOString().split('T')[0]}} />
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
  <Send /> Order Lab
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
