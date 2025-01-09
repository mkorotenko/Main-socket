import { execa } from 'execa';
import path from 'path';

// Вкажіть шлях до вашого проекту
const projectPath = '/home/Main-socket';//path.resolve(__dirname, '/home/Main-socket');

// Функція для виконання команд
async function runCommand(command, args) {
  try {
    const { stdout } = await execa(command, args, { cwd: projectPath });
    console.log(`Stdout: ${stdout}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Отримання останніх змін з віддаленого репозиторію
(async () => {
  await runCommand('git', ['pull', 'origin', 'main']);
  console.log('Files updated from GitHub');
  
  // Перезапуск 
  await runCommand('sudo', ['systemctl', 'daemon-reload']);
 console.log('Service restarted');

  // Перезапуск сервісу
  console.log('Service restarting...');
  runCommand('sudo', ['systemctl', 'restart', 'main-socket.service']);
})();