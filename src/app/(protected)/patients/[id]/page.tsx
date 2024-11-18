import React from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AppointmentForm } from '@/components/forms/appointment';
import AddEncounterDropdown from '../../components/AddEncounterDropDown';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { searchUser } from '@/data-access/user';
import { deleteAppointment, getProviderNameByAppointmentId } from '@/data-access/appointment';
import { notFound } from 'next/navigation';
import { SelectUser } from '@/db/schema/user';
import { SelectAppointment, SelectEncounter, SelectPatient, SelectProvider } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { EncounterForm } from '@/components/forms/enconter';

interface PatientProps { 
  user: SelectUser; 
  patient: SelectPatient; 
  encounters: SelectEncounter[];
  providers: SelectProvider; 
  appointments: SelectAppointment[];
}


const PatientDashboard = async ({ params }: { params: { id: string } }) => {
  
  
   const  fetchedData = await  searchUser(params.id)
    console.log('Fetched data:', fetchedData)
 

  if (!fetchedData) {    
    notFound()
  }  
 

  const { user: userData, patient, appointments, encounters } = fetchedData as PatientProps;
  const latestEncounter = encounters?.[0] || {};
  const upcomingAppointment = appointments?.[0];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={userData.image ?? ''} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mb-2">{userData.name}</h2>
            <p className="text-sm text-gray-500 mb-1">{userData.email}</p>
            <p className="text-sm text-gray-500 mb-1">DOB: {format(new Date(userData.date_of_birth), 'PPPP')}</p>
            <p className="text-sm text-gray-500">Phone: {patient?.phone_number}</p>
          </CardContent>
        </Card>
<div className="col-span-2 mx-auto p-6 space-y-6" role="dialog">
<Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Encounter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Encounter</DialogTitle>
            </DialogHeader>
            <EncounterForm               
              appointmentId={upcomingAppointment?.id}
              onSuccess={() => {
                // Refresh data or update UI
              }} 
            />
          </DialogContent>
        </Dialog>
</div>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointment ? (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold"> {getProviderNameByAppointmentId(upcomingAppointment.id)}</p>
                  <p className="text-sm text-gray-500">{format(new Date(upcomingAppointment.scheduled_date), 'PPP')} at {upcomingAppointment.timeSlotIndex}:00</p>
                  <p className="text-sm text-gray-500">{upcomingAppointment.reason}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => <AppointmentForm appointmentId={upcomingAppointment.id} patientId={patient.id}/>}>
                    Reschedule
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteAppointment(upcomingAppointment.id)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p>No upcoming appointments</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
        </TabsList>

        <TabsContent value="encounters">
          <div className="grid grid-cols-1 gap-6">
            {encounters?.map((encounter) => (
              <Card key={encounter.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Encounter - {format(new Date(encounter.date), 'PP')}</CardTitle>
                    <p className="text-sm text-gray-500">Provider: {encounter.chief_complaint}</p>
                  </div>
                  <AddEncounterDropdown encounterId={encounter.id} />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                {latestEncounter.diagnoses && latestEncounter.diagnoses[0] ? (
                  <div>
                    <p className="font-semibold">{latestEncounter.diagnoses[0].diagnosis_name}</p>
                    <Badge variant={latestEncounter.diagnoses[0].severity === 'severe' ? 'destructive' : 'outline'}>
                      {latestEncounter.diagnoses[0].severity}
                    </Badge>
                  </div>
                ) : (
                  <p>No current diagnosis</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Vital Signs</CardTitle>
              </CardHeader>
              <CardContent>
                {latestEncounter.vitalSigns && latestEncounter.vitalSigns[0] ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Heart Rate</p>
                      <Progress value={isNaN(Number(latestEncounter.vitalSigns[0].heart_rate)) ? 0 : Number(latestEncounter.vitalSigns[0].heart_rate)} max={120} />
                      <p className="text-sm text-gray-500">{latestEncounter.vitalSigns[0].heart_rate} bpm</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Blood Pressure</p>
                      <p className="text-sm text-gray-500">
                        {latestEncounter.vitalSigns[0].systolic_pressure}/{latestEncounter.vitalSigns[0].diastolic_pressure} mmHg
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>No recent vital signs</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full">
                <CarouselContent>
                  {latestEncounter.medications && latestEncounter.medications.map((med) => (
                    <CarouselItem key={med.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card>
                        <CardContent className="flex flex-col p-6">
                          <h3 className="text-lg font-bold mb-2">{med.medication_name}</h3>
                          <p className="text-sm">Dosage: {med.dosage}</p>
                          <p className="text-sm">Frequency: {med.frequency}</p>
                          <p className="text-sm">Start: {format(new Date(med.start_date), 'PP')}</p>
                          <p className="text-sm">End: {format(new Date(med.end_date), 'PP')}</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heart Rate</TableHead>
                    <TableHead>Blood Pressure</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Respiratory Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(encounters) && encounters.flatMap(encounter => 
                    encounter.vitalSigns.map(vital => (
                      <TableRow key={vital.id}>
                        <TableCell>{format(new Date(encounter.date), 'PP')}</TableCell>
                        <TableCell>{vital.heart_rate} bpm</TableCell>
                        <TableCell>{vital.systolic_pressure}/{vital.diastolic_pressure} mmHg</TableCell>
                        <TableCell>{vital.body_temperature}°F</TableCell>
                        <TableCell>{vital.respiratory_rate} /min</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allergies">
          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Allergen</TableHead>
                    <TableHead>Reaction</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestEncounter.allergies && latestEncounter.allergies.map((allergy) => (
                    <TableRow key={allergy.id}>
                      <TableCell>{allergy.allergen}</TableCell>
                      <TableCell>{allergy.allergy_reaction}</TableCell>
                      <TableCell>
                        <Badge variant={allergy.severity === 'severe' ? 'destructive' : 'outline'}>
                          {allergy.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Lab Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(encounters) && encounters.flatMap(encounter => 
                    encounter.labs.map(lab => (
                      <TableRow key={lab.id}>
                        <TableCell>{format(new Date(encounter.date), 'PP')}</TableCell>
                        <TableCell>{lab.test_Name}</TableCell>
                        <TableCell>{lab.result}</TableCell>
                        <TableCell>
                          <Badge variant={lab.status === 'cancelled' ? 'destructive' : 'outline'}>
                            {lab.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;