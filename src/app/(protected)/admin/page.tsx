"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, ClipboardList, UserPlus, Users } from 'lucide-react';
import { notFound } from 'next/navigation';


import PatientForm from '@/components/forms/patient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUsersUseCase } from '@/use-cases/user';

export default async function AdminDashboard () {
  const [openDialog, setOpenDialog] = useState<string | null>(null);


  const closeDialog = () => setOpenDialog(null);

  const result = await getUsersUseCase();
  const { result: users } = result;

  if (!users) {   
    notFound()
  }

 

  const totalPatients = users.map((user) => user.patient).length;
  const totalProviders = users.filter(user => user.provider).length;
  const totalAdmins = users.filter(user => user.admin).length;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">MedTrack Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProviders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdmins}</div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openDialog === 'appointment'} onOpenChange={(open) => open ? setOpenDialog('appointment') : closeDialog()}>
          <DialogTrigger asChild>           
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Add Patient</span>
           
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <PatientForm  onClose={closeDialog} />
          </DialogContent>
        </Dialog>

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>
        <TabsContent value="patients" className="space-y-4">
          {users.filter(user => user.patient).map(user => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Avatar>
                    {/* <AvatarImage src={user.patient?.avatar} /> */}
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Upcoming Appointments</h4>
                {user.patient?.appointments?.slice(0, 3).map(appointment => (
                  <div key={appointment.id} className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.scheduled_date).toLocaleDateString()}</span>
                    <Badge>{appointment.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="providers" className="space-y-4">
          {users.filter(user => user.provider).map(user => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Avatar>
                    { <AvatarImage src={user.image} /> }
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </CardTitle>
                <CardDescription>{user.provider.specialty}</CardDescription>
                <span>{user.provider.license_number}</span>
                <span>{user.provider.provider_qualification}</span>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Upcoming Appointments</h4>
                {user.provider?.appointments?.slice(0, 3).map(appointment => (
                  <div key={appointment.id} className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.scheduled_date).toLocaleTimeString()}</span>
                    <Badge>{appointment.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="admins" className="space-y-4">
          {users.filter(user => user.admin).map(user => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Avatar>
                   {/*  <AvatarImage src={user.admin?.avatar} /> */}
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Admin Role</h4>
                {/* <Badge>{user.admin?.role}</Badge> */}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

