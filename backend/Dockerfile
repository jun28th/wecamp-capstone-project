# Sử dụng image Node.js chính thức phiên bản 18+ (phù hợp với package.json của bạn)
FROM node:18-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ mã nguồn còn lại của backend vào container
COPY . .

# Mở cổng chạy ứng dụng (ví dụ backend chạy port 3000, bạn hãy đổi lại theo port thực tế trong index.js của bạn)
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["npm", "start"]