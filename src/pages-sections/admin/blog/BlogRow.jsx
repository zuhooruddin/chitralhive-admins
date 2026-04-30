import { Edit } from "@mui/icons-material";
import { Avatar, Box } from "@mui/material";
import { Paragraph, Small } from "components/Typography";
import { useRouter } from "next/router";
import React from "react";
import {
  CategoryWrapper,
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
  StatusWrapper,
} from "../StyledComponents";

const STATUS_LABELS = {
  1: "Draft",
  2: "Published",
  3: "Archived",
};

const BlogRow = ({ blog, pageIndex, rowsPerPageRouter, getCurrentScrollPosition }) => {
  const router = useRouter();

  const handleEdit = () => {
    const currentScrollPosition = getCurrentScrollPosition();
    router.push({
      pathname: `/admin/blog/${blog.id}`,
      query: {
        pageIndexRouter: pageIndex,
        scrollPosition: currentScrollPosition,
        rowsPerPageRouter,
      },
    });
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={blog.featured_image_url || ""}
            variant="rounded"
            sx={{ width: 56, height: 56 }}
          />

          <Box>
            <Paragraph>{blog.title}</Paragraph>
            <Small color="grey.600">{blog.slug}</Small>
          </Box>
        </Box>
      </StyledTableCell>

      <StyledTableCell align="left">
        <CategoryWrapper>{blog.category || "General"}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align="left">
        <StatusWrapper status={STATUS_LABELS[blog.status] || "Pending"}>
          {STATUS_LABELS[blog.status] || "Unknown"}
        </StatusWrapper>
      </StyledTableCell>

      <StyledTableCell align="left">
        {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : "Not scheduled"}
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton onClick={handleEdit}>
          <Edit />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default BlogRow;
