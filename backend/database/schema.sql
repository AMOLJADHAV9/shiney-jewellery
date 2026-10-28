-- =============================================================================
-- SHINEY HAUTE JOAILLERIE & TIMLESS ELEGANCE
-- ENTERPRISE POSTGRESQL PRODUCTION RELATIONAL SCHEMA (v1.0.0)
-- Target Database: PostgreSQL 15+ / 16+
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- =============================================================================
-- 1. ENUMS & DOMAIN TYPES
-- =============================================================================

CREATE TYPE user_role_enum AS ENUM ('patron', 'vip_patron', 'atelier_staff', 'gemologist', 'concierge', 'admin', 'super_admin');
CREATE TYPE stock_status_enum AS ENUM ('in_stock', 'low_stock', 'made_to_order', 'out_of_stock', 'archived');
CREATE TYPE variant_type_enum AS ENUM ('ring_size', 'chain_length', 'metal_finish', 'gemstone_grade');
CREATE TYPE order_status_enum AS ENUM (
    'pending_payment',
    'payment_authorized',
    'in_atelier_assembly',
    'hallmarking_and_certification',
    'quality_assurance',
    'dispatched_armoured_courier',
    'out_for_delivery',
    'delivered_signature_verified',
    'cancelled',
    'refunded'
);
CREATE TYPE payment_status_enum AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE payment_provider_enum AS ENUM ('stripe', 'adyen', 'private_wire', 'concierge_charge');
CREATE TYPE shipping_carrier_enum AS ENUM ('brinks_global', 'fedex_custom_critical', 'malca_amit', 'ferrari_security');
CREATE TYPE appointment_type_enum AS ENUM ('in_person_salon', 'virtual_4k_session', 'bespoke_consultation', 'valuation_and_care');
CREATE TYPE appointment_status_enum AS ENUM ('requested', 'confirmed', 'in_progress', 'completed', 'rescheduled', 'cancelled');
CREATE TYPE salon_location_enum AS ENUM ('london_mayfair', 'paris_place_vendome', 'new_york_madison', 'geneva_rhone', 'virtual');

-- =============================================================================
-- 2. USERS, AUTHENTICATION & PATRON PROFILES
-- =============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email CITEXT UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable for OAuth / Magic Link patrons
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(35),
    role user_role_enum DEFAULT 'patron' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE patron_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) DEFAULT 'Privilege Salon Member' NOT NULL,
    patron_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. PAT-2026-9812
    ring_size_preference VARCHAR(10),
    preferred_metal VARCHAR(50),
    preferred_currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    dedicated_concierge_id UUID REFERENCES users(id) ON DELETE SET NULL,
    lifetime_spend NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    notes TEXT,
    avatar_minio_key VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_label VARCHAR(50) DEFAULT 'Primary Residence', -- e.g. 'Penthouse NYC', 'Mayfair Villa'
    recipient_name VARCHAR(200) NOT NULL,
    phone VARCHAR(35) NOT NULL,
    street_line1 VARCHAR(255) NOT NULL,
    street_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(30) NOT NULL,
    country_code VARCHAR(2) NOT NULL, -- ISO Alpha-2 e.g. 'US', 'GB', 'FR'
    is_default_shipping BOOLEAN DEFAULT FALSE NOT NULL,
    is_default_billing BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user_refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =============================================================================
