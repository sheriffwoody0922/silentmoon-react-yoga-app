// UserDataContext.js
import { createContext, useContext, useState } from "react";

export const UserDataContext = createContext();
import axios from "axios";

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [shouldRefetch, _refetch] = useState(true);
  const [error, setError] = useState(null);

  const refetchData = async (userId) => {
    setError(null);
    try {
      const response = await axios.post("/api/user/getUserData", userId);
      const updatedUserObject = {
        name: response.data.name,
        lastname: response.data.lastname,
        email: response.data.email,
        _id: response.data._id,
        reminderdays: response.data.reminderdays,
        remindertime: response.data.remindertime,
        playlists: response.data.playlists,
        videos: response.data.videos,
        // # ToDo: Evtl? profile picture, da auf der Detailsseite ein Profilbild angezeigt wird
      };

      setUserData(updatedUserObject);
    } catch (e) {
      console.log(e);
      setError("An Error occured, try again later");
    }
  };

  return (
    <UserDataContext.Provider value={{ userData, setUserData, refetchData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  return useContext(UserDataContext);
};
