# --- Giai đoạn 1: Build ứng dụng ---
FROM node:20-alpine AS builder

WORKDIR /app

# Sao chép các file quản lý phụ thuộc (sửa tên package.json tương ứng nếu cần)
COPY package*.json ./

# Cài đặt các gói phụ thuộc
RUN npm ci

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Tiến hành build ứng dụng (Vite sẽ tạo thư mục dist)
RUN npm run build

# --- Giai đoạn 2: Chạy ứng dụng bằng Nginx ---
FROM nginx:alpine

# Sao chép mã nguồn đã build từ giai đoạn 1 sang thư mục phục vụ của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# (Tùy chọn) Sao chép cấu hình Nginx custom nếu bạn dùng React Router (xem bước 2)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80 cho web server
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]