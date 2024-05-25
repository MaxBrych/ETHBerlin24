"use client";
import { SearchBar } from "@/components/SearchBar";
import UNIVERSAL_RESOLVER from "../graphql/query";
import { useLazyQuery } from "@airstack/airstack-react";

export default function Home() {
  const [resolveIdentity, { data, loading }] = useLazyQuery(
    UNIVERSAL_RESOLVER,
    {},
    { cache: false }
  );

  console.log(data);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SearchBar />
    </main>
  );
}
