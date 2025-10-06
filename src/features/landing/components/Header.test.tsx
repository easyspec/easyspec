import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Header", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the EasySpec brand name", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );
    expect(screen.getByText("EasySpec")).toBeInTheDocument();
  });

  it("navigates to home when logo is clicked", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const logo = screen.getByText("EasySpec");
    await user.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renders Docs navigation button", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );
    expect(screen.getByText("Docs")).toBeInTheDocument();
  });

  it("navigates to docs when Docs button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const docsButton = screen.getByText("Docs");
    await user.click(docsButton);

    expect(mockNavigate).toHaveBeenCalledWith("/docs");
  });

  it("renders Builder navigation button", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );
    expect(screen.getByText("Builder")).toBeInTheDocument();
  });

  it("navigates to builder when Builder button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const builderButton = screen.getByText("Builder");
    await user.click(builderButton);

    expect(mockNavigate).toHaveBeenCalledWith("/builder");
  });

  it("renders mobile menu button", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );
    expect(screen.getByLabelText("Open navigation menu")).toBeInTheDocument();
  });
});
