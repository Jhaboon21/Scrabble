import React from "react";
import { render } from "@testing-library/react";
import Profile from "./ProfileForm";
import { UserProvider } from "../../testUtils";

const currentUser = {
  username: 'testuser',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@email.com',
};

it("matches snapshot", function () {
  const { asFragment } = render(
    <UserProvider currentUser={currentUser}>
      <Profile />
    </UserProvider>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("renders profile form correctly", function () {
  const { getByLabelText, getByText } = render(
    <UserProvider currentUser={currentUser}>
      <Profile />
    </UserProvider>
  );

  expect(getByLabelText('First Name')).toHaveValue('John');
  expect(getByLabelText('Last Name')).toHaveValue('Doe');
  expect(getByLabelText('Email')).toHaveValue('test@email.com');
  expect(getByLabelText('Confirm password to make changes:')).toBeInTheDocument();
  expect(getByText('Save Changes')).toBeInTheDocument();
});
