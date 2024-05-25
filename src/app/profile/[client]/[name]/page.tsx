"use client";
import { useEffect, useState } from "react";
import { init, useQuery } from "@airstack/airstack-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GET_PROFILE_INFO from "@/path/to/queries";

const query = `
  query GetProfileInfo($identity: Identity!) {
    Wallet(input: { identity: $identity, blockchain: ethereum }) {
      addresses
      primaryDomain {
        name
        avatar
        tokenNft {
          contentValue {
            image {
              small
            }
          }
        }
      }
      domains(input: { filter: { isPrimary: { _eq: false } } }) {
        name
        avatar
        tokenNft {
          contentValue {
            image {
              small
            }
          }
        }
      }
      xmtp {
        isXMTPEnabled
      }
    }
    farcasterSocials: Socials(
      input: {
        filter: { identity: { _eq: $identity }, dappName: { _eq: farcaster } }
        blockchain: ethereum
        order: { followerCount: DESC }
      }
    ) {
      Social {
        isDefault
        blockchain
        dappName
        profileName
        profileDisplayName
        profileHandle
        profileImage
        profileBio
        followerCount
        followingCount
        profileTokenId
        profileTokenAddress
        profileCreatedAtBlockTimestamp
        profileImageContentValue {
          image {
            small
          }
        }
      }
    }
    lensSocials: Socials(
      input: {
        filter: { identity: { _eq: $identity }, dappName: { _eq: lens } }
        blockchain: ethereum
        order: { followerCount: DESC }
      }
    ) {
      Social {
        isDefault
        blockchain
        dappName
        profileName
        profileDisplayName
        profileHandle
        profileImage
        profileBio
        followerCount
        followingCount
        profileTokenId
        profileTokenAddress
        profileCreatedAtBlockTimestamp
        profileImageContentValue {
          image {
            small
          }
        }
      }
    }
  }
`;

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

  const variables = {
    identity: client === "lens" ? `lens/@${name}` : name,
  };

  const { data, loading, error } = useQuery(apiInitialized ? { query, variables } : null);

  useEffect(() => {
    if (client) setSelectedTab(client);
  }, [client]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching data:", error);
      console.error("Query:", query);
    }
  }, [error, query]);

  useEffect(() => {
    if (query) {
      console.log("Executing query:", query);
    }
  }, [query]);

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
          {selectedTab === "lens" && data?.lensSocials?.Social && (
            <div>
              <h2>Lens Profile</h2>
              <pre>{JSON.stringify(data.lensSocials.Social, null, 2)}</pre>
            </div>
          )}
        </TabsContent>
        <TabsContent value="farcaster">
          {selectedTab === "farcaster" && data?.farcasterSocials?.Social && (
            <div>
              <h2>Farcaster Profile</h2>
              <pre>{JSON.stringify(data.farcasterSocials.Social, null, 2)}</pre>
            </div>
          )}
        </TabsContent>
        <TabsContent value="ens">
          {selectedTab === "ens" && data?.Wallet?.domains && (
            <div>
              <h2>ENS Domains</h2>
              <pre>{JSON.stringify(data.Wallet.domains, null, 2)}</pre>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
