#!/usr/bin/env bash
set -e
(cd backend && npm run lint -- --fix)
(cd frontend && npm exec next lint -- --fix)
