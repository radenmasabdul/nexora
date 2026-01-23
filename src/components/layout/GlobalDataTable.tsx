import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2 } from "lucide-react";

type Column<T> = {
  key: keyof T | string
  header: string
  width?: string
  align?: "left" | "center" | "right"
  render?: (row: T, index: number) => React.ReactNode
}

type GlobalDataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  page: number
  total: number
  limit: number
  loading?: boolean;
  onPageChange: (page: number) => void
}

export default function GlobalDataTable<T>({ columns, data, page, total, limit, onPageChange, loading = false,} : GlobalDataTableProps<T>) {
  const totalPages = Math.ceil(total / limit)
  
  const getPages = () => {
    const pages: number[] = []
    const start = Math.max(1, page - 1)
    const end = Math.min(totalPages, page + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="space-y-4 py-4">
        {loading ? (
            <div className="py-10 text-center">
                <div className="inline-flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            </div>
            ) : (
            <>
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead style={{ width: "60px" }} className="truncate">
                                No
                            </TableHead>

                            {columns.map((col) => {
                                const hasRenderWithCenterAlign = col.render && !col.align;

                                return (
                                    <TableHead
                                        key={col.header}
                                        style={{ width: col.width }}
                                        className={`truncate ${
                                            col.align === "center" || hasRenderWithCenterAlign
                                            ? "text-center"
                                            : col.align === "right"
                                            ? "text-right"
                                            : "text-left"
                                        }`}
                                    >
                                        {col.header}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((row, i) => {
                            const rowNumber = (page - 1) * limit + i + 1;
                            
                            return (
                                <TableRow key={i}>
                                    <TableCell className="truncate">{rowNumber}</TableCell>

                                        {columns.map((col) => {
                                            const hasRenderWithCenterAlign =
                                                col.render && !col.align;
                                                
                                                return (
                                                    <TableCell
                                                        key={String(col.key)}
                                                        className={`${
                                                            col.align === "center" || hasRenderWithCenterAlign
                                                            ? "text-center"
                                                            : col.align === "right"
                                                            ? "text-right"
                                                            : "text-left"
                                                        } ${!col.render ? "truncate" : ""}`}
                                                    >
                                                        {col.render
                                                            ? col.render(row, i)
                                                            : String(row[col.key as keyof T])}
                                                    </TableCell>
                                                );
                                            })
                                        }
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {(page - 1) * limit + 1} -{" "}
                        {Math.min(page * limit, total)} of {total} entries
                    </p>

                    <Pagination className="w-auto mx-0">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => page > 1 && onPageChange(page - 1)}
                                    className={
                                        page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                            
                            {page > 2 && (
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => onPageChange(1)}
                                        className="cursor-pointer"
                                    >
                                        1
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            {page > 3 && (
                                <PaginationItem>
                                    <span className="px-4">...</span>
                                </PaginationItem>
                            )}

                            {getPages().map((p) => (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        isActive={page === p}
                                        onClick={() => onPageChange(p)}
                                        className="cursor-pointer"
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {page < totalPages - 2 && (
                                <PaginationItem>
                                    <span className="px-4">...</span>
                                </PaginationItem>
                            )}

                            {page < totalPages - 1 && (
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => onPageChange(totalPages)}
                                        className="cursor-pointer"
                                    >
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => page < totalPages && onPageChange(page + 1)}
                                    className={
                                        page === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </>
        )}
    </div>
  )
}