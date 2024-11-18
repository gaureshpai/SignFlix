
import {  getUsers } from '@/data-access/user';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import Dashboard from './Dashboard';


export default async function DashboardWrapper() {
 
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") redirect("/login");

 
 
  const ReturnedData = await getUsers();


  const { result, newOffset} = ReturnedData;
  const totalUsers = typeof ReturnedData.totalUsers === 'number' ? ReturnedData.totalUsers : 0;


    return (   
      <Dashboard     
       users={result}      
        offset={newOffset ?? 0}
        totalUsers={totalUsers}
       
      />
    
    
  );
}