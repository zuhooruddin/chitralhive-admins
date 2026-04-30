import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { BlogForm } from "pages-sections/admin";
import React, { useState } from "react";
import * as yup from "yup";
import axios from "axios";
import { server_ip } from "utils/backend_server_ip.jsx";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import api from "utils/api/dashboard";

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  slug: yup.string().required("Slug is required"),
  excerpt: yup.string().required("Excerpt is required"),
  content: yup.string().required("Content is required"),
  status: yup.number().required("Status is required"),
  meta_title: yup.string().max(160, "Keep the meta title under 160 characters"),
  meta_description: yup.string().max(320, "Keep the meta description under 320 characters"),
});

EditBlog.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};

const convertToSlug = (text) =>
  text.toLowerCase().replace(/ /g, "-").replace(/[-]+/g, "-").replace(/[^\w-]+|_/g, "");

const formatDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export default function EditBlog({ blog }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [disableButtonCheck, setDisableButtonCheck] = useState(false);

  const initialValues = {
    title: blog.title || "",
    slug: blog.slug || "",
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    author_name: blog.author_name || "Chitral Hive",
    category: blog.category || "",
    tags: blog.tags || "",
    meta_title: blog.meta_title || "",
    meta_description: blog.meta_description || "",
    is_featured: Boolean(blog.is_featured),
    status: blog.status || 1,
    published_at: formatDateTimeLocal(blog.published_at),
    featured_image: null,
    featured_image_url: blog.featured_image_url || "",
    featured_image_preview: "",
  };

  const handleFormSubmit = async (values) => {
    if (!session?.accessToken) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("slug", values.slug);
    formData.append("excerpt", values.excerpt);
    formData.append("content", values.content);
    formData.append("author_name", values.author_name || "Chitral Hive");
    formData.append("category", values.category || "");
    formData.append("tags", values.tags || "");
    formData.append("meta_title", values.meta_title || "");
    formData.append("meta_description", values.meta_description || "");
    formData.append("is_featured", values.is_featured ? "true" : "false");
    formData.append("status", String(values.status));
    formData.append("published_at", values.published_at ? new Date(values.published_at).toISOString() : "");

    if (values.featured_image) {
      formData.append("featured_image", values.featured_image);
    }

    try {
      setDisableButtonCheck(true);
      await axios.patch(`${server_ip}updateBlog/${blog.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + session.accessToken,
        },
      });

      toast.success("Blog post updated successfully.");
      router.push({
        pathname: "/admin/blog",
        query: {
          pageIndexRouter: router.query.pageIndexRouter,
          scrollPosition: router.query.scrollPosition,
          rowsPerPageRouter: router.query.rowsPerPageRouter,
        },
      });
    } catch (error) {
      setDisableButtonCheck(false);
      const message =
        error?.response?.data?.slug?.[0] ||
        error?.response?.data?.title?.[0] ||
        error?.response?.data?.detail ||
        "Unable to update blog post.";
      toast.error(message);
    }
  };

  if (status === "loading") {
    return <Box py={4}>Loading...</Box>;
  }

  return (
    <Box py={4}>
      <H3 mb={2}>Edit Blog Post</H3>

      <BlogForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        disableButtonCheck={disableButtonCheck}
        convertToSlug={convertToSlug}
      />
    </Box>
  );
}

export async function getServerSideProps(context) {
  const sessionValue = await getSession(context);

  if (!sessionValue?.accessToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const blog = await api.getBlog(context.query.id, sessionValue.accessToken);
  return { props: { blog } };
}

EditBlog.auth = true;
