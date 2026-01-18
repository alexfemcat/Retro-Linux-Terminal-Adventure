export interface ManPage {
    name: string;
    summary: string;
    synopsis: string;
    description: string;
    examples: string[];
}

export const MAN_PAGES: Record<string, ManPage> = {
    'ls': {
        name: 'ls',
        summary: 'list directory contents',
        synopsis: 'ls [OPTION]... [FILE]...',
        description: 'List information about the FILEs (the current directory by default). \n\n[BEGINNER TIP]: Use this to see what files are in your current folder. If you don\'t see anything, try "ls -a" to show hidden files (files starting with a dot).',
        examples: ['ls -a', 'ls -l', 'ls -la']
    },
    'cat': {
        name: 'cat',
        summary: 'concatenate files and print on the standard output',
        synopsis: 'cat [FILE]...',
        description: 'Concatenate FILE(s) to standard output. \n\n[BEGINNER TIP]: This is your primary tool for reading text files. If you find a .txt or .log file, use "cat filename.txt" to see what\'s inside. It\'s essential for finding clues!',
        examples: ['cat todo.txt', 'cat /var/log/system.log']
    },
    'cd': {
        name: 'cd',
        summary: 'change the working directory',
        synopsis: 'cd [DIRECTORY]',
        description: 'Change the current working directory to DIRECTORY. \n\n[BEGINNER TIP]: Use this to move between folders. "cd .." moves you up one level, and "cd ~" takes you back to your home folder. If you see a folder name in blue when you type "ls", you can "cd" into it.',
        examples: ['cd /etc', 'cd ..', 'cd ~']
    },
    'pwd': {
        name: 'pwd',
        summary: 'print name of current/working directory',
        synopsis: 'pwd',
        description: 'Print the full filename of the current working directory.',
        examples: ['pwd']
    },
    'whoami': {
        name: 'whoami',
        summary: 'print effective userid',
        synopsis: 'whoami',
        description: 'Print the user name associated with the current effective user ID.',
        examples: ['whoami']
    },
    'clear': {
        name: 'clear',
        summary: 'clear the terminal screen',
        synopsis: 'clear',
        description: 'clear clears your screen if this is possible, including its scrollback buffer.',
        examples: ['clear']
    },
    'exit': {
        name: 'exit',
        summary: 'cause the shell to exit',
        synopsis: 'exit',
        description: 'Exit the current shell or disconnect from a remote session.',
        examples: ['exit']
    },
    'inv': {
        name: 'inv',
        summary: 'show storage usage and inventory',
        synopsis: 'inv',
        description: 'Displays current disk usage and a list of all files in your local inventory.',
        examples: ['inv']
    },
    'rm': {
        name: 'rm',
        summary: 'remove files or directories',
        synopsis: 'rm [FILE]',
        description: 'rm removes each specified file. By default, it does not remove directories.',
        examples: ['rm old_log.txt']
    },
    'kill': {
        name: 'kill',
        summary: 'terminate a process',
        synopsis: 'kill [PID]',
        description: 'Send a signal to a process, usually to terminate it. Use "ps" to find PIDs.',
        examples: ['kill 1234']
    },
    'echo': {
        name: 'echo',
        summary: 'display a line of text',
        synopsis: 'echo "text" > [FILE]',
        description: 'Write the specified text to a file. In this terminal, it is primarily used for file creation and redirection.',
        examples: ['echo "hello" > greeting.txt']
    },
    'sell': {
        name: 'sell',
        summary: 'sell a file from your inventory',
        synopsis: 'sell [FILE]',
        description: 'Sell a file from your local inventory to the black market for credits. Sensitive files fetch higher prices.',
        examples: ['sell leaked_data.db']
    },
    'tar': {
        name: 'tar',
        summary: 'an archiving utility',
        synopsis: 'tar -cvf [archive.tar] [target]',
        description: 'Create an archive from a file or directory.',
        examples: ['tar -cvf backup.tar /home/user/docs']
    },
    'zip': {
        name: 'zip',
        summary: 'package and compress (archive) files',
        synopsis: 'zip [archive.zip] [target]',
        description: 'Create a compressed zip archive.',
        examples: ['zip logs.zip /var/log']
    },
    'man': {
        name: 'man',
        summary: 'an interface to the system reference manuals',
        synopsis: 'man [COMMAND]',
        description: 'The system\'s manual viewer. \n\n[BEGINNER TIP]: You\'re using it right now! If you ever find a command you don\'t understand, type "man" followed by that command name to get a full breakdown of how it works.',
        examples: ['man ls', 'man nmap']
    },
    'nano': {
        name: 'nano',
        summary: 'Nano\'s ANOther editor, an enhanced free Pico clone',
        synopsis: 'nano [FILE]',
        description: 'A small, free and friendly text editor. \n\n[BEGINNER TIP]: This is how you create your own files or edit existing ones. Type "nano filename.txt", write your text, then press Ctrl+O to save and Ctrl+X to exit. It\'s great for taking notes during a hack!',
        examples: ['nano notes.txt', 'nano ~/.bashrc']
    },
    'alias': {
        name: 'alias',
        summary: 'define or display aliases',
        synopsis: 'alias [name]="[command]"',
        description: 'Create a shortcut for a longer command. Aliases are saved to your ~/.bashrc file.',
        examples: ['alias ll="ls -la"']
    },
    'sh': {
        name: 'sh',
        summary: 'shell command language interpreter',
        synopsis: 'sh [FILE]',
        description: 'Execute commands from a script file.',
        examples: ['sh exploit.sh']
    },
    'theme': {
        name: 'theme',
        summary: 'set terminal theme',
        synopsis: 'theme [theme_name]',
        description: 'Change the visual appearance of the terminal. Requires purchased theme tools in inventory.',
        examples: ['theme green', 'theme amber']
    },
    'settings': {
        name: 'settings',
        summary: 'open settings menu',
        synopsis: 'settings',
        description: 'Opens the terminal configuration menu to adjust font size, effects, and more.',
        examples: ['settings']
    },
    'tutorial': {
        name: 'tutorial',
        summary: 'start the training simulation',
        synopsis: 'tutorial [reset]',
        description: 'Enter the Architect\'s training simulation to learn the basics of hacking and terminal navigation.',
        examples: ['tutorial', 'tutorial reset']
    },
    'browser': {
        name: 'browser',
        summary: 'open the Retro Browser',
        synopsis: 'browser [URL]',
        description: 'Launch the integrated web browser to access the Dark Web, markets, and job boards.',
        examples: ['browser', 'browser market://software']
    },
    'mail': {
        name: 'mail',
        summary: 'open the Email Client',
        synopsis: 'mail',
        description: 'Access your encrypted mailbox for mission briefings and victim responses.',
        examples: ['mail']
    },
    'overclock': {
        name: 'overclock',
        summary: 'toggle CPU overclocking',
        synopsis: 'overclock [on|off]',
        description: 'Increase CPU performance at the cost of significantly higher heat generation.',
        examples: ['overclock on']
    },
    'voltage': {
        name: 'voltage',
        summary: 'set CPU voltage',
        synopsis: 'voltage [value]',
        description: 'Adjust CPU voltage (1.0 - 1.5). Higher voltage allows for faster processing but risks thermal shutdown.',
        examples: ['voltage 1.35']
    },
    'memstat': {
        name: 'memstat',
        summary: 'show memory usage',
        synopsis: 'memstat',
        description: 'Displays detailed RAM allocation and system memory status.',
        examples: ['memstat']
    },
    'abort': {
        name: 'abort',
        summary: 'abandon current mission',
        synopsis: 'abort',
        description: 'Emergency disconnect from a remote mission. All unsaved progress on the target will be lost.',
        examples: ['abort']
    },
    'disconnect': {
        name: 'disconnect',
        summary: 'alias for abort',
        synopsis: 'disconnect',
        description: 'Disconnect from the current remote host.',
        examples: ['disconnect']
    },
    'download': {
        name: 'download',
        summary: 'download file from remote',
        synopsis: 'download [FILE]',
        description: 'Transfer a file from the remote target to your local Homebase inventory.',
        examples: ['download secret.dat']
    },
    'ping': {
        name: 'ping',
        summary: 'check host availability',
        synopsis: 'ping [IP]',
        description: 'Send ICMP ECHO_REQUEST to network hosts to verify connectivity.',
        examples: ['ping 192.168.1.1']
    },
    'ip': {
        name: 'ip',
        summary: 'show network interfaces',
        synopsis: 'ip a',
        description: 'Display IP addresses and network interface information.',
        examples: ['ip a']
    },
    'nmap-lite': {
        name: 'nmap-lite',
        summary: 'basic port scanner',
        synopsis: 'nmap-lite [IP]',
        description: 'A lightweight version of nmap that only shows if ports are open or closed.',
        examples: ['nmap-lite 192.168.1.50']
    },
    'nmap': {
        name: 'nmap',
        summary: 'Network exploration tool and security / port scanner',
        synopsis: 'nmap [IP_ADDRESS] [OPTIONS]',
        description: 'Nmap ("Network Mapper") is used to discover hosts and services on a computer network. \n\n[BEGINNER TIP]: This is your "eyes" on the network. Use it on an IP address to see which "ports" are open. Open ports are like unlocked windows—they tell you which tools (like hydra or msf-exploit) you should use next.',
        examples: ['nmap 192.168.1.1', 'nmap 10.0.0.5 -sV']
    },
    'nmap-pro': {
        name: 'nmap-pro',
        summary: 'advanced OS fingerprinting and version detection',
        synopsis: 'nmap-pro [IP]',
        description: 'Professional grade scanner that identifies OS versions and potential vulnerabilities.',
        examples: ['nmap-pro 192.168.1.100']
    },
    'brute-force.sh': {
        name: 'brute-force.sh',
        summary: 'basic noisy brute-force script',
        synopsis: 'brute-force.sh [user]@[ip]',
        description: 'A simple, high-noise script for attempting to crack SSH logins.',
        examples: ['brute-force.sh root@10.0.0.1']
    },
    'hydra': {
        name: 'hydra',
        summary: 'a very fast network logon cracker',
        synopsis: 'hydra [USER]@[IP] [-P WORDLIST]',
        description: 'A parallelized login cracker. \n\n[BEGINNER TIP]: Use this when you know a username but not the password. It tries thousands of combinations from a "wordlist". You\'ll need to buy wordlists from the market first!',
        examples: ['hydra admin@192.168.1.1 -P common_passwords.tool']
    },
    'ssh-crack-v1': {
        name: 'ssh-crack-v1',
        summary: 'specialized SSH credential harvester',
        synopsis: 'ssh-crack-v1 [user]@[ip]',
        description: 'Advanced tool for exploiting specific SSH vulnerabilities to harvest credentials.',
        examples: ['ssh-crack-v1 user@192.168.1.5']
    },
    'sqlmap': {
        name: 'sqlmap',
        summary: 'automatic SQL injection and database takeover tool',
        synopsis: 'sqlmap [IP]',
        description: 'Automates the process of detecting and exploiting SQL injection flaws. \n\n[BEGINNER TIP]: Use this on targets that have database services. It can "dump" the entire contents of a database, often giving you lists of users and their hashed passwords.',
        examples: ['sqlmap 192.168.1.10']
    },
    'john': {
        name: 'john',
        summary: 'John the Ripper password cracker',
        synopsis: 'john [HASH_FILE]',
        description: 'A fast password cracker for encrypted hashes. \n\n[BEGINNER TIP]: Sometimes you\'ll find "hashes" (scrambled passwords) in databases. "cat" won\'t help you read them, but "john" can crack them open to reveal the plain text password.',
        examples: ['john db_dump.hash']
    },
    'proxy-tunnel': {
        name: 'proxy-tunnel',
        summary: 'encrypted traffic tunneling',
        synopsis: 'proxy-tunnel [IP]',
        description: 'Establish an encrypted tunnel through a compromised host to hide your trace.',
        examples: ['proxy-tunnel 192.168.1.20']
    },
    'msfconsole': {
        name: 'msfconsole',
        summary: 'Metasploit Framework Console',
        synopsis: 'msfconsole',
        description: 'The primary interface to the Metasploit Framework. \n\n[BEGINNER TIP]: This is a heavy-duty exploitation suite. While "msfconsole" itself just opens the interface, it\'s required to run "msf-exploit". Think of it as loading your heavy artillery.',
        examples: ['msfconsole']
    },
    'msf-exploit': {
        name: 'msf-exploit',
        summary: 'Execute a Metasploit module',
        synopsis: 'msf-exploit [IP] [SERVICE]',
        description: 'Execute a Metasploit exploit module against a target. \n\n[BEGINNER TIP]: Once "nmap" tells you a service (like "ssh" or "http") is running on a target, use this command to try and force your way in. It\'s more powerful than hydra but noisier!',
        examples: ['msf-exploit 192.168.1.55 ssh']
    },
    'dist-crack': {
        name: 'dist-crack',
        summary: 'coordinated multi-node brute force',
        synopsis: 'dist-crack [user]@[ip]',
        description: 'Uses multiple compromised nodes to perform a distributed brute force attack, significantly increasing speed.',
        examples: ['dist-crack root@192.168.1.10']
    },
    '0day-pack': {
        name: '0day-pack',
        summary: 'instant-access exploit kit',
        synopsis: '0day-pack [IP]',
        description: 'A collection of unpatched vulnerabilities that provide near-instant root access to most targets.',
        examples: ['0day-pack 192.168.1.200']
    },
    'neuro-crack': {
        name: 'neuro-crack',
        summary: 'AI-driven heuristic encryption bypass',
        synopsis: 'neuro-crack [IP]',
        description: 'Advanced AI tool that uses heuristic patterns to bypass modern encryption. Extremely high heat generation.',
        examples: ['neuro-crack 192.168.1.254']
    },
    'encrypt': {
        name: 'encrypt',
        summary: 'deploy ransomware to encrypt a file/directory',
        synopsis: 'encrypt [file] [ransomware_id]',
        description: 'Deploy a ransomware payload to encrypt target files and demand a credit payout.',
        examples: ['encrypt /var/www/html/index.php cryptolocker_v1']
    },
    'netmap': {
        name: 'netmap',
        summary: 'visualize discovered network nodes',
        synopsis: 'netmap',
        description: 'Displays a topological map of all discovered nodes in the current network.',
        examples: ['netmap']
    },
    'ssh': {
        name: 'ssh',
        summary: 'OpenSSH remote login client',
        synopsis: 'ssh [user]@[ip]',
        description: 'ssh (SSH client) is a program for logging into a remote machine and for executing commands on a remote machine.',
        examples: ['ssh user@192.168.1.55']
    },
    'sudo': {
        name: 'sudo',
        summary: 'execute a command as another user',
        synopsis: 'sudo',
        description: 'sudo allows a permitted user to execute a command as the superuser or another user.',
        examples: ['sudo']
    },
    'grep': {
        name: 'grep',
        summary: 'print lines that match patterns',
        synopsis: 'grep [term] [file]',
        description: 'grep searches for PATTERN in each FILE.',
        examples: ['grep "password" config.php']
    },
    'ps': {
        name: 'ps',
        summary: 'report a snapshot of the current processes',
        synopsis: 'ps aux',
        description: 'ps displays information about a selection of the active processes.',
        examples: ['ps aux']
    },
    'env': {
        name: 'env',
        summary: 'run a program in a modified environment',
        synopsis: 'env',
        description: 'Set each NAME to VALUE in the environment and run COMMAND.',
        examples: ['env']
    },
    'uptime': {
        name: 'uptime',
        summary: 'tell how long the system has been running',
        synopsis: 'uptime',
        description: 'uptime gives a one line display of the following information: the current time, how long the system has been running, and more.',
        examples: ['uptime']
    },
    'date': {
        name: 'date',
        summary: 'print or set the system date and time',
        synopsis: 'date',
        description: 'Display the current time in the given FORMAT, or set the system date.',
        examples: ['date']
    },
    'sleep': {
        name: 'sleep',
        summary: 'delay for a specified amount of time',
        synopsis: 'sleep',
        description: 'In this system, sleep advances the game clock by 24 hours.',
        examples: ['sleep']
    }

};
