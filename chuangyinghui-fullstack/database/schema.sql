-- 创影汇数据库结构
-- 视频广告定制平台数据库设计

-- 创建数据库
CREATE DATABASE IF NOT EXISTS chuangyinghui CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE chuangyinghui;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'creator', 'admin') DEFAULT 'client',
    avatar VARCHAR(500),
    phone VARCHAR(20),
    bio TEXT,
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创作者资料表
CREATE TABLE IF NOT EXISTS creator_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    bio TEXT,
    skills JSON,
    hourly_rate DECIMAL(10, 2) DEFAULT 0,
    availability ENUM('full_time', 'part_time', 'unavailable') DEFAULT 'full_time',
    location VARCHAR(100),
    languages JSON,
    experience JSON,
    education JSON,
    social_links JSON,
    portfolio JSON,
    rating DECIMAL(2, 1) DEFAULT 0,
    review_count INT DEFAULT 0,
    completed_orders INT DEFAULT 0,
    total_earnings DECIMAL(12, 2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP NULL,
    verified_by INT NULL,
    verification_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_rating (rating),
    INDEX idx_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    assigned_creator_id INT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    final_price DECIMAL(10, 2),
    duration INT NOT NULL COMMENT '工期（天）',
    requirements JSON,
    reference_urls JSON,
    tags JSON,
    deadline TIMESTAMP NULL,
    status ENUM('open', 'in_progress', 'review', 'revision', 'completed', 'cancelled') DEFAULT 'open',
    assigned_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_creator_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_client (client_id),
    INDEX idx_creator (assigned_creator_id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 投标表
CREATE TABLE IF NOT EXISTS bids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    creator_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL COMMENT '工期（天）',
    proposal TEXT NOT NULL,
    milestones JSON,
    status ENUM('pending', 'accepted', 'rejected', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_bid (order_id, creator_id),
    INDEX idx_order (order_id),
    INDEX idx_creator (creator_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评价表
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    client_id INT NOT NULL,
    creator_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    tags JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    moderated_by INT NULL,
    moderated_at TIMESTAMP NULL,
    moderation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_review (order_id, client_id),
    INDEX idx_creator (creator_id),
    INDEX idx_status (status),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    order_id INT NULL,
    content TEXT NOT NULL,
    attachments JSON,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_sender (sender_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_order (order_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 交易表
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_no VARCHAR(50) NOT NULL UNIQUE,
    order_id INT NULL,
    from_user_id INT NULL,
    to_user_id INT NULL,
    type ENUM('payment', 'refund', 'withdrawal', 'deposit', 'platform_fee') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    payment_method VARCHAR(50) DEFAULT 'platform',
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    completed_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_transaction_no (transaction_no),
    INDEX idx_order (order_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 作品集表
CREATE TABLE IF NOT EXISTS portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    thumbnail VARCHAR(500) NOT NULL,
    video_url VARCHAR(500),
    images JSON,
    tags JSON,
    skills JSON,
    duration VARCHAR(50),
    client_name VARCHAR(100),
    project_url VARCHAR(500),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 系统设置表
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建触发器：更新创作者评分
DELIMITER //

CREATE TRIGGER update_creator_rating AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    IF NEW.status = 'approved' THEN
        UPDATE creator_profiles
        SET 
            rating = (SELECT AVG(rating) FROM reviews WHERE creator_id = NEW.creator_id AND status = 'approved'),
            review_count = (SELECT COUNT(*) FROM reviews WHERE creator_id = NEW.creator_id AND status = 'approved')
        WHERE user_id = NEW.creator_id;
    END IF;
END//

CREATE TRIGGER update_creator_rating_update AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
        UPDATE creator_profiles
        SET 
            rating = (SELECT AVG(rating) FROM reviews WHERE creator_id = NEW.creator_id AND status = 'approved'),
            review_count = (SELECT COUNT(*) FROM reviews WHERE creator_id = NEW.creator_id AND status = 'approved')
        WHERE user_id = NEW.creator_id;
    END IF;
END//

DELIMITER ;