-- 3. PRODUCT CATALOG, CATEGORIES & INVENTORY
-- =============================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    banner_minio_key VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(60) UNIQUE NOT NULL, -- e.g. SH-RNG-AUR-01
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    short_description VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    price NUMERIC(12, 2) NOT NULL,
    compare_at_price NUMERIC(12, 2),
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    material VARCHAR(150) NOT NULL, -- e.g. '18k Recycled Yellow Gold (750/1000)'
    gold_carat VARCHAR(20), -- e.g. '18KT', '24KT'
    gemstone VARCHAR(200), -- e.g. 'VVS1 DEF Lab-Cultured Diamonds (1.80 ctw)'
    weight_grams NUMERIC(8, 2),
    dimensions VARCHAR(100),
    stock_status stock_status_enum DEFAULT 'in_stock' NOT NULL,
    variant_type variant_type_enum,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_new_arrival BOOLEAN DEFAULT FALSE NOT NULL,
    is_best_seller BOOLEAN DEFAULT FALSE NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    reviews_count INT DEFAULT 0 NOT NULL,
    tags TEXT[] DEFAULT '{}',
    seo_title VARCHAR(200),
    seo_description VARCHAR(300),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    minio_bucket VARCHAR(100) NOT NULL DEFAULT 'shiney-public-media',
    minio_key VARCHAR(500) NOT NULL, -- Path inside MinIO e.g. products/aura-solitaire-main.webp
    cdn_url VARCHAR(1000) NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE NOT NULL,
    width INT,
    height INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(60) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL, -- e.g. 'Size 6 (16.5mm)', '18in Solid Cable'
    option_value VARCHAR(50) NOT NULL, -- e.g. '6', '18in', 'rose_gold'
    price_delta NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE NOT NULL,
    stock_quantity INT DEFAULT 10 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE product_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    certificate_number VARCHAR(100) UNIQUE NOT NULL, -- GIA or IGI report #
    issuing_authority VARCHAR(100) NOT NULL, -- 'GIA', 'IGI', 'Atelier Guarantee'
    carat_weight NUMERIC(6, 3) NOT NULL,
    clarity_grade VARCHAR(20) NOT NULL, -- 'FL', 'IF', 'VVS1', etc.
    color_grade VARCHAR(10) NOT NULL, -- 'D', 'E', 'F'
    cut_grade VARCHAR(30) NOT NULL, -- 'Excellent', 'Ideal'
    minio_pdf_key VARCHAR(500) NOT NULL, -- Secured MinIO key
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =============================================================================
-- 4. CARTS & SHOPPING BAGS
-- =============================================================================

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    guest_session_id VARCHAR(100) UNIQUE, -- For unauthenticated patrons
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    promo_code_id UUID,
    discount_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INT DEFAULT 1 NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    custom_engraving_text VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_cart_product_variant UNIQUE (cart_id, product_id, variant_id)
);

-- =============================================================================
-- 5. ORDERS, SHIPMENTS & PAYMENTS
-- =============================================================================

CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'HAUTE10', 'SHINEYVIP'
    discount_percentage NUMERIC(5, 2) NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    min_spend NUMERIC(12, 2) DEFAULT 0.00,
    max_discount_amount NUMERIC(12, 2),
    usage_limit INT,
    times_used INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    valid_from TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. SH-2026-94812
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status order_status_enum DEFAULT 'pending_payment' NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    shipping_cost NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    estimated_tax NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    promo_code_used VARCHAR(50),
    
    -- Snapshot of Client Contact & Shipping Address
    client_email CITEXT NOT NULL,
    client_phone VARCHAR(35) NOT NULL,
    shipping_recipient VARCHAR(200) NOT NULL,
    shipping_address_line1 VARCHAR(255) NOT NULL,
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(30) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL,

    -- Delivery Speed & Courier Instructions
    shipping_speed VARCHAR(50) DEFAULT 'standard' NOT NULL, -- 'standard', 'priority_armoured'
    special_delivery_notes TEXT,
    requires_signature BOOLEAN DEFAULT TRUE NOT NULL,
    
    placed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    variant_name VARCHAR(100),
    sku VARCHAR(60) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(12, 2) NOT NULL,
    custom_engraving_text VARCHAR(100),
    product_snapshot JSONB NOT NULL, -- Immutable record of product at time of purchase
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status order_status_enum,
    to_status order_status_enum NOT NULL,
    note TEXT,
    changed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    carrier shipping_carrier_enum DEFAULT 'brinks_global' NOT NULL,
    tracking_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. BRK-89210-US
    armoured_courier_escort BOOLEAN DEFAULT TRUE NOT NULL,
    insurance_policy_number VARCHAR(100),
    declared_value NUMERIC(14, 2) NOT NULL,
    dispatched_at TIMESTAMPTZ,
    estimated_delivery_at TIMESTAMPTZ,
    actual_delivery_at TIMESTAMPTZ,
    signed_by_recipient VARCHAR(200),
    proof_of_delivery_minio_key VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    provider payment_provider_enum NOT NULL,
    provider_transaction_id VARCHAR(255) UNIQUE,
    status payment_status_enum DEFAULT 'pending' NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    card_brand VARCHAR(50),
    card_last4 VARCHAR(4),
    raw_provider_response JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =============================================================================
