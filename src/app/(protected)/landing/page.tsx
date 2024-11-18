import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRound, Stethoscope, Shield, ArrowRight } from 'lucide-react';

export default function Landing() {
  const roles = [
    {
      title: "Patients",
      description: "Access your medical records, appointments, and prescriptions",
      icon: <UserRound className="h-12 w-12 mb-4 text-blue-500" />,
      link: "/patients",
      color: "bg-blue-50 hover:bg-blue-100",
    },
    {
      title: "Providers",
      description: "Manage patient care, schedules, and medical histories",
      icon: <Stethoscope className="h-12 w-12 mb-4 text-green-500" />,
      link: "/provider",
      color: "bg-green-50 hover:bg-green-100",
    },
    {
      title: "Administrators",
      description: "Oversee system operations, user management, and analytics",
      icon: <Shield className="h-12 w-12 mb-4 text-purple-500" />,
      link: "/admin",
      color: "bg-purple-50 hover:bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your MedTrack System</h1>
          <p className="text-xl text-gray-600">Streamlined healthcare management for everyone</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className={`${role.color} transition-all duration-300 transform hover:scale-105`}>
              <CardHeader>
                <div className="flex justify-center">{role.icon}</div>
                <CardTitle className="text-2xl font-bold text-center">{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-700">
                  {role.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link href={role.link} passHref>
                  <Button variant="outline" className="group">
                    Enter
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; 2024 Your MedTrack System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}