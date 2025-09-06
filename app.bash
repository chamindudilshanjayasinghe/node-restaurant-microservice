pnpm add "shared-utils@workspace:*" --filter order-service
pnpm --filter shared-utils build

docker build -f services/menu-service/Dockerfile -t menu-service:latest .
docker tag menu-service:latest ourmind/menu-service:latest
    
kubectl apply -f services/item-service.yaml