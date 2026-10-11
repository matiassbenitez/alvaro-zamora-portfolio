CREATE TABLE admin_users (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(60)   NOT NULL UNIQUE,
    password_hash VARCHAR(120)  NOT NULL,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE site_content (
    id               BIGINT PRIMARY KEY,
    brand_name       VARCHAR(120) NOT NULL,
    brand_tagline    VARCHAR(160) NOT NULL,
    logo_text        VARCHAR(20)  NOT NULL,
    hero_title       VARCHAR(160) NOT NULL,
    hero_subtitle    VARCHAR(300) NOT NULL,
    hero_image       VARCHAR(255),
    about_title      VARCHAR(160),
    about_text       TEXT,
    about_image      VARCHAR(255),
    contact_email    VARCHAR(160),
    contact_phone    VARCHAR(60),
    contact_location VARCHAR(160),
    footer_text      VARCHAR(300),
    CONSTRAINT site_content_single_row CHECK (id = 1)
);

CREATE TABLE social_links (
    id         BIGSERIAL PRIMARY KEY,
    label      VARCHAR(60)  NOT NULL,
    url        VARCHAR(300) NOT NULL,
    sort_order INT          NOT NULL DEFAULT 0
);

CREATE TABLE services (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(120) NOT NULL,
    description VARCHAR(500),
    icon        VARCHAR(60),
    sort_order  INT          NOT NULL DEFAULT 0,
    active      BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE projects (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(160)  NOT NULL,
    slug        VARCHAR(180)  NOT NULL UNIQUE,
    category    VARCHAR(80)   NOT NULL,
    year        INT,
    description TEXT,
    cover_image VARCHAR(255),
    featured    BOOLEAN       NOT NULL DEFAULT FALSE,
    published   BOOLEAN       NOT NULL DEFAULT TRUE,
    sort_order  INT           NOT NULL DEFAULT 0,
    like_count  INT           NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ
);

CREATE TABLE project_images (
    id         BIGSERIAL PRIMARY KEY,
    project_id BIGINT       NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    image_url  VARCHAR(255) NOT NULL,
    sort_order INT          NOT NULL DEFAULT 0
);

CREATE TABLE messages (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(120) NOT NULL,
    email      VARCHAR(160) NOT NULL,
    subject    VARCHAR(160),
    body       TEXT         NOT NULL,
    read_flag  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE likes (
    id            BIGSERIAL PRIMARY KEY,
    project_id    BIGINT      NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    visitor_token VARCHAR(64) NOT NULL,
    ip_hash       VARCHAR(64),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uk_likes_project_token UNIQUE (project_id, visitor_token)
);

CREATE INDEX idx_projects_published_order ON projects (published, sort_order);
CREATE INDEX idx_project_images_project ON project_images (project_id);
CREATE INDEX idx_messages_read ON messages (read_flag);
CREATE INDEX idx_likes_project ON likes (project_id);
