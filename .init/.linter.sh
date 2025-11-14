#!/bin/bash
cd /home/kavia/workspace/code-generation/collaborative-design-platform-41634-41643/figma_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

