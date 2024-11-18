"use client";
import React, { useState } from 'react';
import { SearchInput } from '../search';
import PatientsTable from '../patientsTable';
import { DashboardProps } from '@/types';




export default function Dashboard({
  users,
  offset,
  totalUsers 
}: DashboardProps) { 

  const [searchValue, setSearchValue] = useState('');
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };


  const filteredPatients = searchValue ? users.filter(user => user.name.toLowerCase().includes(searchValue.toLowerCase())) : users;
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-12 mx-auto">Patients Dashboard</h1>
      
      <div className="w-full max-w-2xl mx-auto mb-12 flex justify-center">
  <SearchInput value={searchValue} onChange={handleSearchChange} />
</div>
      
      <div className="w-full max-w-6xl  overflow-hidden">
        <PatientsTable
           users={filteredPatients}
          offset={offset}
          totalUsers={totalUsers}
          
        />
      </div>
    </div>
  );
}