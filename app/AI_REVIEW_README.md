# AI任务预审功能使用说明

## 功能概述

AI任务预审功能使用豆包AI对广告主发布的视频制作任务进行智能预审，帮助广告主在发布前发现潜在问题，提高任务质量。

## 文件结构

```
src/
├── pages/
│   └── AIReviewExample.tsx        # AI预审功能示例页面
├── components/
│   ├── AIReviewResult.tsx         # AI预审结果展示组件
│   └── AIReviewButton.tsx         # AI预审按钮组件
├── services/
│   └── aiReviewService.ts         # AI预审服务（对接豆包AI）
└── pages/
    └── PostOrder.tsx              # 发布订单页面（已集成AI预审）
```

## 配置步骤

### 1. 配置豆包AI API

复制 `.env.example` 为 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入实际的豆包AI API配置：

```env
VITE_DOUBAO_API_URL=https://ark.cn-beijing.volces.com/api/v3/chat/completions
VITE_DOUBAO_API_KEY=your-actual-api-key
```

### 2. 获取豆包AI API密钥

1. 访问 [火山引擎](https://console.volcengine.com/ark)
2. 创建或登录账号
3. 开通豆包API服务
4. 创建推理接口端点，获取API Key和模型ID

## 使用方式

### 方式一：示例页面演示

访问 `http://localhost:5173/relidou-product/ai-review-example` 查看AI预审功能的完整示例。

示例页面包含三种测试场景：
- ✅ 合格任务（90-100分）
- ⚠️ 需优化任务（60-89分）
- ❌ 不建议发布任务（0-59分）

### 方式二：在发布订单页面使用

1. 访问发布订单页面 `/post-order`
2. 填写任务基本信息（标题、类型、预算、要求等）
3. 点击"AI预审"按钮
4. 查看AI预审结果和改进建议
5. 根据建议优化任务信息或直接发布

### 方式三：在其他页面集成

使用 `AIReviewButton` 组件快速集成：

```tsx
import { AIReviewButton } from '@/components/AIReviewButton'
import { TaskDetails } from '@/services/aiReviewService'

function MyPage() {
  const taskDetails: TaskDetails = {
    taskName: '任务名称',
    videoType: '好物种草',
    duration: '15-30秒',
    quantity: 1,
    coreRequirements: '任务要求详情',
    budget: 1200,
    settlementMethod: '验收合格后结算',
    deliveryTime: '2026-03-10 至 2026-03-15'
  }

  return (
    <AIReviewButton
      taskDetails={taskDetails}
      onReviewComplete={(result) => {
        console.log('AI预审结果:', result)
      }}
    />
  )
}
```

## AI预审评分标准

AI从8个维度对任务进行评分：

1. **信息完整性**（15分）：任务关键信息是否完整
2. **内容清晰度**（15分）：需求描述是否明确
3. **合规性**（15分）：是否存在违规内容
4. **可行性**（10分）：任务是否可实现
5. **验收标准**（15分）：验收标准是否明确
6. **佣金合理性**（15分）：佣金是否合理
7. **权责清晰**（10分）：权责划分是否清晰
8. **创作者友好度**（5分）：是否对创作者友好

## 评分等级

- **90-100分**（绿色）：合格，推荐发布
- **60-89分**（黄色）：需优化，可发布但存在风险
- **0-59分**（红色）：不通过，不建议发布

## API返回格式

豆包AI返回标准JSON格式：

```json
{
  "task_score": 92,
  "pass_level": "green",
  "pass_desc": "合格",
  "problems": [],
  "suggestions": [
    "建议明确视频画幅比例",
    "建议补充交付时间要求"
  ],
  "risk_warning": ""
}
```

## 开发模式

在开发模式下，如果没有配置API密钥，系统会自动返回模拟数据，方便前端开发和测试。

## 注意事项

1. **API密钥安全**：不要将API密钥提交到代码仓库
2. **调用频率**：避免频繁调用API，建议添加防抖或节流
3. **错误处理**：需要处理API调用失败的情况
4. **数据验证**：在调用AI前验证必填字段

## 扩展功能

可以根据需要扩展以下功能：

1. **历史记录**：保存用户的AI预审历史
2. **批量预审**：支持批量预审多个任务
3. **自定义规则**：根据平台需求调整评分规则
4. **数据分析**：统计AI预审通过率和常见问题

## 技术支持

如有问题，请参考：
- [豆包AI文档](https://www.volcengine.com/docs/82379)
- [React文档](https://react.dev/)
- 项目Issue
