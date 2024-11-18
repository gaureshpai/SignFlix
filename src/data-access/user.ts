

import db from "@/db";
import { AdminTypes, selectAdminSchema } from "@/db/schema/admin";
import { AppointmentType, selectAppointmentSchema } from "@/db/schema/appointment";
import { EncounterTypes, selectEncounterSchema } from "@/db/schema/encounter";
import { PatientTypes, selectPatientSchema } from "@/db/schema/patient";
import { ProviderTypes, selectProviderSchema } from "@/db/schema/provider";

import UserTable, {  insertUserSchema,  selectUserSchema,  UserTypes } from "@/db/schema/user";
import {  UserRoles } from "@/lib/validations/user";
import {  SelectAdmin, SelectAppointment, SelectEncounter, SelectPatient, SelectProvider, SelectUser } from "@/types";
import { InvalidDataError } from "@/use-cases/errors";
import { UserId } from "@/use-cases/types";
import { eq, ilike, or , count} from "drizzle-orm";
import { cache } from "react";




export type SingleUser =  UserTypes & {
  patient: SelectPatient & {
    appointments?: (SelectAppointment & {
      encounter?: SelectEncounter[];
    })[];
  };
}

export type SingleProvider =  UserTypes & {
  provider: SelectProvider & {
    appointments: (SelectAppointment & {
      encounter: SelectEncounter[];
    })[];
  };
}

export type UserWithRelations = UserTypes & {
  patient: SelectPatient & {
    appointments?: (SelectAppointment & {
      encounter?: SelectEncounter[];
    })[];
  };
  provider: SelectProvider & {
    appointments?: (SelectAppointment & {
      encounter?: SelectEncounter[];
    })[];
  };
  admin: AdminTypes;
 };


 
 export interface UserWithRelationsResult {
  users: UserWithRelations[];
  newOffset: number | null;
  totalUsers: number;
}



type UserData = UserTypes & {
  patient?: PatientTypes & {
    appointments?: (AppointmentType & {
      encounter?: EncounterTypes[];
    })[];
  };  
 };

export type userUpdateType =  Pick<UserTypes,  "email">


export type FormData = {
    role: UserRoles;
  };

  type SanitizedinsertUserSchema = Pick<UserTypes, "email"| "name"| "date_of_birth"| "gender">

export async function createUser(data: SanitizedinsertUserSchema, trx = db) {
    // Parse the input data against the schema
    const parsedData = insertUserSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertUserDataType
  const newUser = await trx.insert(UserTable).values(parsedData.data).returning();

  return newUser;
  
}



export async function updateUser(userId: UserId, data: userUpdateType) {
    // Parse the input data against the schema
    const parsedData = insertUserSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertUserDataType
    await db.update(UserTable).set(parsedData.data).where(eq(UserTable.id, userId)).returning();
}

export async function deleteUser(userId: UserId) {
    await db.delete(UserTable).where(eq(UserTable.id, userId));
}



// change user role
export async function updateUserRoleFn(userId: UserId, role: UserRoles) {
   
    const updatedUser = await db.update(UserTable).set({ role}).where(eq(UserTable.id, userId)).returning();
   
    return updatedUser[0]
    
}   

//update user name
export async function updateUserNameFn(userId: UserId, name: string) {
    await db.update(UserTable).set({ name}).where(eq(UserTable.id, userId)).returning();

    
}

// get patient by email. look up the user by email then get the patient
export async function getPatientIdByEmail(email: string) {
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email),
        with: {
            patient: true
        }
    })
    return user?.patient
}



function isEncounter(encounter: unknown): encounter is NonNullable<EncounterTypes> {
  return selectEncounterSchema.safeParse(encounter).success;
}

function isAppointment(appointment: unknown): appointment is NonNullable<AppointmentType> {
  return selectAppointmentSchema.safeParse(appointment).success;
}

function isPatient(patient: unknown): patient is NonNullable<PatientTypes> {
  return selectPatientSchema.safeParse(patient).success;
}

function isProvider(provider: unknown): provider is NonNullable<ProviderTypes> {
  return selectProviderSchema.safeParse(provider).success;
}

function isAdmin(admin: unknown): admin is NonNullable<AdminTypes> {
  return selectAdminSchema.safeParse(admin).success;
}

