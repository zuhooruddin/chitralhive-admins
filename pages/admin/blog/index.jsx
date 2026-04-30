import { Box, Button, Card, MenuItem, Table, TableBody, TableContainer, TablePagination, TableRow, TableCell, TextField } from "@mui/material";
import TableHeader from "components/data-table/TableHeader";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { BlogRow } from "pages-sections/admin";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { server_ip } from "utils/backend_server_ip.jsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const tableHeading = [
  { id: "title", label: "Title", align: "left" },
  { id: "category", label: "Category", align: "left" },
  { id: "status", label: "Status", align: "left" },
  { id: "published_at", label: "Published", align: "left" },
  { id: "action", label: "Action", align: "center" },
];

BlogList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

export default function BlogList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogList, setBlogList] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [useSwrFlag, setUseSwrFlag] = useState(true);
  const [useScrollFlag, setUseScrollFlag] = useState(false);

  const { pageIndexRouter, scrollPosition, rowsPerPageRouter } = router.query;

  useEffect(() => {
    if (pageIndexRouter) {
      setRowsPerPage(parseInt(rowsPerPageRouter, 10));
      setPageIndex(parseInt(pageIndexRouter, 10));
      setUseScrollFlag(true);
      setUseSwrFlag(true);
    }
  }, [pageIndexRouter, rowsPerPageRouter, scrollPosition]);

  const fetcher = async (url) =>
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + session.accessToken,
        },
      })
      .then((res) => res.data);

  const query = `${server_ip}getAllPaginatedBlogs?page=${pageIndex + 1}&page_size=${rowsPerPage}${search ? `&search=${encodeURIComponent(search)}` : ""}${statusFilter ? `&status=${statusFilter}` : ""}`;
  const { data } = useSWR(useSwrFlag && session?.accessToken ? query : null, fetcher);

  if (useSwrFlag && data && data !== blogList) {
    setBlogList(data);
    setUseSwrFlag(false);

    if (scrollPosition && useScrollFlag) {
      setTimeout(() => window.scrollTo(0, parseInt(scrollPosition, 10)), 0);
      setUseScrollFlag(false);
    }
  }

  const {
    order,
    orderBy,
    selected,
    filteredList,
    handleRequestSort,
  } = useMuiTable({
    listData: blogList ? blogList.results : [],
    rowsPerPage,
  });

  const getCurrentScrollPosition = () => window.pageYOffset;

  if (status === "loading") {
    return <Box py={4}>Loading...</Box>;
  }

  return (
    <Box py={4}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignItems: { md: "center", xs: "stretch" },
          flexDirection: { md: "row", xs: "column" },
          mb: 2,
        }}
      >
        <H3 mb={0}>Blog Posts</H3>
        <Button variant="contained" color="info" onClick={() => router.push("/admin/blog/create")}>
          Add Blog Post
        </Button>
      </Box>

      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { md: "2fr 1fr auto auto", xs: "1fr" } }}>
          <TextField
            label="Search posts"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <MenuItem value="">All statuses</MenuItem>
            <MenuItem value="1">Draft</MenuItem>
            <MenuItem value="2">Published</MenuItem>
            <MenuItem value="3">Archived</MenuItem>
          </TextField>

          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              setSearch(searchText);
              setPageIndex(0);
              setUseSwrFlag(true);
            }}
          >
            Search
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setSearch("");
              setSearchText("");
              setStatusFilter("");
              setPageIndex(0);
              setUseSwrFlag(true);
            }}
          >
            Clear
          </Button>
        </Box>
      </Card>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 900 }}>
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={blogList ? blogList.results.length : 0}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No blog posts found.</TableCell>
                  </TableRow>
                ) : (
                  filteredList.map((blog) => (
                    <BlogRow
                      key={blog.id}
                      blog={blog}
                      pageIndex={pageIndex}
                      rowsPerPageRouter={rowsPerPage}
                      getCurrentScrollPosition={getCurrentScrollPosition}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={blogList ? blogList.count : 0}
          page={pageIndex}
          onPageChange={(_, newPage) => {
            setPageIndex(newPage);
            setUseSwrFlag(true);
          }}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPageIndex(0);
            setUseSwrFlag(true);
          }}
        />
      </Card>
    </Box>
  );
}

BlogList.auth = true;
