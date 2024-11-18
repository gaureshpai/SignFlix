"use client"

import { createPatientAction } from "@/actions/patient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Send, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewPatientSchema } from "@/lib/validations/patient"
import { Textarea } from "../ui/textarea"
import { PatientFormProps } from "@/types"



export default function PatientForm({ onClose }: PatientFormProps) {
  

 
  const { isPending, execute,  error } = useServerAction(createPatientAction, {
    onSuccess() {
        toast.success("Patient has been created.");  
        onClose();    
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Patient was not created. Please try again.",
          })
    },
  }) 
 

  const form = useForm<z.infer<typeof NewPatientSchema>>({
    resolver: zodResolver(NewPatientSchema),
    defaultValues: {
      full_name: "",
      email: "",
      gender: "male",
      date_of_birth: "",
      phone_number: "",
      address: "",
      height: "",
      weight: "",
      occupation: "",
      marital_status: "Married",
      emergency_contact_name: "",
      emergency_contact_relationship: "",
      emergency_contact_number: "",
      socialHistory: "",
      past_medical_history: "",
      family_medical_history: "",
      blood_type: "O positive",
      primary_care_physician: "",
      preferred_language: "English",
      notes: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof NewPatientSchema>> = (
    values
  ) => {
    execute({
      full_name: values.full_name,
      email: values.email,
      gender: values.gender,
      date_of_birth: values.date_of_birth,
      phone_number: values.phone_number,           
      address: values.address,
      height: values.height,
      weight: values.weight,
      occupation: values.occupation,
      marital_status: values.marital_status,
      emergency_contact_name: values.emergency_contact_name,
      emergency_contact_relationship: values.emergency_contact_relationship,
      emergency_contact_number: values.emergency_contact_number,
      socialHistory: values.socialHistory,
      past_medical_history: values.past_medical_history,
      family_medical_history: values.family_medical_history,
      blood_type: values.blood_type,
      primary_care_physician: values.primary_care_physician,
      preferred_language: values.preferred_language,
      notes: values.notes,
    });
  };

    form.reset({       
      full_name: "",
          email: "",
          gender: "male",
          date_of_birth: "",
        phone_number: "",   
        address: "",
        height: "",
        weight: "",
        occupation: "",
        marital_status: "Married",
        emergency_contact_name: "",
        emergency_contact_relationship: "",
        emergency_contact_number: "",
        socialHistory: "",
        past_medical_history: "",
        family_medical_history: "",
        blood_type: "O positive",
        primary_care_physician: "",
        preferred_language: "English",   
        notes: "",
      })


  return (
    <Card className="not-prose">
      <CardHeader>
        <CardTitle>Patient Form</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
      <>
        <Form {...form}>


          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
             <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger asChild>
                                            <SelectValue placeholder='Select a role' {...field}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input placeholder="Date of Birth" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input placeholder="Height" {...field} />
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
                  <Input placeholder="Weight" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input placeholder="Occupation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marital_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger asChild>
                                            <SelectValue placeholder='Marital Status' {...field}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Single">Single</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergency_contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Emergency Contact Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergency_contact_relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Relationship</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Emergency Contact Relationship"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergency_contact_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="Emergency Contact Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social History</FormLabel>
                <FormControl>
                <Textarea rows={7} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="past_medical_history"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Past Medical History</FormLabel>
                <FormControl>
                <Textarea rows={7} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="family_medical_history"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Medical History</FormLabel>
                <FormControl>
                <Textarea rows={7} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="blood_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Type</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger asChild>                     
                      <SelectValue placeholder='Blood Type' {...field}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="O positive">O positive</SelectItem>
                      <SelectItem value="O negative">O negative</SelectItem>
                      <SelectItem value="A positive">A positive</SelectItem>
                      <SelectItem value="A negative">A negative</SelectItem>
                      <SelectItem value="B positive">B positive</SelectItem>
                      <SelectItem value="B negative">B negative</SelectItem>
                      <SelectItem value="AB positive">AB positive</SelectItem>
                      <SelectItem value="AB negative">AB negative</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                </FormItem>
                    )}
                  />
          
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="patient form" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
        <FormField
control={form.control}
name="notes"
render={({ field }) => (
  <FormItem>
    <FormLabel>Notes</FormLabel>
    <FormControl>
    <Textarea rows={7} {...field} />
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
            <AlertTitle>Error creating patient</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <LoaderButton isLoading={isPending}>
        <Send /> Create Patient
        </LoaderButton>
          
                </form>
        </Form>
        </>
              </CardContent>
    </Card>
  )
  
}
