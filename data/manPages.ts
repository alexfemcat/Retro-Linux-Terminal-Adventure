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
        description: 'List information about the FILEs (the current directory by default). Sort entries alphabetically if none of -cftuvSUX nor --sort is specified.',
        examples: ['ls -a', 'ls -l', 'ls -la']
    },
    'cat': {
        name: 'cat',
        summary: 'concatenate files and print on the standard output',
        synopsis: 'cat [FILE]...',
        description: 'Concatenate FILE(s) to standard output. In this terminal, it is primarily used to read the contents of text files and logs.',
        examples: ['cat todo.txt', 'cat /var/log/system.log']
    },
    'cd': {
        name: 'cd',
        summary: 'change the working directory',
        synopsis: 'cd [DIRECTORY]',
        description: 'Change the current working directory to DIRECTORY. The default DIRECTORY is the value of the HOME shell variable.',
        examples: ['cd /etc', 'cd ..', 'cd ~']
    },
    'nmap': {
        name: 'nmap',
        summary: 'Network exploration tool and security / port scanner',
        synopsis: 'nmap [IP_ADDRESS] [OPTIONS]',
        description: 'Nmap ("Network Mapper") is an open source tool for network exploration and security auditing. It is used to discover hosts and services on a computer network by sending packets and analyzing the responses.',
        examples: ['nmap 192.168.1.1', 'nmap 10.0.0.5 -sV']
    },
    'msfconsole': {
        name: 'msfconsole',
        summary: 'Metasploit Framework Console',
        synopsis: 'msfconsole',
        description: 'The msfconsole is the primary interface to the Metasploit Framework. It provides an all-in-one interface to all the options available in the MSF. It is used to search for exploits and manage sessions.',
        examples: ['msfconsole']
    },
    'msf-exploit': {
        name: 'msf-exploit',
        summary: 'Execute a Metasploit module',
        synopsis: 'msf-exploit [IP] [SERVICE]',
        description: 'A specialized command to execute a Metasploit exploit module against a target IP and service. Requires msfconsole to be installed.',
        examples: ['msf-exploit 192.168.1.55 ssh']
    },
    'hydra': {
        name: 'hydra',
        summary: 'a very fast network logon cracker',
        synopsis: 'hydra [USER]@[IP] [-P WORDLIST]',
        description: 'Hydra is a parallelized login cracker which supports numerous protocols to attack. It is very fast and flexible, and new modules are easy to add.',
        examples: ['hydra admin@192.168.1.1 -P common_passwords.tool']
    },
    'john': {
        name: 'john',
        summary: 'John the Ripper password cracker',
        synopsis: 'john [HASH_FILE]',
        description: 'John the Ripper is a fast password cracker, currently available for many flavors of Unix, Windows, DOS, BeOS, and OpenVMS. Its primary purpose is to detect weak Unix passwords.',
        examples: ['john db_dump.hash']
    },
    'sqlmap': {
        name: 'sqlmap',
        summary: 'automatic SQL injection and database takeover tool',
        synopsis: 'sqlmap [IP]',
        description: 'sqlmap is an open source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws and taking over of database servers.',
        examples: ['sqlmap 192.168.1.10']
    },
    'nano': {
        name: 'nano',
        summary: 'Nano\'s ANOther editor, an enhanced free Pico clone',
        synopsis: 'nano [FILE]',
        description: 'nano is a small, free and friendly editor which aims to replace Pico, the default editor included in the non-free Pine package.',
        examples: ['nano notes.txt', 'nano ~/.bashrc']
    },
    'man': {
        name: 'man',
        summary: 'an interface to the system reference manuals',
        synopsis: 'man [COMMAND]',
        description: 'man is the system\'s manual viewer. Each argument given to man is normally the name of a program, utility or function.',
        examples: ['man ls', 'man nmap']
    }
};
