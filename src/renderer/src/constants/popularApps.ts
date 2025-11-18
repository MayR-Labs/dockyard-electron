/**
 * Popular Apps Constants
 * Comprehensive catalog of popular web applications organized by category and suite
 * Single Responsibility: Store popular app configuration data
 */

export type AppCategory =
  | 'Accounting & Finance'
  | 'Advertising & Marketing'
  | 'Administration'
  | 'Artificial Intelligence'
  | 'Blogging & Writing'
  | 'Calendar & Scheduling'
  | 'Voice & Video Calls'
  | 'Customer Support'
  | 'Design Suites'
  | 'eCommerce'
  | 'Educational'
  | 'Email'
  | 'Focus & Productivity'
  | 'IDE & Coding Resources'
  | 'Messaging & Social'
  | 'Misc'
  | 'Music'
  | 'Notes & Whiteboards'
  | 'Product Management'
  | 'Cloud Storage'
  | 'Streaming Platforms'
  | 'Task Management';

export type AppSuite = 'Apple' | 'Google' | 'MayR Labs' | 'Microsoft' | 'Zoho' | null;

export interface PopularApp {
  name: string;
  url: string;
  logo_url: string;
  description: string;
  categories: AppCategory[];
  suite?: AppSuite;
}

export const POPULAR_APPS: PopularApp[] = [
  // Google Suite
  {
    name: 'Gmail',
    url: 'https://mail.google.com',
    logo_url: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    description: 'Email service by Google with powerful search and organization',
    categories: ['Email'],
    suite: 'Google',
  },
  {
    name: 'Google Calendar',
    url: 'https://calendar.google.com',
    logo_url: 'https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_1.ico',
    description: 'Schedule and manage events, meetings, and reminders',
    categories: ['Calendar & Scheduling'],
    suite: 'Google',
  },
  {
    name: 'Google Drive',
    url: 'https://drive.google.com',
    logo_url: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
    description: 'Cloud storage and file synchronization service',
    categories: ['Cloud Storage'],
    suite: 'Google',
  },
  {
    name: 'Google Docs',
    url: 'https://docs.google.com',
    logo_url: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    description: 'Online word processor for creating and editing documents',
    categories: ['Blogging & Writing', 'Focus & Productivity'],
    suite: 'Google',
  },
  {
    name: 'Google Sheets',
    url: 'https://sheets.google.com',
    logo_url: 'https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico',
    description: 'Online spreadsheet application for data analysis',
    categories: ['Accounting & Finance', 'Focus & Productivity'],
    suite: 'Google',
  },
  {
    name: 'Google Slides',
    url: 'https://slides.google.com',
    logo_url: 'https://ssl.gstatic.com/docs/presentations/images/favicon5.ico',
    description: 'Create and edit presentations online',
    categories: ['Focus & Productivity'],
    suite: 'Google',
  },
  {
    name: 'Google Meet',
    url: 'https://meet.google.com',
    logo_url:
      'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png',
    description: 'Video conferencing and online meetings',
    categories: ['Voice & Video Calls'],
    suite: 'Google',
  },
  {
    name: 'Google Chat',
    url: 'https://chat.google.com',
    logo_url: 'https://www.gstatic.com/images/branding/product/2x/chat_2020q4_48dp.png',
    description: 'Team messaging and collaboration platform',
    categories: ['Messaging & Social'],
    suite: 'Google',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    logo_url: 'https://www.youtube.com/favicon.ico',
    description: 'Video sharing and streaming platform',
    categories: ['Streaming Platforms'],
    suite: 'Google',
  },
  {
    name: 'YouTube Music',
    url: 'https://music.youtube.com',
    logo_url: 'https://music.youtube.com/img/favicon_144.png',
    description: 'Music streaming service by Google',
    categories: ['Music', 'Streaming Platforms'],
    suite: 'Google',
  },

  // Microsoft Suite
  {
    name: 'Outlook',
    url: 'https://outlook.office.com',
    logo_url: 'https://res.cdn.office.net/assets/mail/images/favicon_outlook_web.ico',
    description: 'Email and calendar service by Microsoft',
    categories: ['Email', 'Calendar & Scheduling'],
    suite: 'Microsoft',
  },
  {
    name: 'Microsoft Teams',
    url: 'https://teams.microsoft.com',
    logo_url: 'https://statics.teams.cdn.office.net/hashedassets/favicon/prod/favicon.ico',
    description: 'Team collaboration and video conferencing platform',
    categories: ['Voice & Video Calls', 'Messaging & Social'],
    suite: 'Microsoft',
  },
  {
    name: 'OneDrive',
    url: 'https://onedrive.live.com',
    logo_url: 'https://onedrive.live.com/favicon.ico',
    description: 'Cloud storage service by Microsoft',
    categories: ['Cloud Storage'],
    suite: 'Microsoft',
  },
  {
    name: 'Microsoft To Do',
    url: 'https://to-do.office.com',
    logo_url: 'https://to-do.cdn.office.net/production/assets/favicon.ico',
    description: 'Task management and to-do lists',
    categories: ['Task Management'],
    suite: 'Microsoft',
  },
  {
    name: 'OneNote',
    url: 'https://www.onenote.com/notebooks',
    logo_url: 'https://www.onenote.com/favicon.ico',
    description: 'Digital note-taking application',
    categories: ['Notes & Whiteboards'],
    suite: 'Microsoft',
  },
  {
    name: 'Excel Online',
    url: 'https://www.office.com/launch/excel',
    logo_url: 'https://res.cdn.office.net/assets/mail/file-icon/png/xlsx_16x16.png',
    description: 'Online spreadsheet application',
    categories: ['Accounting & Finance', 'Focus & Productivity'],
    suite: 'Microsoft',
  },
  {
    name: 'Word Online',
    url: 'https://www.office.com/launch/word',
    logo_url: 'https://res.cdn.office.net/assets/mail/file-icon/png/docx_16x16.png',
    description: 'Online word processing application',
    categories: ['Blogging & Writing', 'Focus & Productivity'],
    suite: 'Microsoft',
  },
  {
    name: 'PowerPoint Online',
    url: 'https://www.office.com/launch/powerpoint',
    logo_url: 'https://res.cdn.office.net/assets/mail/file-icon/png/pptx_16x16.png',
    description: 'Online presentation software',
    categories: ['Focus & Productivity'],
    suite: 'Microsoft',
  },

  // Apple Suite
  {
    name: 'iCloud Mail',
    url: 'https://www.icloud.com/mail',
    logo_url: 'https://www.icloud.com/favicon.ico',
    description: 'Email service by Apple',
    categories: ['Email'],
    suite: 'Apple',
  },
  {
    name: 'iCloud Calendar',
    url: 'https://www.icloud.com/calendar',
    logo_url: 'https://www.icloud.com/favicon.ico',
    description: 'Calendar application by Apple',
    categories: ['Calendar & Scheduling'],
    suite: 'Apple',
  },
  {
    name: 'iCloud Drive',
    url: 'https://www.icloud.com/iclouddrive',
    logo_url: 'https://www.icloud.com/favicon.ico',
    description: 'Cloud storage service by Apple',
    categories: ['Cloud Storage'],
    suite: 'Apple',
  },
  {
    name: 'iCloud Notes',
    url: 'https://www.icloud.com/notes',
    logo_url: 'https://www.icloud.com/favicon.ico',
    description: 'Note-taking app by Apple',
    categories: ['Notes & Whiteboards'],
    suite: 'Apple',
  },
  {
    name: 'iCloud Reminders',
    url: 'https://www.icloud.com/reminders',
    logo_url: 'https://www.icloud.com/favicon.ico',
    description: 'Task and reminder management by Apple',
    categories: ['Task Management'],
    suite: 'Apple',
  },

  // Zoho Suite
  {
    name: 'Zoho Mail',
    url: 'https://mail.zoho.com',
    logo_url: 'https://www.zoho.com/favicon.ico',
    description: 'Business email hosting service',
    categories: ['Email'],
    suite: 'Zoho',
  },
  {
    name: 'Zoho CRM',
    url: 'https://crm.zoho.com',
    logo_url: 'https://www.zoho.com/favicon.ico',
    description: 'Customer relationship management software',
    categories: ['Customer Support', 'Administration'],
    suite: 'Zoho',
  },
  {
    name: 'Zoho Projects',
    url: 'https://projects.zoho.com',
    logo_url: 'https://www.zoho.com/favicon.ico',
    description: 'Project management and collaboration',
    categories: ['Product Management', 'Task Management'],
    suite: 'Zoho',
  },
  {
    name: 'Zoho Meeting',
    url: 'https://meeting.zoho.com',
    logo_url: 'https://www.zoho.com/favicon.ico',
    description: 'Online meeting and webinar platform',
    categories: ['Voice & Video Calls'],
    suite: 'Zoho',
  },

  // Communication & Messaging
  {
    name: 'Slack',
    url: 'https://app.slack.com',
    logo_url: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
    description: 'Team communication and collaboration platform',
    categories: ['Messaging & Social'],
  },
  {
    name: 'Discord',
    url: 'https://discord.com/app',
    logo_url: 'https://discord.com/assets/favicon.ico',
    description: 'Voice, video, and text chat for communities',
    categories: ['Messaging & Social', 'Voice & Video Calls'],
  },
  {
    name: 'Telegram',
    url: 'https://web.telegram.org',
    logo_url: 'https://web.telegram.org/favicon.ico',
    description: 'Cloud-based instant messaging service',
    categories: ['Messaging & Social'],
  },
  {
    name: 'WhatsApp',
    url: 'https://web.whatsapp.com',
    logo_url: 'https://static.whatsapp.net/rsrc.php/v3/y7/r/DSxOAUB0raA.png',
    description: 'Messaging and voice/video calling',
    categories: ['Messaging & Social', 'Voice & Video Calls'],
  },
  {
    name: 'Zoom',
    url: 'https://zoom.us',
    logo_url: 'https://st1.zoom.us/static/6.3.11058/image/new/favicon/favicon-96x96.png',
    description: 'Video conferencing and online meetings',
    categories: ['Voice & Video Calls'],
  },
  {
    name: 'Skype',
    url: 'https://web.skype.com',
    logo_url: 'https://secure.skypeassets.com/content/dam/scom/favicons/favicon-32x32.png',
    description: 'Video chat and voice call service',
    categories: ['Voice & Video Calls', 'Messaging & Social'],
  },

  // Productivity & Task Management
  {
    name: 'Notion',
    url: 'https://notion.so',
    logo_url: 'https://www.notion.so/images/favicon.ico',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases',
    categories: ['Notes & Whiteboards', 'Task Management', 'Focus & Productivity'],
  },
  {
    name: 'Trello',
    url: 'https://trello.com',
    logo_url: 'https://trello.com/favicon.ico',
    description: 'Visual project management with boards and cards',
    categories: ['Task Management', 'Product Management'],
  },
  {
    name: 'Asana',
    url: 'https://app.asana.com',
    logo_url: 'https://assets.asana.biz/m/1979cd4145cb5c8d/original/favicon.ico',
    description: 'Work management platform for teams',
    categories: ['Task Management', 'Product Management'],
  },
  {
    name: 'Monday.com',
    url: 'https://monday.com',
    logo_url:
      'https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/favicon/apple-icon-76x76.png',
    description: 'Work operating system for team collaboration',
    categories: ['Product Management', 'Task Management'],
  },
  {
    name: 'ClickUp',
    url: 'https://app.clickup.com',
    logo_url: 'https://app.clickup.com/assets/images/brand/favicon.png',
    description: 'All-in-one productivity platform',
    categories: ['Task Management', 'Product Management', 'Focus & Productivity'],
  },
  {
    name: 'Todoist',
    url: 'https://todoist.com/app',
    logo_url: 'https://todoist.com/favicon.ico',
    description: 'Task manager and to-do list app',
    categories: ['Task Management'],
  },
  {
    name: 'Airtable',
    url: 'https://airtable.com',
    logo_url: 'https://airtable.com/images/favicon/favicon-32x32.png',
    description: 'Cloud collaboration service with spreadsheet-database hybrid',
    categories: ['Product Management', 'Focus & Productivity'],
  },
  {
    name: 'Basecamp',
    url: 'https://basecamp.com',
    logo_url: 'https://basecamp.com/favicon.ico',
    description: 'Project management and team collaboration',
    categories: ['Product Management', 'Task Management'],
  },

  // Note-Taking & Whiteboards
  {
    name: 'Evernote',
    url: 'https://www.evernote.com',
    logo_url: 'https://evernote.com/favicon.ico',
    description: 'Note taking and organization application',
    categories: ['Notes & Whiteboards'],
  },
  {
    name: 'Obsidian Sync',
    url: 'https://obsidian.md',
    logo_url: 'https://obsidian.md/favicon.ico',
    description: 'Knowledge base and note-taking with markdown',
    categories: ['Notes & Whiteboards'],
  },
  {
    name: 'Miro',
    url: 'https://miro.com',
    logo_url: 'https://miro.com/favicon.ico',
    description: 'Online collaborative whiteboard platform',
    categories: ['Notes & Whiteboards', 'Product Management'],
  },
  {
    name: 'Mural',
    url: 'https://www.mural.co',
    logo_url: 'https://www.mural.co/favicon.ico',
    description: 'Digital workspace for visual collaboration',
    categories: ['Notes & Whiteboards'],
  },
  {
    name: 'Excalidraw',
    url: 'https://excalidraw.com',
    logo_url: 'https://excalidraw.com/favicon.ico',
    description: 'Virtual whiteboard for sketching hand-drawn diagrams',
    categories: ['Notes & Whiteboards'],
  },

  // Development & Coding
  {
    name: 'GitHub',
    url: 'https://github.com',
    logo_url: 'https://github.githubassets.com/favicons/favicon.svg',
    description: 'Code hosting platform for version control and collaboration',
    categories: ['IDE & Coding Resources'],
  },
  {
    name: 'GitLab',
    url: 'https://gitlab.com',
    logo_url:
      'https://gitlab.com/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png',
    description: 'DevOps platform with Git repository management',
    categories: ['IDE & Coding Resources'],
  },
  {
    name: 'Bitbucket',
    url: 'https://bitbucket.org',
    logo_url: 'https://bitbucket.org/favicon.ico',
    description: 'Git-based source code repository hosting service',
    categories: ['IDE & Coding Resources'],
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    logo_url: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
    description: 'Q&A community for programmers',
    categories: ['IDE & Coding Resources'],
  },
  {
    name: 'CodePen',
    url: 'https://codepen.io',
    logo_url:
      'https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico',
    description: 'Online code editor and development environment',
    categories: ['IDE & Coding Resources'],
  },
  {
    name: 'Replit',
    url: 'https://replit.com',
    logo_url: 'https://replit.com/public/images/favicon.ico',
    description: 'Online IDE and collaborative coding platform',
    categories: ['IDE & Coding Resources'],
  },
  {
    name: 'JSFiddle',
    url: 'https://jsfiddle.net',
    logo_url: 'https://jsfiddle.net/favicon.png',
    description: 'Online JavaScript, CSS, and HTML playground',
    categories: ['IDE & Coding Resources'],
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com',
    logo_url: 'https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico',
    description: 'Platform for frontend frameworks and static sites',
    categories: ['IDE & Coding Resources'],
  },
  {
    name: 'Netlify',
    url: 'https://app.netlify.com',
    logo_url: 'https://www.netlify.com/favicon.ico',
    description: 'Platform for web applications and static websites',
    categories: ['IDE & Coding Resources'],
  },

  // Design Tools
  {
    name: 'Figma',
    url: 'https://www.figma.com',
    logo_url: 'https://static.figma.com/app/icon/1/favicon.png',
    description: 'Collaborative interface design tool',
    categories: ['Design Suites'],
  },
  {
    name: 'Canva',
    url: 'https://www.canva.com',
    logo_url: 'https://static.canva.com/web/images/favicon.ico',
    description: 'Graphic design platform for creating visual content',
    categories: ['Design Suites'],
  },
  {
    name: 'Adobe Creative Cloud',
    url: 'https://www.adobe.com/creativecloud.html',
    logo_url: 'https://www.adobe.com/favicon.ico',
    description: 'Suite of creative applications and services',
    categories: ['Design Suites'],
  },
  {
    name: 'InVision',
    url: 'https://www.invisionapp.com',
    logo_url: 'https://www.invisionapp.com/favicon.ico',
    description: 'Digital product design platform',
    categories: ['Design Suites'],
  },
  {
    name: 'Sketch Cloud',
    url: 'https://www.sketch.com',
    logo_url: 'https://www.sketch.com/favicon.ico',
    description: 'Design toolkit and collaboration platform',
    categories: ['Design Suites'],
  },

  // Social Media
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com',
    logo_url: 'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
    description: 'Professional networking platform',
    categories: ['Messaging & Social'],
  },
  {
    name: 'Twitter / X',
    url: 'https://twitter.com',
    logo_url: 'https://abs.twimg.com/favicons/twitter.3.ico',
    description: 'Social media platform for microblogging',
    categories: ['Messaging & Social'],
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com',
    logo_url: 'https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico',
    description: 'Social networking service',
    categories: ['Messaging & Social'],
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com',
    logo_url: 'https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png',
    description: 'Photo and video sharing social network',
    categories: ['Messaging & Social'],
  },
  {
    name: 'Reddit',
    url: 'https://www.reddit.com',
    logo_url: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png',
    description: 'Social news aggregation and discussion',
    categories: ['Messaging & Social'],
  },
  {
    name: 'Mastodon',
    url: 'https://joinmastodon.org',
    logo_url: 'https://joinmastodon.org/favicon.ico',
    description: 'Decentralized social network',
    categories: ['Messaging & Social'],
  },

  // Customer Support
  {
    name: 'Zendesk',
    url: 'https://www.zendesk.com',
    logo_url: 'https://www.zendesk.com/favicon.ico',
    description: 'Customer service software and support ticketing',
    categories: ['Customer Support'],
  },
  {
    name: 'Intercom',
    url: 'https://www.intercom.com',
    logo_url: 'https://www.intercom.com/favicon.ico',
    description: 'Customer messaging platform',
    categories: ['Customer Support', 'Messaging & Social'],
  },
  {
    name: 'Freshdesk',
    url: 'https://freshdesk.com',
    logo_url: 'https://www.freshworks.com/favicon.ico',
    description: 'Cloud-based customer support software',
    categories: ['Customer Support'],
  },
  {
    name: 'Help Scout',
    url: 'https://www.helpscout.com',
    logo_url: 'https://www.helpscout.com/favicon.ico',
    description: 'Help desk software for customer support teams',
    categories: ['Customer Support'],
  },

  // Accounting & Finance
  {
    name: 'QuickBooks Online',
    url: 'https://quickbooks.intuit.com',
    logo_url: 'https://quickbooks.intuit.com/favicon.ico',
    description: 'Accounting software for small businesses',
    categories: ['Accounting & Finance'],
  },
  {
    name: 'Xero',
    url: 'https://www.xero.com',
    logo_url: 'https://www.xero.com/favicon.ico',
    description: 'Online accounting software',
    categories: ['Accounting & Finance'],
  },
  {
    name: 'Wave',
    url: 'https://www.waveapps.com',
    logo_url: 'https://www.waveapps.com/favicon.ico',
    description: 'Free accounting and invoicing software',
    categories: ['Accounting & Finance'],
  },
  {
    name: 'FreshBooks',
    url: 'https://www.freshbooks.com',
    logo_url: 'https://www.freshbooks.com/favicon.ico',
    description: 'Cloud-based accounting software',
    categories: ['Accounting & Finance'],
  },
  {
    name: 'Stripe',
    url: 'https://dashboard.stripe.com',
    logo_url: 'https://stripe.com/favicon.ico',
    description: 'Online payment processing platform',
    categories: ['Accounting & Finance', 'eCommerce'],
  },
  {
    name: 'PayPal',
    url: 'https://www.paypal.com',
    logo_url: 'https://www.paypalobjects.com/webstatic/icon/favicon.ico',
    description: 'Online payment system',
    categories: ['Accounting & Finance', 'eCommerce'],
  },

  // eCommerce
  {
    name: 'Shopify',
    url: 'https://www.shopify.com',
    logo_url:
      'https://cdn.shopify.com/shopifycloud/brochure/assets/favicon-48d5e347d2e17e3b02b4e0e5c9bc8b1b.png',
    description: 'E-commerce platform for online stores',
    categories: ['eCommerce'],
  },
  {
    name: 'WooCommerce',
    url: 'https://woocommerce.com',
    logo_url: 'https://woocommerce.com/wp-content/themes/woo/images/favicon.ico',
    description: 'E-commerce plugin for WordPress',
    categories: ['eCommerce'],
  },
  {
    name: 'BigCommerce',
    url: 'https://www.bigcommerce.com',
    logo_url: 'https://www.bigcommerce.com/favicon.ico',
    description: 'E-commerce platform for growing businesses',
    categories: ['eCommerce'],
  },
  {
    name: 'Etsy',
    url: 'https://www.etsy.com',
    logo_url: 'https://www.etsy.com/images/favicon.ico',
    description: 'Marketplace for handmade and vintage items',
    categories: ['eCommerce'],
  },

  // Marketing & Advertising
  {
    name: 'HubSpot',
    url: 'https://www.hubspot.com',
    logo_url: 'https://www.hubspot.com/hubfs/HubSpot_Logos/favicon.ico',
    description: 'Inbound marketing, sales, and service software',
    categories: ['Advertising & Marketing', 'Customer Support'],
  },
  {
    name: 'Mailchimp',
    url: 'https://mailchimp.com',
    logo_url: 'https://mailchimp.com/release/plums/cxp/images/apple-touch-icon-192.ce8f3e6d.png',
    description: 'Email marketing and automation platform',
    categories: ['Advertising & Marketing'],
  },
  {
    name: 'Buffer',
    url: 'https://buffer.com',
    logo_url: 'https://buffer.com/static/icons/favicon.ico',
    description: 'Social media management platform',
    categories: ['Advertising & Marketing'],
  },
  {
    name: 'Hootsuite',
    url: 'https://hootsuite.com',
    logo_url: 'https://hootsuite.com/favicon.ico',
    description: 'Social media management dashboard',
    categories: ['Advertising & Marketing'],
  },
  {
    name: 'Canva for Marketing',
    url: 'https://www.canva.com',
    logo_url: 'https://static.canva.com/web/images/favicon.ico',
    description: 'Design platform for marketing materials',
    categories: ['Advertising & Marketing', 'Design Suites'],
  },

  // Blogging & Writing
  {
    name: 'Medium',
    url: 'https://medium.com',
    logo_url:
      'https://cdn-static-1.medium.com/_/fp/icons/favicon-rebrand-medium.3Y6xpZ-0FSdWDnPM3hSBIA.ico',
    description: 'Online publishing platform',
    categories: ['Blogging & Writing'],
  },
  {
    name: 'WordPress.com',
    url: 'https://wordpress.com',
    logo_url: 'https://s0.wp.com/i/favicon.ico',
    description: 'Website and blog hosting platform',
    categories: ['Blogging & Writing'],
  },
  {
    name: 'Substack',
    url: 'https://substack.com',
    logo_url: 'https://substack.com/favicon.ico',
    description: 'Newsletter publishing platform',
    categories: ['Blogging & Writing'],
  },
  {
    name: 'Ghost',
    url: 'https://ghost.org',
    logo_url: 'https://ghost.org/favicon.ico',
    description: 'Professional publishing platform',
    categories: ['Blogging & Writing'],
  },
  {
    name: 'Grammarly',
    url: 'https://app.grammarly.com',
    logo_url:
      'https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/favicon.svg',
    description: 'Writing assistant for grammar and spelling',
    categories: ['Blogging & Writing'],
  },

  // Music & Audio
  {
    name: 'Spotify',
    url: 'https://open.spotify.com',
    logo_url: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png',
    description: 'Music streaming service',
    categories: ['Music', 'Streaming Platforms'],
  },
  {
    name: 'Apple Music',
    url: 'https://music.apple.com',
    logo_url: 'https://music.apple.com/favicon.ico',
    description: 'Music streaming service by Apple',
    categories: ['Music', 'Streaming Platforms'],
    suite: 'Apple',
  },
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com',
    logo_url: 'https://soundcloud.com/favicon.ico',
    description: 'Audio distribution platform and music sharing',
    categories: ['Music', 'Streaming Platforms'],
  },
  {
    name: 'Bandcamp',
    url: 'https://bandcamp.com',
    logo_url: 'https://bandcamp.com/favicon.ico',
    description: 'Music commerce platform for artists',
    categories: ['Music', 'eCommerce'],
  },

  // Streaming Platforms
  {
    name: 'Netflix',
    url: 'https://www.netflix.com',
    logo_url: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
    description: 'Streaming service for movies and TV shows',
    categories: ['Streaming Platforms'],
  },
  {
    name: 'Twitch',
    url: 'https://www.twitch.tv',
    logo_url: 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png',
    description: 'Live streaming platform for gamers',
    categories: ['Streaming Platforms'],
  },
  {
    name: 'Disney+',
    url: 'https://www.disneyplus.com',
    logo_url: 'https://www.disneyplus.com/favicon.ico',
    description: 'Streaming service for Disney content',
    categories: ['Streaming Platforms'],
  },
  {
    name: 'Vimeo',
    url: 'https://vimeo.com',
    logo_url: 'https://f.vimeocdn.com/images_v6/favicon.ico',
    description: 'Video hosting and sharing platform',
    categories: ['Streaming Platforms'],
  },

  // Educational
  {
    name: 'Coursera',
    url: 'https://www.coursera.org',
    logo_url: 'https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-v2-32x32.png',
    description: 'Online learning platform with courses from universities',
    categories: ['Educational'],
  },
  {
    name: 'Udemy',
    url: 'https://www.udemy.com',
    logo_url: 'https://www.udemy.com/staticx/udemy/images/v7/favicon-32x32.png',
    description: 'Online learning and teaching marketplace',
    categories: ['Educational'],
  },
  {
    name: 'Khan Academy',
    url: 'https://www.khanacademy.org',
    logo_url: 'https://www.khanacademy.org/favicon.ico',
    description: 'Free online education platform',
    categories: ['Educational'],
  },
  {
    name: 'edX',
    url: 'https://www.edx.org',
    logo_url: 'https://www.edx.org/favicon.ico',
    description: 'Online courses from universities',
    categories: ['Educational'],
  },
  {
    name: 'Duolingo',
    url: 'https://www.duolingo.com',
    logo_url: 'https://d35aaqx5ub95lt.cloudfront.net/favicon.ico',
    description: 'Language learning platform',
    categories: ['Educational'],
  },
  {
    name: 'Codecademy',
    url: 'https://www.codecademy.com',
    logo_url: 'https://www.codecademy.com/favicon.ico',
    description: 'Interactive platform for learning coding',
    categories: ['Educational', 'IDE & Coding Resources'],
  },

  // AI Tools
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    logo_url: 'https://chat.openai.com/favicon.ico',
    description: 'AI-powered conversational assistant',
    categories: ['Artificial Intelligence'],
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    logo_url: 'https://claude.ai/favicon.ico',
    description: 'AI assistant by Anthropic',
    categories: ['Artificial Intelligence'],
  },
  {
    name: 'Midjourney',
    url: 'https://www.midjourney.com',
    logo_url: 'https://www.midjourney.com/favicon.ico',
    description: 'AI-powered image generation',
    categories: ['Artificial Intelligence', 'Design Suites'],
  },
  {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai',
    logo_url: 'https://www.perplexity.ai/favicon.ico',
    description: 'AI-powered search and answer engine',
    categories: ['Artificial Intelligence'],
  },
  {
    name: 'Notion AI',
    url: 'https://www.notion.so/product/ai',
    logo_url: 'https://www.notion.so/images/favicon.ico',
    description: 'AI-powered writing and productivity assistant',
    categories: ['Artificial Intelligence', 'Focus & Productivity'],
  },

  // Calendar & Scheduling
  {
    name: 'Calendly',
    url: 'https://calendly.com',
    logo_url:
      'https://assets.calendly.com/packs/frontend/media/icon-32x32-9c3218e8faf0ae6e8e90.png',
    description: 'Meeting scheduling automation',
    categories: ['Calendar & Scheduling'],
  },
  {
    name: 'Cal.com',
    url: 'https://cal.com',
    logo_url: 'https://cal.com/favicon.ico',
    description: 'Open-source scheduling infrastructure',
    categories: ['Calendar & Scheduling'],
  },
  {
    name: 'Doodle',
    url: 'https://doodle.com',
    logo_url: 'https://doodle.com/favicon.ico',
    description: 'Meeting scheduling and polling',
    categories: ['Calendar & Scheduling'],
  },

  // Administration
  {
    name: 'Dropbox',
    url: 'https://www.dropbox.com',
    logo_url: 'https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico',
    description: 'Cloud storage and file synchronization',
    categories: ['Cloud Storage', 'Administration'],
  },
  {
    name: 'Box',
    url: 'https://www.box.com',
    logo_url: 'https://www.box.com/favicon.ico',
    description: 'Cloud content management and file sharing',
    categories: ['Cloud Storage', 'Administration'],
  },
  {
    name: 'Notion Team',
    url: 'https://www.notion.so',
    logo_url: 'https://www.notion.so/images/favicon.ico',
    description: 'Team workspace and knowledge management',
    categories: ['Administration', 'Focus & Productivity'],
  },

  // Miscellaneous
  {
    name: 'Wikipedia',
    url: 'https://www.wikipedia.org',
    logo_url: 'https://www.wikipedia.org/static/favicon/wikipedia.ico',
    description: 'Free online encyclopedia',
    categories: ['Misc'],
  },
  {
    name: 'Google Keep',
    url: 'https://keep.google.com',
    logo_url: 'https://ssl.gstatic.com/keep/icon_2020q4v2_128.png',
    description: 'Note-taking service by Google',
    categories: ['Notes & Whiteboards'],
    suite: 'Google',
  },
  {
    name: 'Pocket',
    url: 'https://getpocket.com',
    logo_url: 'https://getpocket.com/favicon.ico',
    description: 'Save articles and videos for later',
    categories: ['Focus & Productivity', 'Misc'],
  },
  {
    name: 'Feedly',
    url: 'https://feedly.com',
    logo_url: 'https://feedly.com/favicon.ico',
    description: 'RSS feed reader and news aggregator',
    categories: ['Misc'],
  },
];

export const APP_CATEGORIES: AppCategory[] = [
  'Accounting & Finance',
  'Advertising & Marketing',
  'Administration',
  'Artificial Intelligence',
  'Blogging & Writing',
  'Calendar & Scheduling',
  'Voice & Video Calls',
  'Customer Support',
  'Design Suites',
  'eCommerce',
  'Educational',
  'Email',
  'Focus & Productivity',
  'IDE & Coding Resources',
  'Messaging & Social',
  'Misc',
  'Music',
  'Notes & Whiteboards',
  'Product Management',
  'Cloud Storage',
  'Streaming Platforms',
  'Task Management',
];

export const APP_SUITES: (AppSuite | 'All')[] = [
  'All',
  'Apple',
  'Google',
  'MayR Labs',
  'Microsoft',
  'Zoho',
];
