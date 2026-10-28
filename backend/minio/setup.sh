#!/bin/sh
# =============================================================================
# SHINEY HAUTE JOAILLERIE - MINIO S3 OBJECT STORAGE INITIALIZATION
# =============================================================================

echo "Waiting for MinIO to initialize..."
sleep 4

# Configure MinIO client (mc) alias
mc alias set minio http://minio:9000 minioadmin minioadmin123!

echo "Configuring MinIO Buckets for Shiney Atelier Platform..."

# 1. Create Buckets
mc mb --ignore-existing minio/shiney-public-media
mc mb --ignore-existing minio/shiney-secure-documents
mc mb --ignore-existing minio/shiney-user-uploads
mc mb --ignore-existing minio/shiney-backups

# 2. Configure Access Policies
# Public Media: read-only for public CDN access
mc anonymous set download minio/shiney-public-media

# Secure Documents (Certificates, GIA reports, Invoices): strictly private
mc anonymous set none minio/shiney-secure-documents

# User Uploads (Bespoke sketches, ring engraving files): strictly private (accessed via presigned URLs only)
mc anonymous set none minio/shiney-user-uploads

# Backups: internal system only
mc anonymous set none minio/shiney-backups

# 3. Configure Lifecycle Expiration Policies (ILM)
# Automatically expire temporary presigned user uploads older than 30 days if unlinked
mc ilm rule add --expire-days 30 minio/shiney-user-uploads/temp/

echo "MinIO buckets and policies configured successfully."
