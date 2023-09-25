"use-client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SpinnerComponent from "../../components/Spinner/Spinner";
import { ethers } from "ethers";
import documentabi from "../../utils/documentsideabi.json";
import { ParticleProvider } from "@particle-network/provider";
import { useSigner } from "wagmi";
import { useToast } from "@chakra-ui/react";
import { MediaRenderer } from "@thirdweb-dev/react";
import requestabi from "../../utils/requestsideabi.json";

const page = () => {
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [access, setAccess] = useState("Finding");
  const [docDetails, setDocDetails] = useState({});

  const fetchDocumentDetails = async () => {
    if (
      window.ethereum._state.accounts.length !== 0 &&
      router.query.documentId
    ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_REQUESTSIDE_ADDRESS,
        requestabi,
        signer
      );
      const accounts = await provider.listAccounts();
      const userAddress = await accounts[0];
      console.log(userAddress);
      const userProf = await contract.userAddresstoUser(userAddress);
      console.log(userProf);
      const userId = Number(await contract.userAddresstoId(userAddress));
      console.log(router.query.documentId);
      const finDocId = await router.query.documentId;
      const docWitnessListlength = Number(
        await contract.getWitnessArrayLengthbyDocId(BigInt(finDocId))
      );
      let tempId;
      let hasAccess = false;
      for (let i = 0; i < docWitnessListlength; i++) {
        tempId = Number(
          await contract.docIdtoWitnessArray(BigInt(finDocId), i)
        );
        console.log(tempId + " " + userId);
        if (tempId === userId) {
          hasAccess = true;
          break;
        }
      }
      console.log(docWitnessListlength);
      if (hasAccess) {
        console.log("user has access");
        setAccess("yes");
        const allDocDetails = await contract.docIdtoDocument(finDocId);
        console.log(allDocDetails);
        setDocDetails(allDocDetails);
      } else {
        console.log("user does not have access");
        setAccess("no");
      }
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchDocumentDetails();
  }, [router.query.documentId]);

  if (loader) {
    return <SpinnerComponent />;
  }

  if (access == "yes") {
    return <MediaRenderer src={docDetails.ipfsHash} />;
  }

  //const { id } = router.query;
  return <div>You do not have access to this document</div>;
};

export default page;
