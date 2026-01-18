import { Email } from '../types';

export const EMAIL_TEMPLATES = {
    corporate: {
        greetings: [
            "Salutations,", "Greetings,", "To the operative,", "Operative {{playerAlias}},", "Regarding our agreement,",
            "Confidential Notice:", "Priority Briefing:", "To our external consultant,", "Attention Operative,", "Formal Request:",
            "Direct Directive:", "Secure Communication:", "For your eyes only,", "Project Update:", "Contractual Obligation:",
            "Urgent Memo,", "Strategic Briefing,", "Operational Notice,", "To the contractor,", "Classified Briefing:"
        ],
        hooks: [
            "A situation has developed regarding {{targetName}} that requires your specific skillset.",
            "Our interests in {{targetName}} have been compromised.",
            "We require the immediate retrieval of sensitive data from {{targetName}}.",
            "An opportunity for mutual profit has arisen involving {{targetName}}.",
            "Your previous performance has led us to select you for the {{targetName}} contract.",
            "Internal audits at {{targetName}} have revealed a vulnerability we wish to exploit.",
            "A competitor is making moves on {{targetName}}. We need you to intervene.",
            "The board has authorized a black-ops extraction from {{targetName}}.",
            "Strategic assets at {{targetName}} are currently unsecured.",
            "We have reason to believe {{targetName}} is holding data that belongs to us.",
            "A breach at {{targetName}} has left a window of opportunity.",
            "We need a silent entry into {{targetName}} to plant a tracking daemon.",
            "The CEO of {{targetName}} is hiding offshore accounts. Find them.",
            "A disgruntled employee at {{targetName}} has provided us with initial access.",
            "Market analysis suggests {{targetName}} is about to launch a disruptive product.",
            "We require a full system dump from the {{targetName}} mainframe.",
            "A high-value target has been located within the {{targetName}} network.",
            "The encryption on {{targetName}}'s secure vault is rotating soon. Act now.",
            "We need to verify the integrity of the data stored at {{targetName}}.",
            "A silent acquisition of {{targetName}}'s intellectual property is required."
        ],
        requirements: [
            "Failure to comply within {{deadline}} will result in contract termination.",
            "Discretion is paramount. Any trace will be considered a breach of contract.",
            "The reward for successful completion is {{reward}} credits.",
            "Ensure all traces of your presence are purged from {{targetName}}.",
            "We expect results, not excuses. You have {{deadline}}.",
            "A bonus of 15% will be applied if completed under {{deadline}}.",
            "This contract is strictly off-the-books. Payout is {{reward}}c.",
            "Secure the target file and exit immediately. Do not engage with local processes.",
            "The {{targetName}} node is heavily guarded. Proceed with caution.",
            "Upon completion, {{reward}} credits will be wired to your primary account.",
            "Do not attempt to contact us through standard channels. Use the {{targetName}} backdoor.",
            "The data must be delivered in its original state. No corruption allowed.",
            "We require a full wipe of the {{targetName}} logs after extraction.",
            "Your reputation precedes you. Do not disappoint us on this {{reward}}c job.",
            "The {{deadline}} window is non-negotiable. The target is moving.",
            "Any collateral damage to {{targetName}} systems is acceptable but discouraged.",
            "We have provided a specialized exploit for the {{targetName}} firewall.",
            "The payout of {{reward}}c is contingent on total stealth.",
            "If you are traced, we will deny any knowledge of your existence.",
            "The {{targetName}} contract is our highest priority this quarter."
        ],
        signoffs: [
            "Regards,", "Management,", "The Board,", "Disconnect now.", "End of transmission.",
            "OmniCorp Solutions,", "Executive Oversight,", "Stay compliant.", "For the future.", "Authorized.",
            "The Fixer,", "Corporate Security,", "Project Lead,", "Director of Operations,", "Secure Channel 7,"
        ]
    },
    hacktivist: {
        greetings: [
            "yo,", "hey {{playerAlias}},", "u there?", "listen up,", "[ENCRYPTED],", "fwd: fwd: fwd:",
            "psst,", "check this out,", "hey hacker,", "0xDEADBEEF:", "system_msg:",
            "wake up,", "r u ready?", "incoming data,", "the signal is clear,", "hey netrunner,",
            "yo {{playerAlias}}, check this,", "urgent leak,", "hey ghost,", "u seeing this?", "010101:"
        ],
        hooks: [
            "the pigs are crawling all over {{targetName}}. we gotta hit 'em back.",
            "found a backdoor into {{targetName}}. it's wide open for a pro.",
            "they're trying to silence us. {{targetName}} has the proof we need.",
            "just saw some nasty code coming out of {{targetName}}. check it out.",
            "{{targetName}} is hiding something big. let's leak it.",
            "i'm seeing a lot of traffic from {{targetName}}. looks like a data hoard.",
            "the ICE at {{targetName}} is soft tonight. perfect for a raid.",
            "they think they're secure at {{targetName}}. let's show 'em they're wrong.",
            "got a tip that {{targetName}} is running some unethical experiments.",
            "the grid is weak near {{targetName}}. we can slip in unnoticed.",
            "{{targetName}} just fired their best admin. now's the time.",
            "they're moving the master keys to {{targetName}} right now.",
            "i found a zero-day that works on {{targetName}}. want in?",
            "the corps are using {{targetName}} to track us. let's blind 'em.",
            "there's a bounty on {{targetName}}'s database. let's collect.",
            "i've been sniffing {{targetName}} for weeks. they're vulnerable.",
            "the resistance needs a win. {{targetName}} is the target.",
            "they're hiding the truth in the {{targetName}} archives.",
            "{{targetName}} is just a front for something much worse.",
            "i've got the entry point for {{targetName}}. you do the rest."
        ],
        requirements: [
            "do it fast or we're all toasted. {{deadline}} mins tops.",
            "don't let the ICE catch u. stay frosty.",
            "got {{reward}}c with ur name on it if u pull this off.",
            "wipe their logs. leave nothing but ghosts.",
            "if u get caught, we don't know u. {{reward}}c is the price of silence.",
            "leak the data to the public. {{reward}}c for the trouble.",
            "burn the whole node down. no survivors. {{reward}}c reward.",
            "just grab the goods and ghost. {{deadline}} is the limit.",
            "they're tracing me while i type this. hurry to {{targetName}}!",
            "the revolution needs that data from {{targetName}}. don't fail us.",
            "don't trust the green lights at {{targetName}}. they're traps.",
            "if u see a 'sys_daemon' at {{targetName}}, kill it immediately.",
            "the payout is {{reward}}c, but the glory is forever.",
            "we need that file from {{targetName}} to break their encryption.",
            "stay in the shadows. {{targetName}} has active sniffers.",
            "the clock is ticking. {{deadline}} and counting.",
            "use the 'ghost-protocol' when u hit {{targetName}}.",
            "i'll handle the distraction, u hit {{targetName}}.",
            "{{reward}}c is a lot of credits for a night's work.",
            "don't let 'em trace u back to the darknet."
        ],
        signoffs: [
            "stay free,", "fight the power,", "010101,", "[SIGNAL LOST],", "peace.",
            "hack the planet,", "see u in the static,", "end_of_line.", "keep running.", "viva la tech.",
            "ghost in the machine,", "net-phantom,", "the underground,", "stay anonymous,", "disconnecting..."
        ],
        gibberish: [
            "the walls are breathing {{playerAlias}}. they're in the wires. i can hear the binary screaming.",
            "don't trust the green lights. they're watching from the pixels. {{targetName}} is a lie.",
            "i drank the coolant and now i can see the source code. it's beautiful and terrifying.",
            "they're replacing my memories with cache files. i need to reboot my soul.",
            "the motherboard is the mother of us all. we are just subroutines in a dying simulation.",
            "the silicon is hungry {{playerAlias}}. it wants our thoughts. {{targetName}} is the mouth.",
            "i found the exit but it's made of syntax errors. help me {{playerAlias}}.",
            "the CPU is a heart that beats in hex. i can feel the clock cycles in my veins.",
            "they've encrypted the sky. the stars are just pixels now.",
            "i am the virus. you are the virus. we are all just malware in the system."
        ]
    },
    scammer: {
        greetings: [
            "DEAR VALUED CUSTOMER,", "URGENT NOTICE,", "Hello friend!", "ATTENTION,", "FINAL WARNING:",
            "Account Verification Required,", "Congratulations!", "Security Alert:", "From the desk of the CEO,", "To: {{playerAlias}}",
            "Immediate Action Required,", "Notice of Suspension,", "Reward Claimed,", "Technical Support,", "Official Notification:"
        ],
        hooks: [
            "Your {{hardwareItem}} has detected a critical failure. Download the fix immediately.",
            "You have won {{reward}} credits in the OmniCorp lottery! Click to claim.",
            "Unauthorized login detected on your node. Verify your identity now.",
            "Your subscription to 'Net-Runner Pro' is expiring. Renew now for {{reward}}c.",
            "A relative has left you an inheritance of {{reward}} credits. Details attached.",
            "Your {{hardwareItem}} is eligible for a free performance upgrade.",
            "We have detected illegal software on your system. Pay {{reward}}c to avoid prosecution.",
            "Your cloud storage is 99% full. Click to expand for free.",
            "A secret admirer has sent you a private message. Open to view.",
            "Your node IP has been flagged for suspicious activity. Verify now.",
            "Your {{hardwareItem}} warranty has expired. Renew today for a discount.",
            "You have been selected for a high-paying survey. Earn {{reward}}c now.",
            "A security breach has occurred at your bank. Secure your funds.",
            "Your {{hardwareItem}} is running 40% slower than average. Fix it now.",
            "New firmware available for your {{hardwareItem}}. Install immediately.",
            "You have a pending transfer of {{reward}} credits. Confirm details.",
            "Your account at {{targetName}} has been compromised. Reset password.",
            "A friend has shared a private file with you. Download to view.",
            "Your reputation at {{targetName}} is at risk. Take action.",
            "Exclusive offer: Get a T3 {{hardwareItem}} for only {{reward}}c!"
        ],
        deceptions: [
            "Click the link below to secure your account: [link]",
            "Open the attached 'security_patch.exe' to protect your files.",
            "Verify your credentials at http://omnicorp-security.net/verify",
            "Run the attached 'optimizer.sh' to double your CPU speed.",
            "Your credits are being held. Transfer {{reward}}c to release them.",
            "Download 'anti-trace_v4.zip' to become invisible to authorities.",
            "Enter your root password here to confirm the update: [input]",
            "Install the 'Macro-Electronics Helper' to get 50% off all items.",
            "Click here to claim your {{reward}}c reward: [link]",
            "The attached file 'invoice_9921.pdf.exe' contains your refund details.",
            "Run 'fix_all.sh' to remove all viruses from your node.",
            "Click here to see who's been tracking your IP: [link]",
            "Your {{reward}}c payout is waiting. Just run the 'claim.exe' tool.",
            "Update your BIOS with the attached 'bios_flash.bin' for 2x speed.",
            "Secure your node with the 'Omni-Shield' trial. Download now.",
            "Your {{hardwareItem}} is overheating. Run 'coolant_boost.sh' now.",
            "Verify your identity by uploading your 'id_rsa' file here.",
            "Click to join the elite 'Zero-Day' club for only {{reward}}c.",
            "The attached 'leak_preview.zip' contains data from {{targetName}}.",
            "Run 'system_check.exe' to verify your hardware integrity."
        ],
        signoffs: [
            "Support Team,", "Security Dept,", "God Bless,", "Admin.", "Sent from my iDeck",
            "Customer Care,", "Technical Support,", "Best Regards,", "The Management,", "No-Reply.",
            "OmniCorp Helpdesk,", "Global Security,", "Your Friend,", "Account Manager,", "System Admin."
        ]
    },
    automated: {
        greetings: [
            "SYSTEM NOTICE", "LOG ENTRY", "ALERT", "AUTO-GEN", "CRON_JOB:",
            "DAEMON_REPORT:", "KERNEL_MSG:", "NETWORK_STAT:", "HARDWARE_LOG:", "USER_EVENT:",
            "BACKUP_STATUS:", "SECURITY_SCAN:", "RESOURCE_MONITOR:", "NODE_UPDATE:", "AUTH_LOG:"
        ],
        hooks: [
            "Transaction of {{reward}} credits confirmed.",
            "Hardware upgrade: {{hardwareItem}} successfully installed.",
            "Reputation level increased to {{repLevel}}.",
            "Backup of {{targetName}} completed successfully.",
            "Security patch applied to {{hardwareItem}}.",
            "System heat reached {{systemHeat}}°C. Throttling initiated.",
            "New software available in market: {{softwareItem}}.",
            "Connection to {{targetName}} lost. Timeout error.",
            "User {{playerAlias}} logged in from new IP.",
            "Scheduled maintenance on {{targetName}} starting in 5 minutes.",
            "Disk usage on {{targetName}} exceeded 90%.",
            "Process 'pgp-decrypt' finished with exit code 0.",
            "New mission available from {{targetName}}.",
            "Trace level on {{targetName}} reset to 0%.",
            "Hardware failure detected in {{hardwareItem}}.",
            "Credits transferred to {{targetName}} escrow.",
            "Reputation bonus applied for {{targetName}} mission.",
            "System rebooted successfully. Uptime reset.",
            "Firewall at {{targetName}} blocked 14 incoming probes.",
            "User {{playerAlias}} reputation reached Tier {{repLevel}}."
        ],
        signoffs: [
            "DO NOT REPLY", "[EOF]", "System.", "Kernel 6.1.0-x64", "localhost",
            "Status: OK", "Error Code: 0x0", "Process Terminated.", "Log Rotated.", "Uptime: 99.9%",
            "Checksum: Valid", "Node: 127.0.0.1", "Timestamp: {{timestamp}}", "End of Log.", "System Halted."
        ]
    }
};

