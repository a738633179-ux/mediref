# 医查通 MediRef

一个开源的**疾病速查工具**：输入疾病名称，快速查看该疾病的概述、常见症状、检查方法、治疗方法与预防建议。

项目为纯静态网页，**无需服务器、无需安装**，打开即用，可部署到 GitHub Pages 等任意静态托管。

> ⚠️ 免责声明：本项目所有内容仅供健康科普参考，不构成医疗建议，不能替代执业医师的诊断与治疗。如有身体不适，请及时前往正规医疗机构就诊。

## 功能

- 按疾病名称、别名或症状关键词搜索
- 按疾病分类筛选（呼吸系统、心血管、消化系统等）
- 每种疾病展示：概述 / 症状 / 检查方法 / 治疗方法 / 预防建议
- 数据驱动：疾病条目全部存放在一个 JSON 文件中，方便扩充和协作
- 无任何外部依赖与追踪代码，隐私友好

## 本地使用

直接用浏览器打开 `index.html` 即可，或者启动一个本地静态服务器：

```bash
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

## 项目结构

```text
mediref/
├── index.html            # 页面入口
├── css/style.css         # 样式
├── js/app.js             # 搜索、筛选与详情渲染逻辑
├── data/diseases.json    # 疾病数据（核心）
├── scripts/validate.py   # 数据校验脚本
└── .github/workflows/ci.yml  # 自动校验
```

## 如何添加一种疾病

1. 打开 `data/diseases.json`，复制任意一条完整记录作为模板
2. 修改 `id`（小写字母、数字、连字符）、`name`、`aliases`、`category`
3. 认真填写 `overview`、`symptoms`、`examinations`、`treatments`、`prevention`
4. 本地运行校验：

```bash
python3 scripts/validate.py
```

5. 校验通过后提交 Pull Request。详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 内容规范

- 每条内容应准确、简明、中立，面向普通读者
- 不写绝对化、保证疗效的表述
- 涉及用药时提示“遵医嘱”
- 保留每条记录的科普免责声明

## 开源许可

[MIT](LICENSE)

---

# MediRef (English)

An open-source **disease quick-reference tool**: search a disease name and instantly see its overview, common symptoms, diagnostic tests, treatments, and prevention tips.

Pure static pages — no server or installation required. Works offline and can be hosted on GitHub Pages or any static host.

> ⚠️ Disclaimer: All content in this project is for general educational reference only and is not medical advice. Always consult a qualified healthcare professional.

## Features

- Search by disease name, aliases, or symptom keywords
- Filter by category (respiratory, cardiovascular, digestive, etc.)
- Each entry covers overview / symptoms / examinations / treatments / prevention
- Data-driven: all entries live in one JSON file for easy contribution
- Zero external dependencies, privacy-friendly

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Add a disease

Copy an existing entry in `data/diseases.json` as a template, fill in the fields, then validate:

```bash
python3 scripts/validate.py
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE)
