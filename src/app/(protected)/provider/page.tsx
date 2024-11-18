import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User, Clipboard, Stethoscope, Activity } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import { getProviderDataUseCase } from '@/use-cases/provider';


export default async function Provider (){

  const currentUser = await getCurrentUser();

  if (currentUser.role !== 'provider') {
    redirect('/landing');
  }
  
  const  fetchedData = await getProviderDataUseCase(currentUser.id)
 
console.log(fetchedData)

  if (!fetchedData) {
   
    notFound()
  }


  const { provider, user,  appointments, encounters} = fetchedData;


  const upcomingAppointments = appointments

  const recentEncounters = encounters

 

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Provider Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Name</p>
              <p>{user.name}</p>
            </div>
            <div>
              <p className="font-semibold">Specialty:</p>
              <p>{provider.specialty}</p>
            </div>
            <div>
              <p className="font-semibold">License Number:</p>
              <p>{provider.license_number}</p>
            </div>
            <div>
              <p className="font-semibold">Qualification:</p>
              <p>{provider.provider_qualification}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="appointments" className="mb-6">
        <TabsList>
          <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="encounters">Recent Encounters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Calendar className="mr-2" />
                      <span>{format(new Date(apt.scheduled_date), 'MMM dd, yyyy')}</span>
                    </div>
                    <Badge>{apt.type}</Badge>
                  </div>
                  <p className="flex items-center mb-1">
                    <Clock className="mr-2" />
                    {format(new Date(apt.scheduled_date), 'HH:mm')}
                  </p>
                  <p className="flex items-center mb-1">
                    <MapPin className="mr-2" />
                    {apt.location}
                  </p>
                  <p className="flex items-center">
                    <User className="mr-2" />
                    Patient ID: {apt.patient_id}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encounters">
          <Card>
            <CardHeader>
              <CardTitle>Recent Encounters</CardTitle>
            </CardHeader>
            <CardContent>
              {recentEncounters.map((encounter) => (
                <div key={encounter.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Calendar className="mr-2" />
                      <span>{format(new Date(encounter.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <Badge>{encounter.encounter_type}</Badge>
                  </div>
                  <p className="flex items-center mb-1">
                    <Clipboard className="mr-2" />
                    {encounter.chief_complaint}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <p className="flex items-center">
                      <Stethoscope className="mr-2" />
                      Diagnoses: {encounter.diagnoses.length}
                    </p>
                    <p className="flex items-center">
                      <Activity className="mr-2" />
                      Procedures: {encounter.procedures.length}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Provider Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{appointments.length}</p>
              <p className="text-sm text-gray-600">Total Appointments</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{encounters.length}</p>
              <p className="text-sm text-gray-600">Total Encounters</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">
                {encounters.reduce((sum, enc) => sum + enc.diagnoses.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Diagnoses</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">
                {encounters.reduce((sum, enc) => sum + enc.procedures.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Procedures</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


