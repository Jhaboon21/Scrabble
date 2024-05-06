import React from "react";
import UserContext from "./routes/auth/UserContext";

const demoUser = {
  username: "testuser",
  first_name: "John",
  last_name: "Doe",
  email: "test@email.com",
  photo_url: null,
};

const UserProvider =
    ({ children, currentUser = demoUser }) => (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
);

export { UserProvider };