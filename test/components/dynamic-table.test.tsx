import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "antd";
import DynamicTable from "../../src/components/dynamic/DynamicTable";
import { DynamicUIProvider } from "../../src/context/DynamicUIContext";

describe("DynamicTable Component", () => {
  const mockTableData = {
    total: 2,
    columns: [
      {
        key: "name",
        title: "Name",
        type: "TEXT",
        sorter: true,
      },
      {
        key: "profileLink",
        title: "Profile",
        type: "LINK",
      },
      {
        key: "status",
        title: "Status",
        type: "STATUS",
      },
      {
        key: "action",
        title: "Action",
        type: "ACTION",
      },
    ],
    rows: [
      {
        id: "1",
        name: "Alice Johnson",
        profileLink: {
          type: "LINK",
          title: "View Profile",
          url: "/users/1",
        },
        status: {
          type: "STATUS",
          title: "Active",
          color: "green",
        },
        action: [
          {
            type: "ACTION",
            title: "Edit",
            actionKey: "edit_user",
          },
        ],
      },
      {
        id: "2",
        name: "Bob Williams",
        profileLink: {
          type: "LINK",
          title: "Unsafe Link",
          url: "javascript:alert('xss')",
        },
        status: {
          type: "STATUS",
          title: "Pending",
          color: "orange",
        },
        action: [
          {
            type: "ACTION",
            title: "Delete",
            actionKey: "delete_user",
            danger: true,
          },
        ],
      },
    ],
  };

  it("renders table headers and row contents", () => {
    render(
      <DynamicUIProvider>
        <DynamicTable filterKey="test_users_table" apiData={mockTableData} />
      </DynamicUIProvider>
    );

    expect(screen.getAllByText("Name")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Profile")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Status")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Action")[0]).toBeInTheDocument();

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Williams")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("handles link click with onNavigate via DynamicUIContext", () => {
    const handleNavigate = vi.fn();

    render(
      <DynamicUIProvider onNavigate={handleNavigate}>
        <DynamicTable filterKey="test_link_nav" apiData={mockTableData} />
      </DynamicUIProvider>
    );

    const safeLink = screen.getByText("View Profile");
    fireEvent.click(safeLink);

    expect(handleNavigate).toHaveBeenCalledWith("/users/1", undefined);
  });

  it("blocks dangerous javascript: URL navigation", () => {
    const handleNavigate = vi.fn();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <DynamicUIProvider onNavigate={handleNavigate}>
        <DynamicTable filterKey="test_unsafe_link" apiData={mockTableData} />
      </DynamicUIProvider>
    );

    const unsafeLink = screen.getByText("Unsafe Link");
    fireEvent.click(unsafeLink);

    expect(handleNavigate).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Blocked potentially unsafe URL navigation"),
      "javascript:alert('xss')"
    );

    warnSpy.mockRestore();
  });

  it("fires onActionClick when action buttons are clicked", () => {
    const handleAction = vi.fn();

    render(
      <App>
        <DynamicUIProvider>
          <DynamicTable
            filterKey="test_action_click"
            apiData={mockTableData}
            onActionClick={handleAction}
          />
        </DynamicUIProvider>
      </App>
    );

    const actionButtons = screen.getAllByRole("button");
    const editBtn = actionButtons.find((btn) => btn.querySelector(".anticon-edit") || btn.querySelector(".anticon"));
    expect(editBtn).toBeDefined();
    fireEvent.click(editBtn!);

    expect(handleAction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionKey: "edit_user",
      })
    );
  });

  it("renders empty state when table has no data", () => {
    render(
      <DynamicUIProvider>
        <DynamicTable
          filterKey="test_empty_table"
          apiData={{ total: 0, columns: [{ key: "name", title: "Name" }], rows: [] }}
        />
      </DynamicUIProvider>
    );

    expect(screen.getByText("No Data Found")).toBeInTheDocument();
  });
});
