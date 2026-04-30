import { Button, Card, Checkbox, FormControlLabel, Grid, MenuItem, TextField } from "@mui/material";
import DropZone from "components/DropZone";
import RichTextEditor from "components/RichTextEditor";
import { Formik } from "formik";
import React from "react";

const BlogForm = ({
  initialValues,
  validationSchema,
  handleFormSubmit,
  disableButtonCheck,
  convertToSlug,
}) => {
  return (
    <Card sx={{ p: 4 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DropZone
                  onChange={(files) => {
                    const file = files[0];
                    setFieldValue("featured_image", file);
                    setFieldValue("featured_image_preview", file ? URL.createObjectURL(file) : "");
                  }}
                  title="Drag & drop a blog cover image"
                  imageSize="Recommended 1200 x 675"
                />
              </Grid>

              {(values.featured_image_preview || values.featured_image_url) && (
                <Grid item xs={12}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.featured_image_preview || values.featured_image_url}
                    alt="Blog cover preview"
                    style={{ maxWidth: "320px", width: "100%", borderRadius: 12 }}
                  />
                </Grid>
              )}

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="title"
                  label="Title"
                  value={values.title}
                  onBlur={handleBlur}
                  onChange={(event) => {
                    setFieldValue("title", event.target.value);
                    setFieldValue("slug", convertToSlug(event.target.value));
                  }}
                  error={!!touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="slug"
                  label="Slug"
                  value={values.slug}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.slug && !!errors.slug}
                  helperText={touched.slug && errors.slug}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="author_name"
                  label="Author Name"
                  value={values.author_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.author_name && !!errors.author_name}
                  helperText={touched.author_name && errors.author_name}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="category"
                  label="Category"
                  value={values.category}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.category && !!errors.category}
                  helperText={touched.category && errors.category}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  name="status"
                  label="Status"
                  value={values.status}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.status && !!errors.status}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value={1}>Draft</MenuItem>
                  <MenuItem value={2}>Published</MenuItem>
                  <MenuItem value={3}>Archived</MenuItem>
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  name="published_at"
                  label="Publish Date"
                  value={values.published_at}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(values.is_featured)}
                      onChange={(event) => setFieldValue("is_featured", event.target.checked)}
                    />
                  }
                  label="Feature this post"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  name="excerpt"
                  label="Excerpt"
                  value={values.excerpt}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.excerpt && !!errors.excerpt}
                  helperText={touched.excerpt && errors.excerpt}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="tags"
                  label="Tags"
                  placeholder="e.g. Chitrali products, culture, honey"
                  value={values.tags}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="meta_title"
                  label="Meta Title"
                  value={values.meta_title}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.meta_title && !!errors.meta_title}
                  helperText={touched.meta_title && errors.meta_title}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  name="meta_description"
                  label="Meta Description"
                  value={values.meta_description}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.meta_description && !!errors.meta_description}
                  helperText={touched.meta_description && errors.meta_description}
                />
              </Grid>

              <Grid item xs={12}>
                <RichTextEditor
                  value={values.content}
                  onChange={(value) => setFieldValue("content", value)}
                />
                {touched.content && errors.content ? (
                  <div style={{ color: "#d32f2f", marginTop: 8, fontSize: 12 }}>{errors.content}</div>
                ) : null}
              </Grid>

              <Grid item xs={12}>
                <Button disabled={disableButtonCheck} variant="contained" color="info" type="submit">
                  Save Blog
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default BlogForm;
