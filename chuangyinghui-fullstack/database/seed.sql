-- 创影汇种子数据
-- 用于开发和测试的示例数据

USE chuangyinghui;

-- 清空现有数据（谨慎使用）
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE operation_logs;
TRUNCATE TABLE transactions;
TRUNCATE TABLE messages;
TRUNCATE TABLE reviews;
TRUNCATE TABLE bids;
TRUNCATE TABLE portfolios;
TRUNCATE TABLE orders;
TRUNCATE TABLE creator_profiles;
TRUNCATE TABLE users;
TRUNCATE TABLE settings;
SET FOREIGN_KEY_CHECKS = 1;

-- 插入管理员用户
INSERT INTO users (username, email, password, role, avatar, status, created_at) VALUES
('admin', 'admin@chuangyinghui.com', '$2a$10$YourHashedPasswordHere', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'active', NOW());

-- 插入广告主用户
INSERT INTO users (username, email, password, role, avatar, bio, status, created_at) VALUES
('zhangsan', 'zhangsan@example.com', '$2a$10$YourHashedPasswordHere', 'client', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan', '某品牌市场经理，需要高质量的视频广告', 'active', DATE_SUB(NOW(), INTERVAL 30 DAY)),
('lisi', 'lisi@example.com', '$2a$10$YourHashedPasswordHere', 'client', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', '电商运营，寻找长期合作的视频制作团队', 'active', DATE_SUB(NOW(), INTERVAL 20 DAY)),
('wangwu', 'wangwu@example.com', '$2a$10$YourHashedPasswordHere', 'client', 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu', '创业公司创始人，需要产品宣传视频', 'active', DATE_SUB(NOW(), INTERVAL 15 DAY)),
('zhaoliu', 'zhaoliu@example.com', '$2a$10$YourHashedPasswordHere', 'client', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu', '教育机构负责人，需要课程推广视频', 'active', DATE_SUB(NOW(), INTERVAL 10 DAY));

-- 插入创作者用户
INSERT INTO users (username, email, password, role, avatar, bio, status, created_at) VALUES
('creator1', 'creator1@example.com', '$2a$10$YourHashedPasswordHere', 'creator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator1', '专业视频剪辑师，5年经验，擅长商业广告制作', 'active', DATE_SUB(NOW(), INTERVAL 60 DAY)),
('creator2', 'creator2@example.com', '$2a$10$YourHashedPasswordHere', 'creator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator2', '动画设计师，精通MG动画和产品演示视频', 'active', DATE_SUB(NOW(), INTERVAL 50 DAY)),
('creator3', 'creator3@example.com', '$2a$10$YourHashedPasswordHere', 'creator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator3', '摄影师兼剪辑师，专注品牌宣传片', 'active', DATE_SUB(NOW(), INTERVAL 45 DAY)),
('creator4', 'creator4@example.com', '$2a$10$YourHashedPasswordHere', 'creator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator4', '短视频达人，擅长抖音、快手平台内容', 'active', DATE_SUB(NOW(), INTERVAL 40 DAY)),
('creator5', 'creator5@example.com', '$2a$10$YourHashedPasswordHere', 'creator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator5', '3D动画师，可制作高质量三维产品展示', 'active', DATE_SUB(NOW(), INTERVAL 35 DAY)),
('creator6', 'creator6@example.com', '$2a$10$YourHashedPasswordHere', 'creator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator6', '专业调色师，让视频更具电影感', 'active', DATE_SUB(NOW(), INTERVAL 30 DAY));

-- 插入创作者资料
INSERT INTO creator_profiles (user_id, bio, skills, hourly_rate, availability, location, languages, rating, review_count, completed_orders, is_verified, created_at) VALUES
(6, '专业视频剪辑师，5年经验，擅长商业广告制作。服务过多个知名品牌，作品风格多样，从快节奏的电商广告到温情的品牌故事都能驾驭。', '["视频剪辑", "调色", "特效", "Pr", "Ae", "达芬奇"]', 200, 'full_time', '北京', '["中文", "英语"]', 4.9, 28, 45, TRUE, DATE_SUB(NOW(), INTERVAL 60 DAY)),
(7, '动画设计师，精通MG动画和产品演示视频。擅长将复杂的产品功能用简洁生动的动画表达出来。', '["MG动画", "产品演示", "UI动画", "Ae", "C4D"]', 250, 'full_time', '上海', '["中文"]', 4.8, 22, 38, TRUE, DATE_SUB(NOW(), INTERVAL 50 DAY)),
(8, '摄影师兼剪辑师，专注品牌宣传片。拥有专业摄影设备和灯光团队，可提供从拍摄到后期的一站式服务。', '["摄影", "剪辑", "调色", "灯光", "Pr", "达芬奇"]', 300, 'full_time', '广州', '["中文", "粤语"]', 4.7, 18, 32, TRUE, DATE_SUB(NOW(), INTERVAL 45 DAY)),
(9, '短视频达人，擅长抖音、快手平台内容。深谙短视频平台算法，制作的视频平均播放量超过50万。', '["短视频", "抖音", "快手", "剪辑", "运营"]', 150, 'part_time', '深圳', '["中文"]', 4.6, 15, 28, FALSE, DATE_SUB(NOW(), INTERVAL 40 DAY)),
(10, '3D动画师，可制作高质量三维产品展示。精通C4D、Blender等三维软件，能制作逼真的产品渲染和动画。', '["3D建模", "产品渲染", "C4D", "Blender", "Octane"]', 350, 'full_time', '杭州', '["中文", "英语"]', 4.9, 12, 20, TRUE, DATE_SUB(NOW(), INTERVAL 35 DAY)),
(11, '专业调色师，让视频更具电影感。擅长各种风格的调色，从清新日系到好莱坞电影感都能轻松驾驭。', '["调色", "达芬奇", "电影感", "色彩校正"]', 180, 'part_time', '成都', '["中文"]', 4.8, 10, 18, FALSE, DATE_SUB(NOW(), INTERVAL 30 DAY));

-- 插入订单
INSERT INTO orders (client_id, title, description, category, budget, duration, requirements, tags, status, created_at) VALUES
(2, '品牌宣传片制作', '需要为新产品发布会制作一支3分钟的品牌宣传片，要求高端大气，体现品牌调性。', 'brand', 8000, 15, '["3分钟时长", "4K画质", "需要配乐"]', '["品牌", "宣传片", "高端"]', 'open', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, '电商产品视频', '需要为10款新品拍摄产品展示视频，每款30秒左右，用于淘宝详情页。', 'product', 5000, 10, '["10款产品", "30秒/款", "白底背景"]', '["电商", "产品", "淘宝"]', 'open', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, '抖音短视频系列', '需要制作30条抖音短视频，用于账号日常更新，风格要求轻松有趣。', 'short', 6000, 20, '["30条视频", "15-30秒", "竖屏"]', '["抖音", "短视频", "系列"]', 'open', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 'APP功能演示动画', '需要制作一个2分钟的APP功能演示MG动画，介绍核心功能和使用方法。', 'animation', 4500, 12, '["2分钟", "MG动画", "APP演示"]', '["动画", "APP", "演示"]', 'in_progress', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(5, '课程推广视频', '需要为在线课程制作推广视频，包括讲师介绍和课程亮点展示。', 'education', 3500, 8, '["3分钟", "教育", "推广"]', '["教育", "课程", "推广"]', 'open', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, '企业年会视频', '需要剪辑公司年会录像，制作一个10分钟的精华版回顾视频。', 'event', 2800, 5, '["10分钟", "年会", "回顾"]', '["年会", "活动", "剪辑"]', 'completed', DATE_SUB(NOW(), INTERVAL 20 DAY));

-- 更新订单分配
UPDATE orders SET assigned_creator_id = 7, status = 'in_progress', assigned_at = DATE_SUB(NOW(), INTERVAL 8 DAY) WHERE id = 4;
UPDATE orders SET assigned_creator_id = 6, status = 'completed', assigned_at = DATE_SUB(NOW(), INTERVAL 18 DAY), completed_at = DATE_SUB(NOW(), INTERVAL 10 DAY), final_price = 2800 WHERE id = 6;

-- 插入投标
INSERT INTO bids (order_id, creator_id, price, duration, proposal, status, created_at) VALUES
(1, 6, 7500, 14, '您好，我有丰富的品牌宣传片制作经验，曾服务过华为、小米等知名品牌。我的提案是...', 'pending', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(1, 8, 8200, 12, '作为专业摄影师，我可以提供从拍摄到后期的一站式服务。我计划...', 'pending', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 6, 4800, 10, '产品视频是我的强项，我可以保证每款产品的拍摄质量...', 'pending', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 9, 5500, 18, '我深谙抖音平台算法，制作的视频平均播放量超过50万。我的方案是...', 'pending', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 7, 4200, 10, 'MG动画是我的专长，我会用生动有趣的方式展示APP功能...', 'accepted', DATE_SUB(NOW(), INTERVAL 9 DAY)),
(5, 7, 3200, 7, '教育类视频我做过很多，我会突出课程的亮点和价值...', 'pending', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 插入评价
INSERT INTO reviews (order_id, client_id, creator_id, rating, content, tags, status, created_at) VALUES
(6, 3, 6, 5, '非常满意！视频质量超出预期，剪辑节奏把握得很好，配乐也很合适。沟通顺畅，交付准时。', '["质量高", "沟通顺畅", "准时交付"]', 'approved', DATE_SUB(NOW(), INTERVAL 8 DAY));

-- 更新创作者评分
UPDATE creator_profiles SET rating = 5.0, review_count = 1 WHERE user_id = 6;

-- 插入作品集
INSERT INTO portfolios (user_id, title, description, category, thumbnail, video_url, tags, skills, duration, client_name, created_at) VALUES
(6, '华为Mate系列宣传片', '为华为Mate系列手机制作的发布会宣传片', 'brand', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600', 'https://example.com/video1.mp4', '["手机", "科技", "高端"]', '["剪辑", "调色", "特效"]', '3分钟', '华为', DATE_SUB(NOW(), INTERVAL 45 DAY)),
(6, '小米智能家居广告', '小米智能家居系列产品的广告片', 'product', 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600', 'https://example.com/video2.mp4', '["智能家居", "科技", "生活"]', '["剪辑", "调色"]', '2分钟', '小米', DATE_SUB(NOW(), INTERVAL 40 DAY)),
(7, '支付宝功能演示动画', '支付宝新功能介绍的MG动画', 'animation', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600', 'https://example.com/video3.mp4', '["MG动画", "APP", "演示"]', '["MG动画", "Ae"]', '90秒', '支付宝', DATE_SUB(NOW(), INTERVAL 35 DAY)),
(8, '某汽车品牌宣传片', '为某汽车品牌拍摄的宣传片', 'brand', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600', 'https://example.com/video4.mp4', '["汽车", "高端", "品牌"]', '["摄影", "剪辑", "调色"]', '4分钟', '某汽车品牌', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(9, '抖音爆款视频合集', '为客户制作的抖音爆款视频合集', 'short', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600', 'https://example.com/video5.mp4', '["抖音", "爆款", "短视频"]', '["短视频", "剪辑"]', '15-30秒', '多个客户', DATE_SUB(NOW(), INTERVAL 25 DAY)),
(10, '3D产品展示', '为某电子产品制作的3D展示动画', 'animation', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600', 'https://example.com/video6.mp4', '["3D", "产品", "展示"]', '["3D建模", "渲染", "C4D"]', '60秒', '某电子品牌', DATE_SUB(NOW(), INTERVAL 20 DAY));

-- 插入系统设置
INSERT INTO settings (key_name, value, description) VALUES
('site_name', '创影汇', '网站名称'),
('site_description', '专业的视频广告定制平台', '网站描述'),
('contact_email', 'contact@chuangyinghui.com', '联系邮箱'),
('platform_fee_rate', '10', '平台服务费率（%）'),
('min_withdrawal_amount', '100', '最小提现金额'),
('max_upload_size', '500', '最大上传文件大小（MB）'),
('order_auto_cancel_days', '7', '订单自动取消天数'),
('review_moderation', 'true', '评价是否需要审核');

-- 插入示例交易记录
INSERT INTO transactions (transaction_no, order_id, from_user_id, to_user_id, type, amount, description, status, completed_at, created_at) VALUES
('TRX' || UNIX_TIMESTAMP(), 6, 3, 6, 'payment', 2800, '订单#6付款', 'completed', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
('TRX' || UNIX_TIMESTAMP() + 1, 6, 6, NULL, 'platform_fee', 280, '平台服务费', 'completed', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- 更新创作者总收入
UPDATE creator_profiles SET total_earnings = 2520 WHERE user_id = 6;

-- 插入示例消息
INSERT INTO messages (sender_id, receiver_id, order_id, content, is_read, created_at) VALUES
(2, 6, 1, '您好，我对您的投标很感兴趣，能否详细聊聊？', TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(6, 2, 1, '您好，感谢您的关注。我可以根据您的需求调整方案...', TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 6, 1, '好的，那我们确定合作吧', FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- 完成
SELECT '种子数据插入完成' AS message;
