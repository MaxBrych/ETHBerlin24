"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const SearchBar = () => {
  const [name, setName] = useState("");
  const [client, setClient] = useState("lens");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/profile/${client}/${name}`);
  };

  return (
    <div className="flex justify-center mt-12">
      <form
        onSubmit={handleSubmit}
        className="flex align-center border-1 border-solid border-gray-300 rounded-24 p-2 w-600 shadow-md"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="flex-1 border-none outline-none p-2 text-lg text-black"
          required
        />
        <select
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="border-none outline-none p-2 text-lg text-gray-500"
        >
          <option value="lens">Lens</option>
          <option value="farcaster">Farcaster</option>
          <option value="ens">ENS</option>
        </select>
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white rounded-24 p-2 text-lg cursor-pointer"
        >
          Search
        </button>
      </form>
    </div>
  );
};
