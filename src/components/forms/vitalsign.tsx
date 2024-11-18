import { SubmitHandler, useForm } from "react-hook-form";
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
import { createVitalSignAction } from "@/actions/vitalsign";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import {  Send, Terminal } from "lucide-react";
import { EncounterProps } from "@/types";
import { insertVitalSignSchema } from "@/db/schema/vitalsign";





export function VitalSignForm  ({ onSuccess, encounterId }: EncounterProps)  {

    
  const { isPending, execute,  error } = useServerAction(createVitalSignAction, {
    onSuccess() {
        toast.success("VitalSign has been recorded.");  
        onSuccess();    
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your VitalSign was not recorded. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof insertVitalSignSchema>>({
    resolver: zodResolver(insertVitalSignSchema),
          defaultValues: {
     height: "",weight: "",systolic_pressure: 0,diastolic_pressure: 0,heart_rate: 0,body_temperature: "",respiratory_rate: 0,oxygen_saturation:" 0",bmi: "0",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof insertVitalSignSchema>> = (
    values
  ) => {
    execute({
              height: values.height, weight: values.weight, systolic_pressure: values.systolic_pressure, diastolic_pressure: values.diastolic_pressure, heart_rate: values.heart_rate, body_temperature: values.body_temperature, respiratory_rate: values.respiratory_rate, oxygen_saturation: values.oxygen_saturation, bmi: values.bmi,  encounter_id: encounterId
         
    });
  };


       form.reset({
   height: "",weight: "",systolic_pressure: 0,diastolic_pressure: 0,heart_rate: 0,body_temperature:"",respiratory_rate: 0,oxygen_saturation: "",bmi: "",
    },
)

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      


<FormField
control={form.control}
name="height"
render={({ field }) => (
  <FormItem>
    <FormLabel>Height</FormLabel>
    <FormControl>
      <Input placeholder="Height" {...field} type="number" />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="weight"
render={({ field }) => (
  <FormItem>
    <FormLabel>Weight</FormLabel>
    <FormControl>
      <Input placeholder="Weight" {...field} type="number" />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="systolic_pressure"
render={({ field }) => (
  <FormItem>
    <FormLabel>Systolic Blood Pressure</FormLabel>
    <FormControl>
      <Input placeholder="Systolic Blood Pressure" {...field} type="number" />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="diastolic_pressure"
render={({ field }) => (
  <FormItem>
    <FormLabel>Diastolic Blood Pressure</FormLabel>
    <FormControl>
      <Input placeholder="Diastolic Blood Pressure" {...field} type="number" />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="heart_rate"
render={({ field }) => (
  <FormItem>
    <FormLabel>Heart Rate</FormLabel>
    <FormControl>
      <Input placeholder="Heart Rate" {...field} type="number" />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="body_temperature"
render={({ field }) => (
  <FormItem>
    <FormLabel>Body Temperature</FormLabel>
    <FormControl>
      <Input placeholder="Body Temperature" {...field} type="number" />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="respiratory_rate"
render={({ field }) => (
  <FormItem>
    <FormLabel>Respiratory Rate</FormLabel>
    <FormControl>
      <Input placeholder="Respiratory Rate" {...field} type="number" />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="oxygen_saturation"
render={({ field }) => (
  <FormItem>
    <FormLabel>Oxygen Saturation</FormLabel>
    <FormControl>
      <Input placeholder="Oxygen Saturation" {...field} type="number" />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="bmi"
render={({ field }) => (
  <FormItem>
    <FormLabel>BMI</FormLabel>
    <FormControl>
      <Input placeholder="BMI" {...field} type="number" />
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
      <AlertTitle>Error creating record</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send /> Record VitalSign
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
