import axios from "../utils/axiosCustomize";
import authHeader from "../AuthHeader/AuthHeader";
import { useEffect } from "react";

const fetchUsers = async (setUsers, setLoading) => {
  await axios
    .get("zoo-server/api/v1/user/getAllUsers", {
      headers: authHeader(),
    })
    .then((response) => {
      setUsers(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setLoading(false);
    });
};

export { fetchUsers };
