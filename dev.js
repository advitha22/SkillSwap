import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌟 Starting SkillSwap Full-Stack Application...\n');

// 1. Start backend server
const server = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'server'),
  shell: true,
  stdio: 'inherit'
});

// 2. Start frontend Vite dev server
const client = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  shell: true,
  stdio: 'inherit'
});

function handleExit() {
  console.log('\n🛑 Shutting down SkillSwap services...');
  server.kill();
  client.kill();
  process.exit();
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
