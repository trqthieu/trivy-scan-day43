# Bài Tập 1: Basic Security Workflow với Trivy

## 🎯 Mục Tiêu
Tạo GitHub Actions workflow để scan Docker image với Trivy và fail CI nếu có CRITICAL vulnerabilities.

## 📋 Yêu Cầu
- [ ] Tạo workflow `.github/workflows/security.yml`
- [ ] Build Docker image từ Dockerfile có sẵn
- [ ] Scan image với Trivy
- [ ] Fail CI nếu có CRITICAL vulnerabilities
- [ ] Upload results lên GitHub Security tab (SARIF format)

## 🏗️ Cấu Trúc Thư Mục

```
bai1-trivy-scan/
├── README.md                    # File này
├── .github/
│   └── workflows/
│       └── security.yml         # TODO: Tạo security workflow
├── src/
│   └── app.js                   # Sample Node.js app
├── package.json                 # Dependencies (có vulnerable packages)
├── Dockerfile                   # Dockerfile với base image cũ
└── .dockerignore
```

## 🚨 Lưu Ý

**Sample app này CÓ CHỦ Ý chứa vulnerabilities để bạn thực hành:**
- Dockerfile dùng Alpine version cũ (có CVEs)
- package.json có dependencies outdated
- Đây là môi trường an toàn để học security scanning!

## 🚀 Các Bước Thực Hiện

### Bước 1: Tạo Workflow File

Tạo file `.github/workflows/security.yml`:

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:

jobs:
  trivy-scan:
    runs-on: ubuntu-latest
    steps:
      # TODO: Checkout code
      - name: Checkout code
        # uses: actions/checkout@v4

      # TODO: Build Docker image
      - name: Build Docker image
        # run: docker build -t myapp:${{ github.sha }} .

      # TODO: Run Trivy scan (table format)
      - name: Run Trivy vulnerability scanner
        # uses: aquasecurity/trivy-action@master
        # with:
        #   image-ref: myapp:${{ github.sha }}
        #   format: 'table'
        #   exit-code: '1'                    # Fail CI if vulnerabilities
        #   severity: 'CRITICAL'              # Only fail on CRITICAL

      # TODO: Run Trivy scan (SARIF format for GitHub Security)
      - name: Run Trivy for GitHub Security
        # uses: aquasecurity/trivy-action@master
        # with:
        #   image-ref: myapp:${{ github.sha }}
        #   format: 'sarif'
        #   output: 'trivy-results.sarif'

      # TODO: Upload SARIF to GitHub Security
      - name: Upload Trivy results to GitHub Security
        # uses: github/codeql-action/upload-sarif@v3
        # if: always()
        # with:
        #   sarif_file: 'trivy-results.sarif'
```

### Bước 2: Test Local (Optional)

```bash
# Build image
docker build -t myapp:test .

# Scan với Trivy (cài Trivy trước)
# macOS:
brew install aquasecurity/trivy/trivy

# hoặc Docker:
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image myapp:test

# Expect: Sẽ thấy vulnerabilities!
```

### Bước 3: Push và Test Workflow

```bash
# Init git repo
git init
git add .
git commit -m "feat: add security scanning"

# Push lên GitHub repo của bạn
git remote add origin <your-repo-url>
git push -u origin main

# Vào Actions tab để xem workflow chạy
```

## ✅ Kết Quả Mong Đợi

**Workflow sẽ FAIL** (đúng như mong muốn!) vì:
- Alpine base image có CVEs
- npm packages có known vulnerabilities

**Output mẫu:**

```
✗ trivy-scan (1m 30s)
  ✓ Checkout code
  ✓ Build Docker image
  ✗ Run Trivy vulnerability scanner

    myapp:abc123 (alpine 3.17.0)
    Total: 5 (CRITICAL: 2, HIGH: 3)

    ┌──────────┬────────────────┬──────────┬───────────┬─────────────┐
    │ Library  │ Vulnerability  │ Severity │ Inst. Ver │ Fixed Ver   │
    ├──────────┼────────────────┼──────────┼───────────┼─────────────┤
    │ libssl3  │ CVE-2023-12345 │ CRITICAL │ 3.0.7-r0  │ 3.0.8-r0    │
    │ openssl  │ CVE-2023-12345 │ CRITICAL │ 3.0.7-r0  │ 3.0.8-r0    │
    └──────────┴────────────────┴──────────┴───────────┴─────────────┘

  ✓ Upload Trivy results to GitHub Security
```

**GitHub Security Tab:**
```
Security → Code scanning alerts

2 critical vulnerabilities found:
  - openssl CVE-2023-12345 (CRITICAL)
  - libssl3 CVE-2023-12345 (CRITICAL)
```

## 💡 Gợi Ý

### Trivy Action Syntax

```yaml
- uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'myapp:tag'           # Image to scan
    format: 'table'                  # Output format: table, json, sarif
    exit-code: '1'                   # Exit code 1 = fail CI
    severity: 'CRITICAL,HIGH'        # Severity levels to check
```

### Upload SARIF

```yaml
- uses: github/codeql-action/upload-sarif@v3
  if: always()                       # Upload even if scan fails
  with:
    sarif_file: 'trivy-results.sarif'
```

### Build Image

```yaml
- name: Build Docker image
  run: docker build -t myapp:${{ github.sha }} .
  # Use git SHA as tag for uniqueness
```

## 🎓 Kiến Thức Cần Biết

- GitHub Actions workflow syntax
- Docker build basics
- Trivy action parameters
- SARIF format (Security Analysis Results Interchange Format)
- GitHub Security tab integration

## 🌟 Bonus Challenge

Sau khi workflow chạy thành công (và fail như expected):
1. Fix vulnerabilities trong Dockerfile
2. Update Alpine base image lên version mới hơn
3. Re-run workflow → should pass ✅

**Hint để fix:**
```dockerfile
# In Dockerfile, change:
FROM node:20-alpine3.17

# To:
FROM node:20-alpine3.19
```

Chúc bạn làm bài tốt! 🚀
