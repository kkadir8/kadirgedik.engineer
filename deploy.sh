#!/bin/bash

# Renkler
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Kadir Gedik Portfolyo - Otomatik Kurulum Başlıyor...${NC}"

# 1. Sistem Güncelleme ve Node.js 20 Kurulumu
echo -e "${GREEN}🔄 Sistem güncelleniyor ve Node.js kuruluyor...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git certbot python3-certbot-nginx

# 2. PM2 Kurulumu
echo -e "${GREEN}📦 PM2 kuruluyor...${NC}"
sudo npm install -g pm2

# 3. Projeyi Çekme
PROJECT_DIR="/var/www/portfolio"
REPO_URL="https://github.com/kkadir8/kadirgedik.engineer.git"

if [ -d "$PROJECT_DIR" ]; then
    echo -e "${GREEN}📂 Proje klasörü bulundu, güncelleniyor...${NC}"
    cd $PROJECT_DIR
    git pull
else
    echo -e "${GREEN}📂 Proje klonlanıyor...${NC}"
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
fi

# 4. Bağımlılıkları Yükleme
echo -e "${GREEN}📦 npm install çalıştırılıyor...${NC}"
npm install --production

# 5. .env Dosyasını Oluşturma
echo -e "${GREEN}🔑 Environment değişkenleri ayarlanıyor...${NC}"
cat > .env <<EOF
MONGODB_URI=mongodb+srv://kadirgedik07:tnW30A%3CmWDxn3Uw@cluster0.vvvn9nt.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=k4d1r_p0rtf0l10_s3cr3t_k3y_2024_v3ry_s3cur3
PORT=3000
ADMIN_EMAIL=kadirgedik777@gmail.com
ADMIN_PASSWORD=Admin123!
EOF

# 6. PM2 ile Uygulamayı Başlatma
echo -e "${GREEN}🚀 Uygulama başlatılıyor...${NC}"
pm2 delete portfolio 2>/dev/null || true
pm2 start server.js --name "portfolio"
pm2 save
pm2 startup | tail -n 1 | bash 2>/dev/null || true

# 7. Nginx Ayarları
echo -e "${GREEN}🌐 Nginx ayarlanıyor...${NC}"
DOMAIN="kadirgedik.engineer"

sudo tee /etc/nginx/sites-available/portfolio > /dev/null <<EOF
server {
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/ 2>/dev/null || true
sudo rm /etc/nginx/sites-enabled/default 2>/dev/null || true
sudo nginx -t && sudo systemctl restart nginx

# 8. SSL Sertifikası (Certbot)
echo -e "${GREEN}🔒 SSL Sertifikası alınıyor...${NC}"
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m kadirgedik777@gmail.com

echo -e "${GREEN}✅ Kurulum Tamamlandı! https://$DOMAIN adresini ziyaret edebilirsin.${NC}"
