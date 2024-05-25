"use client";
import { useEffect, useState } from "react";
import { init, useQuery } from "@airstack/airstack-react";
import GET_FC_INFO from "@/graphql/farcaster";
import CastsList from "@/components/CastsList";
import { usePublications, PublicationType, LimitType } from "@lens-protocol/react-web";

export default function ProfilePage() {
  const [apiInitialized, setApiInitialized] = useState(false);
  const identity = "fc_fname:cjack60";

  useEffect(() => {
    if (typeof window !== "undefined") {
      init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY as string);
      setApiInitialized(true);
    }
  }, []);

  const { data, loading, error } = useQuery(
    apiInitialized ? GET_FC_INFO : "",
    apiInitialized ? { identity } : null
  );

  useEffect(() => {
    if (apiInitialized) {
      console.log("Query being sent:", GET_FC_INFO);
      console.log("Variables being sent:", { identity });
    }
  }, [apiInitialized]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching data:", error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      console.log("Resolved data:", data);
    }
  }, [data]);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-20">Error: {error.message}</div>;

  const renderProfileSection = (title, profile) => (
    <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 mt-6 w-full max-w-2xl">
      <div className="flex items-center space-x-4">
        <img
          src={profile.profileImage}
          alt={profile.profileName}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{profile.profileDisplayName}</h2>
          <p className="text-gray-400">@{profile.profileHandle}</p>
          <p className="mt-2">{profile.profileBio}</p>
          <p className="mt-1 text-sm text-gray-400">
            Followers: {profile.followerCount} | Following: {profile.followingCount}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mt-6">Profile Info</h1>
      {data?.Wallet && (
        <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 mt-6 w-full max-w-2xl text-center">
          <img
            src={data.Wallet.primaryDomain?.avatar}
            alt={data.Wallet.primaryDomain?.name}
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h2 className="text-xl font-bold mt-2">{data.Wallet.primaryDomain?.name}</h2>
          <p className="mt-2">Address: {data.Wallet.addresses[0]}</p>
          <p className="mt-1 text-sm text-gray-400">
            XMTP: {data.Wallet.xmtp[0]?.isXMTPEnabled ? "Enabled" : "Disabled"}
          </p>
        </div>
      )}
      {data?.farcasterSocials?.Social &&
        data.farcasterSocials.Social.map((profile, index) => (
          <div key={index} className="w-full max-w-2xl">
            {renderProfileSection("Farcaster Profile", profile)}
          </div>
        ))}
      {data?.lensSocials?.Social &&
        data.lensSocials.Social.map((profile, index) => (
          <div key={index} className="w-full max-w-2xl">
            {renderProfileSection("Lens Profile", profile)}
            <Publications profileId={profile.profileTokenId} />
          </div>
        ))}
      {data?.FarcasterCasts?.Cast && <CastsList casts={data.FarcasterCasts.Cast} />}
    </div>
  );
}

function Publications({ profileId }) {
  console.log("Profile ID used for publications:", profileId);
  const {
    data: publications,
    loading,
    error,
  } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      from: [profileId],
    },
    limit: LimitType.TwentyFive,
  });

  useEffect(() => {
    if (error) {
      console.error("Error loading publications:", error);
    }
    if (publications) {
      console.log("Publications data:", publications);
    }
  }, [publications, error]);

  if (loading) return <div>Loading publications...</div>;
  if (error) return <div>Error loading publications: {error.message}</div>;

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 mt-6 w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Lens Publications</h2>
      {publications?.length > 0 ? (
        publications.map((pub, index) => (
          <div key={index} className="border-b border-gray-700 py-4">
            <p>{pub.metadata.content}</p>
            {pub.metadata?.asset?.image?.optimized?.uri && (
              <img
                width="400"
                height="400"
                alt="Publication"
                className="mt-6 mb-2 rounded-xl"
                src={pub.metadata?.asset?.image?.optimized?.uri}
              />
            )}
            <div className="mt-4 flex space-x-4 text-sm text-gray-400">
              <span>Comments: {pub.stats.comments}</span>
              <span>Mirrors: {pub.stats.mirrors}</span>
              <span>Likes: {pub.stats.upvotes}</span>
              <span>Collects: {pub.stats.collects}</span>
            </div>
          </div>
        ))
      ) : (
        <p>No publications available</p>
      )}
    </div>
  );
}
