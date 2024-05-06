import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { MemoryRouter } from "react-router";

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("renders login form correctly", function () {
  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );

  expect(getByLabelText('Username')).toBeInTheDocument();
  expect(getByLabelText('Password')).toBeInTheDocument();
  expect(getByText('Submit')).toBeInTheDocument();
});

it("logs user in", async function () {
  const loginMock = jest.fn().mockResolvedValue({ success: true });
  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <LoginForm login={loginMock} />
    </MemoryRouter>
  );

  fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(loginMock).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpassword'
    });
  });
});

it("show error with invalid login data", async function () {
  global.alert = jest.fn();
  const loginMock = jest.fn().mockResolvedValue(['Username/Password was incorrect.']);
  const { getByText } = render(
    <MemoryRouter>
      <LoginForm login={loginMock} />
    </MemoryRouter>
  );

  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledTimes(1);
  });
});