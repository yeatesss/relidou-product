const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// 日志和压缩
app.use(morgan('dev'));
app.use(compression());

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 路由
app.use('/api', routes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 错误处理
app.use(errorHandler);

// 数据库连接并启动服务器
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
      console.log(`API 地址: http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
    process.exit(1);
  });

module.exports = app;
