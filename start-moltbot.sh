#!/bin/bash
set -x
set +e # Do not exit immediately on error

echo "Starting Moltbot Gateway..."
echo "Date: $(date)"
echo "User: $(whoami)"

# Ensure log directory exists
mkdir -p /var/log

# 1. Setup Environment
# (Any specific setup if needed, usually passed via ENV vars)

# 2. Run Clawdbot Gateway
# We use '|| true' to ensure the script continues even if the gateway crashes
# We redirect output to a file for debugging via /debug/file
echo "Launching clawdbot..."
clawdbot gateway --port 18789 --verbose --allow-unconfigured --bind lan --token "$CLAWDBOT_GATEWAY_TOKEN" > /var/log/clawdbot.log 2>&1 || true

EXIT_CODE=$?
echo "Clawdbot exited with code $EXIT_CODE" >> /var/log/clawdbot.log

# 3. Keep Container Alive (Rescue Mode)
# If clawdbot fails, we keep the container running so we can inspect logs.
echo "Entering keep-alive loop..." >> /var/log/clawdbot.log
while true; do
  echo "[RESCUE] Container still alive at $(date)" >> /var/log/clawdbot.log
  sleep 10
done
