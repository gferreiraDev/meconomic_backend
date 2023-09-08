// interface From {
//   email: string;
//   name: string;
// }

// interface From2 {
//   email: string;
//   name: string;
// }

// interface To {
//   email: string;
//   name: string;
// }

// interface Cc {
//   email: string;
//   name: string;
// }

// interface Bcc {
//   email: string;
//   name: string;
// }

interface Contact {
  email: string;
  name: string;
}

interface Personalization {
  to: Contact[];
  cc?: Contact[];
  bcc?: Contact[];
  from?: Contact;
}

interface Content {
  type: string;
  value: string;
}

interface Attachment {
  content: string;
  filename: string;
  type: string;
  disposition: string;
}

interface Asm {
  group_id: number;
  groups_to_display: number[];
}

interface BypassListManagement {
  enable: boolean;
}

interface Footer {
  enable: boolean;
}

interface SandboxMode {
  enable: boolean;
}

interface MailSettings {
  bypass_list_management: BypassListManagement;
  footer: Footer;
  sandbox_mode: SandboxMode;
}

interface ClickTracking {
  enable: boolean;
  enable_text: boolean;
}

interface OpenTracking {
  enable: boolean;
  substitution_tag: string;
}

interface SubscriptionTracking {
  enable: boolean;
}

interface TrackingSettings {
  click_tracking: ClickTracking;
  open_tracking: OpenTracking;
  subscription_tracking: SubscriptionTracking;
}

export interface IEmail {
  personalizations: Personalization[];
  from: Contact;
  reply_to?: Contact;
  subject: string;
  content: Content[];
  attachments?: Attachment[];
  categories?: string[];
  send_at?: number;
  batch_id?: string;
  asm?: Asm;
  ip_pool_name?: string;
  mail_settings?: MailSettings;
  tracking_settings?: TrackingSettings;
}
