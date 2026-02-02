export CLOUDFLARE_API_TOKEN="bmvC5neqiVsAugPd9ugohmtEXMFKRvQBwVdJKS1e"

# Retry Step 1: Gateway Token
echo "a884febf7b38e3287c83f2caa741e994102949c44c8168f516e14e4f0829a6b7" | npx wrangler secret put MOLTBOT_GATEWAY_TOKEN

# Retry Step 3: Account ID
echo "b64e19afc52a492ef6f75408a03df40f" | npx wrangler secret put CF_ACCOUNT_ID
