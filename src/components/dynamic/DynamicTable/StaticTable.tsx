"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { ConfigProvider, Table } from "antd";
import { buildColumns } from "./utils/buildColumns";
import TableSkeleton from "./components/TableSkeleton";
import EmptyState from "./components/EmptyState";
import ScrollbarHeightControl, { getScrollbarHeight } from "./components/ScrollbarHeightControl";
import { ErrorApi } from '../../ui/ErrorApi';
import { TABLE_THEME, PAGE_SIZE_OPTIONS, INITIAL_TABLE_PAYLOAD } from "./utils/constants";
import type { StaticTableProps, TableCellType, TablePayloadType } from "./types";
import classNames from "classnames";
import { isArray, isNotEmptyArray, isNotEmpty, isString, isNumber, isObject, isUndefined } from '../../../utils/main.utils';
import { useGridFilters } from '../../../hooks/useGridFilters';

export default function StaticTable({
  staticData,
  refreshTrigger: _refreshTrigger,
  onActionClick,
  className,
  filterKey,
  loading = false,
  error,
  onRetry,
  bordered = true,
  pagination = true,
  ...tableProps
}: StaticTableProps) {
  // ─── Pagination, sort, search state ───────────────────────────────────────
  const [params, setParams] = useState<TablePayloadType>({ ...INITIAL_TABLE_PAYLOAD });

  // Use filterKey if provided, else use local state
  const [filters, setFilters] = useGridFilters(filterKey || "local-static-table");

  // ─── Search debounce ──────────────────────────────────────────────────────
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFiltersStr = JSON.stringify(
    filters?.isFilterActive !== false && filters?.columnFilters
      ? Object.fromEntries(
        Object.entries(filters.columnFilters).filter(
          ([_, f]: any) => f?.value !== undefined && f?.value !== ""
        )
      )
      : {}
  );

  // ─── Reset page on filter or search change ────────────────────────────────
  const prevFiltersRef = useRef(activeFiltersStr);
  const prevSearchRef = useRef(filters?.tableSearch);

  useEffect(() => {
    if (prevFiltersRef.current !== activeFiltersStr || prevSearchRef.current !== filters?.tableSearch) {
      prevFiltersRef.current = activeFiltersStr;
      prevSearchRef.current = filters?.tableSearch;
      setParams((prev) => ({ ...prev, page: 1 }));
    }
  }, [activeFiltersStr, filters?.tableSearch]);

  // Sync features and columns to global filters just like dynamic table
  useEffect(() => {
    if (staticData) {
      setFilters({
        features: staticData.features,
        extraData: staticData.extraData,
        tableCount: staticData.totalRows,
        columns: staticData.columns,
        tableLoading: loading
      });
    }
  }, [staticData, loading, setFilters]);

  // ─── Memoized columns ────────────────────────────────────────────────────
  const columns = useMemo(() => {
    const rawColumns = staticData?.columns || [];
    let processed = buildColumns(rawColumns, onActionClick, filters?.columnFilters);

    if (isNotEmptyArray(filters?.hiddenColumns)) {
      processed = processed.filter(c => !filters.hiddenColumns.includes(String(c.key) || String(c.dataIndex)));
    }

    // Apply column order if available
    if (isArray(filters?.columnOrder)) {
      const orderMap = new Map(filters.columnOrder.map((id: any, index: number) => [id, index]));
      processed = [...processed].sort((a, b) => {
        const idA = String(a.key || a.dataIndex);
        const idB = String(b.key || b.dataIndex);
        const indexA = orderMap.has(idA) ? orderMap.get(idA) : 9999;
        const indexB = orderMap.has(idB) ? orderMap.get(idB) : 9999;
        return (indexA as number) - (indexB as number);
      });
    }

    return processed;
  }, [staticData?.columns, filters?.hiddenColumns, filters?.columnOrder, filters?.columnFilters, onActionClick]);

  // ─── Local Filtering, Sorting and Pagination ────────────────────────────────
  const processedRows = useMemo(() => {
    let rawRows = staticData?.rows ?? [];

    // 1. Search (optimized zero-allocation loop across cell values)
    const searchTerm = filters?.tableSearch?.toLowerCase();
    if (searchTerm) {
      rawRows = rawRows.filter((row: any) => {
        for (const key in row) {
          if (key === "_rowKey") continue;
          const cells = row[key];
          if (isArray(cells)) {
            for (let i = 0; i < cells.length; i++) {
              const cell = cells[i];
              if (cell && (cell.type === "TEXT" || cell.type === "LINK" || cell.type === "STATUS")) {
                if (cell.title && cell.title.toLowerCase().includes(searchTerm)) {
                  return true;
                }
              }
            }
          } else if (isObject(cells) && (cells as any).title) {
            if (String((cells as any).title).toLowerCase().includes(searchTerm)) {
              return true;
            }
          } else if (isString(cells) || isNumber(cells)) {
            if (String(cells).toLowerCase().includes(searchTerm)) {
              return true;
            }
          }
        }
        return false;
      });
    }

    // 3. Sorting
    if (params.sortBy && params.order) {
      const isAsc = params.order === "asc";
      const sortKey = params.sortBy;
      rawRows = [...rawRows].sort((a, b) => {
        const cellA = a[sortKey]?.[0];
        const cellB = b[sortKey]?.[0];

        const valA = ((cellA as any)?.title || (isString(a[sortKey]) ? a[sortKey] : "")) || "";
        const valB = ((cellB as any)?.title || (isString(b[sortKey]) ? b[sortKey] : "")) || "";

        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }

    // 4. Pagination
    if (staticData?.isPaginated) {
      // If the data is already paginated by the parent, just use it
      return rawRows;
    } else {
      // Client side pagination
      const start = (params.page - 1) * params.limit;
      const end = start + params.limit;
      return rawRows.slice(start, end);
    }
  }, [staticData?.rows, staticData?.isPaginated, params.page, params.limit, params.sortBy, params.order, filters?.tableSearch]);

  // ─── Memoized rows with stable keys ───────────────────────────────────────
  const rows = useMemo(() => {
    return processedRows.map((row: Record<string, TableCellType[]>, index: number) => ({
      ...row,
      _rowKey: `row-${params.page}-${index}`,
    }));
  }, [processedRows, params.page]);

  // ─── Total count ──────────────────────────────────────────────────────────
  const total = staticData?.isPaginated ? staticData.totalRows : (filters?.tableSearch ? processedRows.length : staticData?.totalRows ?? 0);

  // ─── Table change handler (pagination + sorting + filtering) ──────────────
  const handleTableChange = useCallback(
    (
      pagination: { current?: number; pageSize?: number },
      _filters: any,
      sorter: any
    ) => {
      const singleSorter = isArray(sorter) ? sorter[0] : sorter;

      setParams((prev) => ({
        ...prev,
        page: pagination.current ?? prev.page,
        limit: pagination.pageSize ?? prev.limit,
        sortBy: singleSorter?.field?.toString() ?? "",
        order: singleSorter?.order === "ascend"
          ? "asc"
          : singleSorter?.order === "descend"
            ? "desc"
            : "",
      }));

      // Map Ant Design _filters to our global columnFilters state
      if (_filters) {
        const newColumnFilters = { ...(filters?.columnFilters || {}) };
        let hasChanges = false;

        Object.keys(_filters).forEach((key) => {
          const val = _filters[key];

          if (isNotEmptyArray(val)) {
            try {
              const columnConfig = staticData?.columns?.find((c: any) => c.id === key);
              const isSelect = columnConfig?.type === "SELECT" || isNotEmptyArray(columnConfig?.options);
              const defaultOperator = isSelect ? "equal" : "contains";
              const parsed = JSON.parse(String(val[0]));
              if (isNotEmpty(parsed.value)) {
                newColumnFilters[key] = {
                  operator: parsed.operator || defaultOperator,
                  value: parsed.value,
                };
                hasChanges = true;
              } else if (newColumnFilters[key]) {
                delete newColumnFilters[key];
                hasChanges = true;
              }
            } catch (e) {
              console.error("Failed to parse column filter", e);
            }
          } else if (newColumnFilters[key]) {
            delete newColumnFilters[key];
            hasChanges = true;
          }
        });

        if (hasChanges) {
          setFilters({ columnFilters: newColumnFilters });
        }
      }
    },
    [filters?.columnFilters, staticData?.columns, setFilters]
  );

  // ─── Cleanup debounce timer ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  // ─── Dynamic scroll height via ResizeObserver (throttled via RAF) ─────────
  const [scrollY, setScrollY] = useState<number>(400);
  const observerRef = useRef<ResizeObserver | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const resizeRafRef = useRef<number | null>(null);
  const scrollbarRafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (resizeRafRef.current) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
      if (scrollbarRafRef.current) {
        cancelAnimationFrame(scrollbarRafRef.current);
        scrollbarRafRef.current = null;
      }
    };
  }, []);

  const tableWrapperRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (resizeRafRef.current) {
      cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = null;
    }

    tableRef.current = node;

    if (node) {
      observerRef.current = new ResizeObserver((entries) => {
        if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = requestAnimationFrame(() => {
          const height = entries[0]?.contentRect?.height ?? 400;
          const available = Math.max(height - 115, 150);
          setScrollY(available);
        });
      });
      observerRef.current.observe(node);
    }
  }, []);

  // ─── Virtual scrollbar: always visible + configurable height ──────────────
  const [scrollbarHeight, setScrollbarHeight] = useState(8);
  const [showScrollbarControl, setShowScrollbarControl] = useState(false);

  useEffect(() => {
    const stored = getScrollbarHeight();
    if (stored !== 8) {
      setScrollbarHeight(stored);
    }
  }, []);

  const applyScrollbarStyles = useCallback(() => {
    if (!tableRef.current || rows.length === 0) return;
    if (scrollbarRafRef.current) cancelAnimationFrame(scrollbarRafRef.current);

    scrollbarRafRef.current = requestAnimationFrame(() => {
      if (!tableRef.current) return;
      const scrollDiv = tableRef.current.querySelector<HTMLElement>('.ant-table-tbody-virtual-holder-inner');
      const xScrollThumb = tableRef.current.querySelector<HTMLElement>(
        '.ant-table-tbody-virtual-scrollbar-horizontal .ant-table-tbody-virtual-scrollbar-thumb'
      );

      if (xScrollThumb && scrollDiv) {
        const hasOverflow = (scrollDiv.scrollWidth - scrollDiv.clientWidth) >= 5;
        xScrollThumb.style.display = hasOverflow ? 'block' : 'none';
        setShowScrollbarControl(hasOverflow);
      }

      const hScrollBar = tableRef.current.querySelector<HTMLElement>(
        '.ant-table-tbody-virtual-scrollbar-horizontal'
      );
      if (hScrollBar) {
        hScrollBar.style.setProperty('height', `${scrollbarHeight}px`, 'important');
        hScrollBar.style.setProperty('visibility', 'visible', 'important');
        hScrollBar.style.setProperty('opacity', '1', 'important');
      }
    });
  }, [rows.length, scrollbarHeight]);

  useEffect(() => {
    applyScrollbarStyles();
  }, [rows.length, columns.length, loading, scrollbarHeight, applyScrollbarStyles]);

  const handleScrollbarHeightChange = useCallback((height: number) => {
    setScrollbarHeight(height);
  }, []);

  const xScroll = useMemo(() => {
    if (isNumber(tableProps.scroll?.x)) {
      return tableProps.scroll.x;
    }
    const calculatedWidth = columns.reduce((acc, col) => acc + (Number(col.width) || 150), 0);
    return Math.max(calculatedWidth, 800);
  }, [columns, tableProps.scroll?.x]);

  // Virtual scrolling mode: enabled by default for authentic layout & custom scrollbar DOM structure,
  // disabled in headless jsdom test runners to allow full DOM assertions.
  const isVirtual = tableProps.virtual !== undefined
    ? tableProps.virtual
    : (typeof window !== "undefined" && !window.navigator?.userAgent?.includes("jsdom"));

  // ─── Initial loading state (no data yet) ──────────────────────────────────
  if (loading && rows.length === 0) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <TableSkeleton rows={params.limit} columns={columns.length || 4} />
      </div>
    );
  }

  if (error && !isNotEmptyArray(staticData?.columns)) {
    return (
      <div className="py-12 w-full flex justify-center">
        <ErrorApi message={error} onRetry={onRetry} />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className={classNames("h-full w-full min-h-2 flex flex-col dynamic-table-container", className)}
      ref={tableWrapperRef}
      style={{ "--table-scroll-y": `${scrollY}px` } as React.CSSProperties}
    >
      <ConfigProvider
        theme={{ components: { Table: TABLE_THEME } }}
      >
        <Table<any>
          {...tableProps}
          virtual={isVirtual}
          bordered={bordered}
          columns={columns}
          dataSource={rows}
          rowKey="_rowKey"
          loading={loading}
          onChange={handleTableChange}
          scroll={{
            y: scrollY,
            ...tableProps.scroll,
            x: isNumber(tableProps.scroll?.x) ? tableProps.scroll.x : xScroll,
          }}
          size="small"
          pagination={
            pagination === false
              ? false
              : total > 0
              ? {
                current: params.page,
                pageSize: params.limit,
                total,
                showSizeChanger: true,
                pageSizeOptions: PAGE_SIZE_OPTIONS as unknown as string[],
                className: "px-6 py-2 border-t border-border !m-0",
                showTotal: (totalCount, range) => (
                  <div className="flex items-center gap-2">
                    {showScrollbarControl && (
                      <ScrollbarHeightControl onApply={handleScrollbarHeightChange} currentHeight={scrollbarHeight} />
                    )}
                    <span className="text-text-secondary font-medium text-xs">
                      Showing {range[0]} to {range[1]} of {totalCount} entries
                    </span>
                  </div>
                ),
              }
              : false
          }
          footer={
            pagination === false && total > 0
              ? () => (
                <div className="flex items-center gap-2 bg-background !m-0 px-6 py-2">
                  {showScrollbarControl && (
                    <ScrollbarHeightControl onApply={handleScrollbarHeightChange} currentHeight={scrollbarHeight} />
                  )}
                  <span className="text-text-secondary font-medium text-xs">
                    Showing {total} entries
                  </span>
                </div>
              )
              : undefined
          }
          locale={{ emptyText: <EmptyState msg="No Data Found" /> }}
        />
      </ConfigProvider>
    </div >
  );
}
