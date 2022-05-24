import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/react";
import { useEnsLookup } from "wagmi";

interface AddressProps {
  address: string;
  link?: boolean;
}

const Address = ({ address, link = true }: AddressProps) => {
  const [{ data: ens }] = useEnsLookup({
    address,
  });

  const fromatAddress = () => address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length);

  const value = () => (!!ens ? ens : fromatAddress());

  return (
    <>
      {address && (
        <Link href={`https://etherscan.io/address/${address}`} isExternal>
          {value()} {link && <ExternalLinkIcon mx="2px" />}
        </Link>
      )}
    </>
  );
};

export default Address;
