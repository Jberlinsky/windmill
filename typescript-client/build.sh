#!/bin/bash
set -e

npm ci --ignore-scripts
npx --yes openapi-typescript-codegen --input ../backend/windmill-api/openapi.yaml \
 --output ./src --useOptions \
 && sed -i '213 i \\    request.referrerPolicy = \"no-referrer\"\n' src/core/request.ts 