-- 6. WISHLISTS & SAVED CREATIONS
-- =============================================================================

CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) DEFAULT 'My Coveted Creations' NOT NULL,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    share_token VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_wishlist_product UNIQUE (wishlist_id, product_id)
);

-- =============================================================================
-- 7. EDITORIAL JOURNAL, BLOG & MEDIA
-- =============================================================================

CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g. 'Earrings', 'Diamonds', 'Gifts Set'
    date_display VARCHAR(50) DEFAULT 'April 16, 2025' NOT NULL,
    read_time VARCHAR(50) DEFAULT '5 min read' NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(150) NOT NULL,
    image_minio_key VARCHAR(500) NOT NULL,
    image_cdn_url VARCHAR(1000) NOT NULL,
    excerpt TEXT NOT NULL,
    content_paragraphs TEXT[] NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    views_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =============================================================================
-- 8. ATELIER APPOINTMENTS & CLIENT CONCIERGE
-- =============================================================================

CREATE TABLE atelier_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_number VARCHAR(40) UNIQUE NOT NULL, -- e.g. APT-2026-0041
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    client_name VARCHAR(200) NOT NULL,
    client_email CITEXT NOT NULL,
    client_phone VARCHAR(35) NOT NULL,
    appointment_type appointment_type_enum DEFAULT 'in_person_salon' NOT NULL,
    salon_location salon_location_enum DEFAULT 'london_mayfair' NOT NULL,
    requested_date DATE NOT NULL,
    requested_time_slot VARCHAR(50) NOT NULL, -- e.g. '14:00 - 15:30 GMT'
    interests_description TEXT,
    assigned_gemologist_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status appointment_status_enum DEFAULT 'requested' NOT NULL,
    meeting_link VARCHAR(500), -- For virtual 4K video session
    internal_concierge_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE concierge_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(40) UNIQUE NOT NULL, -- e.g. CNQ-2026-1029
    name VARCHAR(200) NOT NULL,
    email CITEXT NOT NULL,
    phone VARCHAR(35),
    subject VARCHAR(100) NOT NULL, -- 'bespoke', 'sizing', 'appointment', 'care'
    salon salon_location_enum DEFAULT 'london_mayfair',
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE NOT NULL,
    assigned_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email CITEXT UNIQUE NOT NULL,
    source_page VARCHAR(100) DEFAULT 'homepage',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =============================================================================
-- 9. AUDIT LOGS & ATELIER TRACEABILITY
-- =============================================================================

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'ORDER_CANCELLED', 'PRICE_UPDATED', 'STOCK_ADJUSTED'
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    old_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =============================================================================
-- 10. INDEXES FOR HIGH-THROUGHPUT RETRIEVAL
-- =============================================================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_flags ON products(is_featured, is_new_arrival, is_best_seller);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_placed_at ON orders(placed_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_product_images_product ON product_images(product_id, sort_order);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_appointments_date ON atelier_appointments(requested_date, salon_location);

-- =============================================================================
-- 11. AUTOMATIC UPDATED_AT TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_patron_profiles_updated_at BEFORE UPDATE ON patron_profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON atelier_appointments FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