function isUser(user: unknown): user is NonNullable<UserTypes> {
  return selectUserSchema.safeParse(user).success;
}

// get user by email
export async function getUserByEmail(email: string) {
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email),
    })
    return user
}


  export const searchUser =  cache(async (query: string): Promise<SingleUser>=> {
    try {
      // Validate input
      if (typeof query !== 'string' || query.trim().length === 0) {
        throw new Error('Invalid search query');
      }

      const user = await db.query.UserTable.findFirst({
        where: or(
          ilike(UserTable.name, `%${query}%`),
          ilike(UserTable.email, `%${query}%`),
          eq(UserTable.id, query),
        ),
        orderBy: (UserTable, { asc }) => [asc(UserTable.created_at)],
        with: {
          patient: {
            with: {
              appointments: {
                orderBy: (AppointmentTable, { asc }) => [
                  asc(AppointmentTable.scheduled_date),
                ],
                with: {
                  encounter: {
                    orderBy: (EncounterTable, { asc }) => [asc(EncounterTable.date)],
                    with: {
                      medications: true,
                      vitalSigns: true,
                      diagnoses: true,
                      allergies: true,
                      procedures: true,
                      labs: true,
                      immunizations: true,
                      insurance: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }
     

    return user;

    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  })



export const getUsers = cache(async (): Promise<UserWithRelationsResult> => {
  try {
    const users = await db.query.UserTable.findMany({
      orderBy: (users, { asc }) => [asc(users.created_at)],
      with: {
        patient: {
          with: {
            appointments: {
              orderBy: (appointments, { asc }) => [asc(appointments.scheduled_date)],
              with: {
                encounter: {
                  orderBy: (encounters, { asc }) => [asc(encounters.date)],
                  with: {
                    medications: true,
                    vitalSigns: true,
                    diagnoses: true,
                    allergies: true,
                    procedures: true,
                    labs: true,
                    immunizations: true,
                    insurance: true,
                  },
                },
              },
            },
          },
        },
        provider: {
          with: {
            appointments: {
              orderBy: (appointments, { asc }) => [asc(appointments.scheduled_date)],
              with: {
                encounter: {
                  orderBy: (encounters, { asc }) => [asc(encounters.date)],
                  with: {
                    medications: true,
                    vitalSigns: true,
                    diagnoses: true,
                    allergies: true,
                    procedures: true,
                    labs: true,
                    immunizations: true,
                    insurance: true,
                  },
                },
              },
            },
          },
        },
        admin: true,
      },
      limit: 10,
      offset: 0,
    });

    // Get total count of users
    const totalUsersResult = await db.select({ count: count() }).from(UserTable);
    const totalUsers = Array.isArray(totalUsersResult) ? totalUsersResult[0]?.count || 0 : 0;
    const newOffset = users.length >= 10 ? 10 : null;

    // Map users, filtering in a single pass
  /*   const result = users
      .map(user => ({
        ...user,
        patient: user.patient && isPatient(user.patient) ? user.patient : ({} as SelectPatient),
        provider: user.provider && isProvider(user.provider) ? user.provider : ({} as SelectProvider),
        admin: user.admin && isAdmin(user.admin) ? user.admin : ({} as SelectAdmin),
      }))
      .filter(user => 
        (user.patient?.appointments?.every(isAppointment) && 
          user.patient?.appointments?.every(app => app.encounter?.every(isEncounter))) &&
        (user.provider?.appointments?.every(isAppointment) &&
          user.provider?.appointments?.every(app => app.encounter?.every(isEncounter)))
      ); */

    users
      .map(user => ({
        ...user,
        patient: user.patient ,
        provider: user.provider ,
        admin: user.admin ,
      }))
      .filter(user => 
        user.patient?.appointments && 
        user.provider?.appointments
      );

    return { users, newOffset, totalUsers };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});



// Get Searched User

export const getUserById = async (userId: string): Promise<UserData> => {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
    with: {
      patient: {
        with: {
          appointments: {
            with: {
              encounter: {
                with: {
                  vitalSigns: true,
                  insurance: true,
                  diagnoses: true,
                  procedures: true,
                  medications: true,
                  allergies: true,
                  labs: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error(`User not found with ID ${userId}`);
  }

  return user;
};