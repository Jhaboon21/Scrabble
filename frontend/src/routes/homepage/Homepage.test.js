import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Homepage from "./Homepage";
import { UserProvider } from "../../testUtils";

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <UserProvider>
        <Homepage />
      </UserProvider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when logged out", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <UserProvider currentUser={null}>
        <Homepage />
      </UserProvider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("renders the homepage correctly when a user is not logged in", function () {
  const { getByText } = render(
    <MemoryRouter>
      <UserProvider currentUser={null}>
        <Homepage />
      </UserProvider>
    </MemoryRouter>

  );

  expect(getByText('Log in')).toBeInTheDocument();
  expect(getByText('Sign up')).toBeInTheDocument();
});

it("renders the homepage correctly when a user is logged in", function () {
  const { getByText, getByLabelText } = render(
    <MemoryRouter>
      <UserProvider>
        <Homepage />
      </UserProvider>
    </MemoryRouter>
  );

  expect(getByText(`Welcome Back, testuser!`)).toBeInTheDocument();
  expect(getByLabelText('Enter Invite Code')).toBeInTheDocument();
  expect(getByText('Start a Game!')).toBeInTheDocument();
  expect(getByText('Join Game')).toBeInTheDocument();
});

it("submits a join game request", async function () {
  const joinRoomMock = jest.fn();
  const navigateMock = jest.fn();
  const { getByText, getByLabelText } = render(
    <MemoryRouter>
      <UserProvider>
        <Homepage joinRoom={joinRoomMock} />
      </UserProvider>
    </MemoryRouter>
  );

  fireEvent.change(getByLabelText('Enter Invite Code'), { target: { value: '12345678' } });
  fireEvent.click(getByText('Join Game'));

  await waitFor(() => {
    expect(joinRoomMock).toHaveBeenCalledWith('12345678', 'testuser');
  });
});