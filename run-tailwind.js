#!/usr/bin/env node
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { spawn } from 'child_process'

const require = createRequire(import.meta.url)
const tailwindPath = require.resolve('tailwindcss/lib/cli.js')

spawn('node', [tailwindPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
})