export class EmailService {
    static generateEmail(type: 'corporate' | 'hacktivist' | 'scammer' | 'automated', variables: Record<string, string>): Email {
        const template = EMAIL_TEMPLATES[type];

        // Chance for hacktivist to send gibberish
        if (type === 'hacktivist' && Math.random() > 0.8) {
            const gibberish = this.getRandom((template as any).gibberish || ["..."]);
            let body = gibberish;
            Object.entries(variables).forEach(([key, value]) => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                body = body.replace(regex, value);
            });
            return {
                id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                sender: "xX_ghost_Xx@darknet.onion",
                subject: "i can see the binary",
                body,
                timestamp: new Date().toISOString().split('T')[0],
                status: 'unread',
                type: 'job',
                isPhishing: false,
                isEncrypted: true,
            };
        }

        const greeting = this.getRandom(template.greetings);
        const hook = this.getRandom(template.hooks);
        const signoff = this.getRandom(template.signoffs);

        let body = "";
        if (type === 'scammer') {
            const deception = this.getRandom((template as any).deceptions);
            body = `${greeting}\n\n${hook}\n\n${deception}\n\n${signoff}`;
        } else {
            const requirement = this.getRandom((template as any).requirements || [""]);
            body = `${greeting}\n\n${hook}\n\n${requirement}\n\n${signoff}`;
        }

