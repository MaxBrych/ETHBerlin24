const lensQuery = `
  query GetLensProfile($name: String!) {
    Socials(
      input: {
        filter: {
          identity: { _eq: $name },
          dappName: { _eq: "lens" }
        }
        blockchain: ethereum
      }
    ) {
      Social {
        profileName
        profileImage
        profileBio
        followerCount
        followingCount
        userAssociatedAddresses
      }
    }
  }
`;
