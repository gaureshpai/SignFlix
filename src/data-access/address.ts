// create address

import db from "@/db";
import AddressTable, { insertAddressSchema, AddressTypes } from "@/db/schema/address";
import { InvalidDataError } from "@/use-cases/errors";



type SanitizedinsertAddressSchema = Pick<AddressTypes, "address_line_1">

export const createAddress = async (addressData: SanitizedinsertAddressSchema) => {


    const parsedData = insertAddressSchema.safeParse(addressData);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    const address = await db
        .insert(AddressTable)
        .values(parsedData.data )
        .returning();
    return address[0];
}