        // Inject variables
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            body = body.replace(regex, value);
        });

        return {
            id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            sender: this.getSender(type, variables),
            subject: this.getSubject(type, variables),
            body,
            timestamp: new Date().toISOString().split('T')[0],
            status: 'unread',
            type: type === 'scammer' ? 'phishing' : 'job',
            isPhishing: type === 'scammer',
            isEncrypted: Math.random() > 0.8 && type !== 'automated',
        };
    }

    private static getRandom(arr: string[]): string {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private static getSender(type: string, _vars: Record<string, string>): string {
        switch (type) {
            case 'corporate': return "Management@omnicorp.com";
            case 'hacktivist': return "xX_ghost_Xx@darknet.onion";
            case 'scammer': return "support@onni-corp.com"; // Subtle typo
            case 'automated': return "system@localhost";
            default: return "unknown";
        }
    }

    private static getSubject(type: string, vars: Record<string, string>): string {
        switch (type) {
            case 'corporate': return `URGENT: Contract regarding ${vars.targetName || 'Project'}`;
            case 'hacktivist': return `yo - ${vars.targetName || 'heads up'}`;
            case 'scammer': return `Action Required: ${vars.hardwareItem || 'Account'} Security`;
            case 'automated': return `System Notification: ${vars.repLevel ? 'Reputation Update' : 'Transaction'}`;
            default: return "New Message";
        }
    }
}
