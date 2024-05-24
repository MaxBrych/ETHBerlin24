"use client";
import { useEffect, useState } from "react";
import { init, useQuery } from "@airstack/airstack-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage({ params }: { params: { client: string; name: string } }) {
  const { client, name } = params;
  const [selectedTab, setSelectedTab] = useState(client);
  const [apiInitialized, setApiInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY as string);
      setApiInitialized(true);
    }
  }, []);

  const lensQuery = `query {
    Socials(input: { filter: { identity: { _eq: "${name}" }, dappName: { _eq: "lens" } }, blockchain: "ethereum" }) {
      Social {
        profileName
        profileTokenId
        profileTokenIdHex
        userAssociatedAddresses
        profileBio
        profileDisplayName
        profileImage
        profileUrl
      }
    }
  }`;

  const farcasterQuery = `query {
    Socials(input: { filter: { identity: { _eq: "${name}" }, dappName: { _eq: "farcaster" } }, blockchain: "ethereum" }) {
      Social {
        profileName
        profileTokenId
        profileTokenIdHex
        userAssociatedAddresses
        profileBio
        profileDisplayName
        profileImage
        profileUrl
      }
    }
  }`;

  const ensQuery = `query {
    Domains(input: { filter: { owner: { _eq: "${name}" } }, blockchain: "ethereum" }) {
      Domain {
        name
      }
    }
  }`;

  const query = client === "lens" ? lensQuery : client === "farcaster" ? farcasterQuery : ensQuery;

  const { data, loading, error } = useQuery(apiInitialized ? query : "");

  useEffect(() => {
    if (client) setSelectedTab(client);
  }, [client]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching data:", error);
      console.error("Query:", query);
    }
  }, [error, query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{name}'s Profile</h1>
      <Tabs defaultValue={selectedTab} className="w-[400px]">
        <TabsList>
          <TabsTrigger value="lens">Lens</TabsTrigger>
          <TabsTrigger value="farcaster">Farcaster</TabsTrigger>
          <TabsTrigger value="ens">ENS</TabsTrigger>
        </TabsList>
        <TabsContent value="lens">
          {selectedTab === "lens" && data && (
            <div>
              <h2>Lens Profile</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </TabsContent>
        <TabsContent value="farcaster">
          {selectedTab === "farcaster" && data && (
            <div>
              <h2>Farcaster Profile</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </TabsContent>
        <TabsContent value="ens">
          {selectedTab === "ens" && data && (
            <div>
              <h2>ENS Domains</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
