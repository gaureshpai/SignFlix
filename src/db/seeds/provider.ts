import type { DbType } from "@/db";
import providers from "@/db/seeds/data/provider.json";
import {  ProviderTable } from "@/db/schema";


export default async function seed(db:  DbType) {
  await Promise.all(
    providers.map(async (provider) => {
      const NewProvider = {
        ...provider,
        provider_qualification: provider.provider_qualification as "MD" | "NP"
      };
      await db.insert(ProviderTable).values(NewProvider).returning();
    })
  );
}