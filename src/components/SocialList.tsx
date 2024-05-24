"use client";
import { init, useQuery } from "@airstack/airstack-react";
import React from "react";

if (typeof window !== "undefined") {
  init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY as string);
}

const query = `{
  Socials(
    input: {filter: {profileName: {_regex_in: ["^a", "^lens/@a"]}}, blockchain: ethereum}
  ) {
    Social {
      dappName
      profileName
    }
  }
}`;

export const ProfilePage = () => {
  const { data, loading, error } = useQuery(query);

  console.log("Query:", query);
  console.log("Data:", data);
  console.log("Loading:", loading);
  console.log("Error:", error);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (data) {
    return (
      <div>
        <h2>Query Results:</h2>
        <ul>
          {data.Socials.Social.map((item: any, index: number) => (
            <li key={index}>
              <strong>Dapp Name:</strong> {item.dappName} <br />
              <strong>Profile Name:</strong> {item.profileName}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};
