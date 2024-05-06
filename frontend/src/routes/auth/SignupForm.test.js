import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "./SignupForm";
import { MemoryRouter } from "react-router";

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <SignupForm />
    </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

it("renders signup form correctly", function () {
  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <SignupForm />
    </MemoryRouter>
  );

  expect(getByLabelText('Username')).toBeInTheDocument();
  expect(getByLabelText('Password')).toBeInTheDocument();
  expect(getByLabelText('First name')).toBeInTheDocument();
  expect(getByLabelText('Last name')).toBeInTheDocument();
  expect(getByLabelText('Email')).toBeInTheDocument();
  expect(getByText('Submit')).toBeInTheDocument();
});

it("submits form with valid data", async function () {
  const signupMock = jest.fn().mockResolvedValue({ success: true });
  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <SignupForm signup={signupMock} />
    </MemoryRouter>
  );

  fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });
  fireEvent.change(getByLabelText('First name'), { target: { value: 'John' } });
  fireEvent.change(getByLabelText('Last name'), { target: { value: 'Doe' } });
  fireEvent.change(getByLabelText('Email'), { target: { value: 'test@email.com' } });
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(signupMock).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpassword',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@email.com'
    });
  });
});

it("shows error message with invalid data", async function () {
  global.alert = jest.fn();
  const signupMock = jest.fn().mockResolvedValue(['Username/Email taken.']);
  const { getByText } = render(
    <MemoryRouter>
      <SignupForm signup={signupMock} />
    </MemoryRouter>
  );

  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledTimes(1);
  });
})