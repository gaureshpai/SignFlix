"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select,  SelectItem  } from "@/components/ui/select";
import { useServerAction } from "zsa-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { bookAppointmentAction } from "@/actions/appointment";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { CalendarIcon, Check, ChevronsUpDown, Send, Terminal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { getAvailableTimeSlotsUseCase } from "@/use-cases/appointment";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import {  getProvidersUseCase } from "@/use-cases/provider";
import { getAppointmentById } from "@/data-access/appointment";
import { insertAppointmentSchema } from "@/db/schema/appointment";



interface Provider {
  id: string;
  name: string | null;
}

interface Slot {
  slot: number;
  time: string;
}


interface AppointmentFormProps {
  appointmentId?: string;
  patientId: string;
  onSuccess?: () => void;
}


export function AppointmentForm  ({ appointmentId, onSuccess, patientId }: AppointmentFormProps)  {
  const [providers, setProviders] = useState<Provider[]>([]);;

  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
   

  

  const form = useForm<z.infer<typeof insertAppointmentSchema>>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: async () => {
      try {
        if (appointmentId) {
          const data = await getAppointmentById(appointmentId);
          if (!data) {
            throw new Error('No appointment data found');
          }
    
          return {
            reason: data.reason,
            provider_id: data.provider_id,
            type: data.type,
            status: data.status,
            notes: data.notes,
            scheduled_date: new Date(data.scheduled_date),
            timeSlotIndex: Number(data.timeSlotIndex),
            location: data.location,
            patient_id: patientId,
            
            
          };
        }
        return { 
          reason: "", 
          provider_id: "", 
          type: "new_patient", 
          status: "scheduled", 
          notes: "",
          scheduled_date: new Date(), 
          timeSlotIndex: availableSlots[0].slot,
          location: "",
          patient_id: patientId,
          
          

        };
      } catch (error) {
        console.error('Error fetching appointment data:', error);
        return {
          reason: "",
          provider_id: "",
          type: "new_patient",
          status: "scheduled", 
          notes: "",
          scheduled_date: new Date(),
          timeSlotIndex: availableSlots[0].slot,
          location: "",
          patient_id: patientId,
        
          };
      }
    },
  });


   
  const { isPending, execute,  error } = useServerAction(bookAppointmentAction, {   onSuccess() {
    toast.success("Appointment has been booked.");      
    if (onSuccess) {
      onSuccess();
    }
},
onError() {
    toast.error("Something went wrong.", {
        description: "Your Appointment was not booked. Please try again.",
      })
},
})

  const providerId = form.watch('provider_id');
  const date = form.watch('scheduled_date');


  useEffect(() => {
    const fetchProviders = async () => {
        try {
            const data = await getProvidersUseCase();
            // Map the data to get only the id and name
            const providersData = data.map(provider => ({
                id: provider.id,
                name: provider.name
            }));
            setProviders(providersData);
        } catch (error) {
          console.error('Error fetching providers:', error);
        }
    };
    fetchProviders();
    }, []);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (providerId && date) {
        const slots = await getAvailableTimeSlotsUseCase(providerId, date.toISOString().split('T')[0]);
        setAvailableSlots(slots);
      }
    };
    fetchAvailableSlots();
  }, [providerId, date]);
  

  const onSubmit: SubmitHandler<z.infer<typeof insertAppointmentSchema>> = (
    values
  ) => {
    const appointmentData = {
      id:"",
      reason: values.reason,
      provider_id: values.provider_id,
      type: values.type,
      status: values.status,
      notes: values.notes,
      scheduled_date: values.scheduled_date,
      timeSlotIndex: values.timeSlotIndex,
      location: values.location,
      patient_id: patientId,
    };
  
    if (appointmentId) {
      appointmentData.id = appointmentId;
    }
  
    execute(appointmentData);
  };
    form.reset({       
        reason: "", provider_id: "", type: "new_patient", status: "scheduled", notes: "",scheduled_date: new Date(), timeSlotIndex: availableSlots[0].slot, location: "", patient_id: patientId,
      })

  return (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

    <FormField
      control={form.control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input placeholder="Reason" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    
    
    <FormField
          control={form.control}
          name="provider_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? providers.find(
                            (provider) => provider.id === field.value
                          )?.name
                        : "Select provider"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search provider..." />
                    <CommandList>
                      <CommandEmpty>No provider found.</CommandEmpty>
                      <CommandGroup>
                        {providers.map((provider) => (
                          <CommandItem
                            value={provider.name ?? undefined}
                            key={provider.id}
                            onSelect={() => {
                              form.setValue("provider_id", provider.id)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                provider.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {provider.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the provider that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
    

    <FormField
      control={form.control}
      name="timeSlotIndex"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Time Slot</FormLabel>
          <FormControl>
            <Select onValueChange={(value) => {
                       setAvailableSlots(prevSlots => prevSlots.map(slot => slot.slot !== Number(value) ? { ...slot, slot: slot.slot } : slot));
                     
                    }} name={field.name}
                    defaultValue={availableSlots[0].slot.toString()} >
              {availableSlots.map((slot, ) => (
                <SelectItem key={slot.slot} value={availableSlots.indexOf(slot).toString()}>
                  {slot.time}
                </SelectItem>
              ))}
            </Select>
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
    
    <FormField
          control={form.control}
          name="scheduled_date"
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
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl>
            <Input placeholder="Location" {...field} />
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
            <AlertTitle>Error creating appointment</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <LoaderButton isLoading={isPending}>
        <Send /> Book Appointment
        </LoaderButton>

    </form>
    </Form>
    </>
  );
};
