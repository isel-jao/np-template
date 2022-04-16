# npx prisma studio 
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
test -f .env || cp .env_example .env && \
docker-compose up -d && \
npx prisma migrate dev --name initial && \
npx prisma generate && \
npx prisma db seed && \
npm run start:dev