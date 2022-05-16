import { Text } from "@chakra-ui/react";
import useCreator from "../../hooks/useCreator";
import CreateProfile from "./CreateProfile";
import ProfileLinks from "./ProfileLinks";

interface ProfileProps {
  address: string;
}

const Profile = ({ address }: ProfileProps) => {
  const { creator } = useCreator(address);
  const isCreator = !!creator?.address;

  return isCreator ? <ProfileLinks address={address} /> : <CreateProfile address={address} />;
};

export default Profile;
