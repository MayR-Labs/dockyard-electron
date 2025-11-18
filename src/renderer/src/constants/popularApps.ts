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

export type AppSuite = 'Apple' | 'Google' | 'MayR Labs' | 'Microsoft' | 'Yandex' | 'Zoho' | null;

export const APP_COLLECTIONS = {
  ARTICLE_PUBLISHING: 'Article Publishing Stack',
  LEARNING_LAB: 'MayR Learning Stack',
  TEAM_PRODUCTIVITY: 'Team Productivity Stack',
} as const;

export interface PopularApp {
  id: string;
  name: string;
  url: string;
  logo_url: string;
  description: string;
  categories: AppCategory[];
  collections: string[];
  suite: AppSuite;
}

type SuiteName = Exclude<AppSuite, null>;

type SuiteHelper = (
  name: string,
  url: string,
  logoUrl: string,
  description: string,
  categories: AppCategory[],
  collections?: string[]
) => PopularApp;

const slugifyAppName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toAppId = (name: string) => `app-${slugifyAppName(name)}`;

const normalizeCollections = (collections?: string[]) => Array.from(new Set(collections ?? []));

export const popularApp = (
  name: string,
  url: string,
  logoUrl: string,
  description: string,
  categories: AppCategory[],
  collections: string[] = [],
  suite: AppSuite = null
): PopularApp => ({
  id: toAppId(name),
  name,
  url,
  logo_url: logoUrl,
  description,
  categories,
  collections: normalizeCollections(collections),
  suite,
});

const createSuiteHelper =
  (suite: SuiteName): SuiteHelper =>
  (name, url, logoUrl, description, categories, collections = []) =>
    popularApp(name, url, logoUrl, description, categories, collections, suite);

export const mlApp = createSuiteHelper('MayR Labs');
export const appleApp = createSuiteHelper('Apple');
export const googleApp = createSuiteHelper('Google');
export const msApp = createSuiteHelper('Microsoft');
export const yandexApp = createSuiteHelper('Yandex');
export const zohoApp = createSuiteHelper('Zoho');

const dedupeApps = (apps: PopularApp[]) => {
  const seen = new Set<string>();
  return apps.filter((app) => {
    if (seen.has(app.id)) {
      return false;
    }
    seen.add(app.id);
    return true;
  });
};

const sortApps = (apps: PopularApp[]) => [...apps].sort((a, b) => a.name.localeCompare(b.name));

export const POPULAR_APPS: PopularApp[] = sortApps(
  dedupeApps([
    // MayR Labs Suite
    mlApp(
      'LearnBits',
      'https://learnbits.mayrlabs.com',
      'https://learnbits.mayrlabs.com/favicon.ico',
      'Learn Tech. Bit by Bit',
      ['Educational'],
      [APP_COLLECTIONS.LEARNING_LAB]
    ),
    mlApp(
      'LearnFlow',
      'https://learnflow.mayrlabs.com',
      'https://learnflow.mayrlabs.com/favicon.ico',
      'Create personalized courses on any topic with AI tuned to your learning style.',
      ['Educational', 'Artificial Intelligence'],
      [APP_COLLECTIONS.LEARNING_LAB]
    ),
    mlApp(
      'QuizWise',
      'https://quizwise.mayrlabs.com',
      'https://quizwise.mayrlabs.com/favicon.ico',
      'Challenge and expand your knowledge across multiple tech domains.',
      ['Educational'],
      [APP_COLLECTIONS.LEARNING_LAB]
    ),
    mlApp(
      'Fun Arcade',
      'https://arcade.mayrlabs.com',
      'https://arcade.mayrlabs.com/favicon.ico',
      'Rediscover timeless classics and fresh mini-games ready to play anywhere.',
      ['Misc']
    ),
    mlApp(
      'ShellBase',
      'https://shellbase.mayrlabs.com',
      'https://shellbase.mayrlabs.com/favicon.ico',
      'Interactive command-line cheat sheet built with Next.js to streamline workflows.',
      ['IDE & Coding Resources']
    ),
    mlApp(
      'PrepAI',
      'https://prepai.mayrlabs.com',
      'https://prepai.mayrlabs.com/favicon.ico',
      'AI-powered prep companion for WAEC, NECO, JAMB, and GCE exams.',
      ['Educational', 'Artificial Intelligence'],
      [APP_COLLECTIONS.LEARNING_LAB]
    ),
    mlApp(
      'ContentForge',
      'https://contentforge.mayrlabs.com',
      'https://contentforge.mayrlabs.com/favicon.ico',
      'Plan and generate content faster with Tovix AI assistance.',
      ['Artificial Intelligence', 'Blogging & Writing']
    ),
    mlApp(
      'WWTBAM',
      'https://wwtbam.mayrlabs.com',
      'https://wwtbam.mayrlabs.com/favicon.ico',
      'Who Wants To Be A Millionaire challenge game with classic trivia style.',
      ['Misc', 'Educational']
    ),

    // Google Suite
    googleApp(
      'Gmail',
      'https://mail.google.com',
      'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
      'Email service by Google with powerful search and organization',
      ['Email']
    ),
    googleApp(
      'Google Calendar',
      'https://calendar.google.com',
      'https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_1.ico',
      'Schedule and manage events, meetings, and reminders',
      ['Calendar & Scheduling']
    ),
    googleApp(
      'Google Drive',
      'https://drive.google.com',
      'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
      'Cloud storage and file synchronization service',
      ['Cloud Storage'],
      [APP_COLLECTIONS.ARTICLE_PUBLISHING]
    ),
    googleApp(
      'Google Docs',
      'https://docs.google.com',
      'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
      'Online word processor for creating and editing documents',
      ['Blogging & Writing', 'Focus & Productivity'],
      [APP_COLLECTIONS.ARTICLE_PUBLISHING]
    ),
    googleApp(
      'Google Sheets',
      'https://sheets.google.com',
      'https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico',
      'Online spreadsheet application for data analysis',
      ['Accounting & Finance', 'Focus & Productivity']
    ),
    googleApp(
      'Google Slides',
      'https://slides.google.com',
      'https://ssl.gstatic.com/docs/presentations/images/favicon5.ico',
      'Create and edit presentations online',
      ['Focus & Productivity']
    ),
    googleApp(
      'Google Meet',
      'https://meet.google.com',
      'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png',
      'Video conferencing and online meetings',
      ['Voice & Video Calls']
    ),
    googleApp(
      'Google Chat',
      'https://chat.google.com',
      'https://www.gstatic.com/images/branding/product/2x/chat_2020q4_48dp.png',
      'Team messaging and collaboration platform',
      ['Messaging & Social']
    ),
    googleApp(
      'YouTube',
      'https://youtube.com',
      'https://www.youtube.com/favicon.ico',
      'Video sharing and streaming platform',
      ['Streaming Platforms']
    ),
    googleApp(
      'YouTube Music',
      'https://music.youtube.com',
      'https://music.youtube.com/img/favicon_144.png',
      'Music streaming service by Google',
      ['Music', 'Streaming Platforms']
    ),
    googleApp(
      'Gemini',
      'https://gemini.google.com',
      'https://www.gstatic.com/ai/gemini/favicon.ico',
      'Conversational AI assistant built on Google DeepMind models.',
      ['Artificial Intelligence']
    ),
    googleApp(
      'Google Messages',
      'https://messages.google.com/web',
      'https://messages.google.com/web/favicon.ico',
      'Rich messaging on the web with RCS, SMS, and device sync.',
      ['Messaging & Social']
    ),
    googleApp(
      'Firebase',
      'https://firebase.google.com',
      'https://firebase.google.com/favicon.ico',
      'Backend-as-a-service platform for building and scaling apps.',
      ['IDE & Coding Resources', 'Administration']
    ),
    googleApp(
      'Firebase Studio',
      'https://studio.firebase.google.com',
      'https://studio.firebase.google.com/favicon.ico',
      'Visual workspace for managing Firebase data and extensions.',
      ['IDE & Coding Resources', 'Product Management']
    ),
    googleApp(
      'Google Ads',
      'https://ads.google.com',
      'https://ads.google.com/favicon.ico',
      'Plan and manage search, display, and video advertising.',
      ['Advertising & Marketing']
    ),
    googleApp(
      'Google AdSense',
      'https://www.google.com/adsense',
      'https://www.google.com/adsense/static/images/favicon.ico',
      'Monetize web content with contextual ads from Google.',
      ['Advertising & Marketing']
    ),
    googleApp(
      'Google Analytics',
      'https://analytics.google.com',
      'https://analytics.google.com/favicon.ico',
      'Measure site and app performance with advanced analytics.',
      ['Advertising & Marketing', 'Focus & Productivity']
    ),
    googleApp(
      'Google Classroom',
      'https://classroom.google.com',
      'https://ssl.gstatic.com/classroom/ic_product_classroom_144.png',
      'Manage assignments, grades, and announcements for classes.',
      ['Educational']
    ),
    googleApp(
      'Google Cloud',
      'https://cloud.google.com',
      'https://cloud.google.com/favicon.ico',
      'Cloud infrastructure, AI, and data services from Google.',
      ['Administration', 'Cloud Storage']
    ),
    googleApp(
      'Google Contacts',
      'https://contacts.google.com',
      'https://contacts.google.com/favicon.ico',
      'Centralized contact manager synced across Google services.',
      ['Administration']
    ),
    googleApp(
      'Google Data Studio',
      'https://datastudio.google.com',
      'https://datastudio.google.com/favicon.ico',
      'Build interactive reports and dashboards (now Looker Studio).',
      ['Focus & Productivity', 'Product Management']
    ),
    googleApp(
      'Google Maps',
      'https://maps.google.com',
      'https://maps.google.com/favicon.ico',
      'Explore maps, routes, and places worldwide.',
      ['Misc', 'Focus & Productivity']
    ),
    googleApp(
      'Google News',
      'https://news.google.com',
      'https://news.google.com/favicon.ico',
      'Personalized news briefing sourced from global publishers.',
      ['Misc']
    ),
    googleApp(
      'Google Optimize',
      'https://optimize.google.com',
      'https://optimize.google.com/favicon.ico',
      'Run experiments and personalize websites with Google Optimize.',
      ['Advertising & Marketing']
    ),
    googleApp(
      'Google Photos',
      'https://photos.google.com',
      'https://ssl.gstatic.com/social/photosui/images/favicon.ico',
      'Store, search, and share photos backed by Google AI.',
      ['Cloud Storage', 'Misc']
    ),
    googleApp(
      'Google Tag Manager',
      'https://tagmanager.google.com',
      'https://tagmanager.google.com/favicon.ico',
      'Deploy and manage marketing tags without editing code.',
      ['Advertising & Marketing']
    ),
    googleApp(
      'Google Translate',
      'https://translate.google.com',
      'https://translate.google.com/favicon.ico',
      'Translate text, speech, and documents between languages.',
      ['Blogging & Writing', 'Focus & Productivity']
    ),
    googleApp(
      'Google Voice',
      'https://voice.google.com',
      'https://voice.google.com/favicon.ico',
      'Cloud phone numbers, voicemail, and texting.',
      ['Voice & Video Calls', 'Messaging & Social']
    ),
    googleApp(
      'Hangouts',
      'https://hangouts.google.com',
      'https://hangouts.google.com/favicon.ico',
      'Legacy Google messaging and calling experience on the web.',
      ['Messaging & Social', 'Voice & Video Calls']
    ),
    googleApp(
      'Google Nest',
      'https://home.google.com',
      'https://home.google.com/favicon.ico',
      'Manage Nest smart home devices directly from the browser.',
      ['Misc']
    ),
    googleApp(
      'NotebookLM',
      'https://notebooklm.google.com',
      'https://notebooklm.google.com/favicon.ico',
      'AI-powered research notebook for summarizing and querying sources.',
      ['Artificial Intelligence', 'Notes & Whiteboards']
    ),
    googleApp(
      'Google Tasks',
      'https://tasks.google.com',
      'https://tasks.google.com/favicon.ico',
      'Capture and organize tasks synced across Gmail and Calendar.',
      ['Task Management']
    ),
    googleApp(
      'Google Taskboard',
      'https://workspace.google.com/products/tasks/',
      'https://workspace.google.com/static/apple-touch-icon.png',
      'Board view for Google Tasks to visualize work in columns.',
      ['Task Management', 'Focus & Productivity']
    ),

    // Microsoft Suite
    msApp(
      'Outlook',
      'https://outlook.office.com',
      'https://res.cdn.office.net/assets/mail/images/favicon_outlook_web.ico',
      'Email and calendar service by Microsoft',
      ['Email', 'Calendar & Scheduling']
    ),
    msApp(
      'Microsoft Teams',
      'https://teams.microsoft.com',
      'https://statics.teams.cdn.office.net/hashedassets/favicon/prod/favicon.ico',
      'Team collaboration and video conferencing platform',
      ['Voice & Video Calls', 'Messaging & Social']
    ),
    msApp(
      'OneDrive',
      'https://onedrive.live.com',
      'https://onedrive.live.com/favicon.ico',
      'Cloud storage service by Microsoft',
      ['Cloud Storage']
    ),
    msApp(
      'Microsoft To Do',
      'https://to-do.office.com',
      'https://to-do.cdn.office.net/production/assets/favicon.ico',
      'Task management and to-do lists',
      ['Task Management']
    ),
    msApp(
      'OneNote',
      'https://www.onenote.com/notebooks',
      'https://www.onenote.com/favicon.ico',
      'Digital note-taking application',
      ['Notes & Whiteboards']
    ),
    msApp(
      'Microsoft Excel',
      'https://www.office.com/launch/excel',
      'https://res.cdn.office.net/assets/mail/file-icon/png/xlsx_16x16.png',
      'Web-based Excel for building spreadsheets and dashboards.',
      ['Accounting & Finance', 'Focus & Productivity']
    ),
    msApp(
      'Microsoft Word',
      'https://www.office.com/launch/word',
      'https://res.cdn.office.net/assets/mail/file-icon/png/docx_16x16.png',
      'Create and edit documents online with Microsoft Word.',
      ['Blogging & Writing', 'Focus & Productivity']
    ),
    msApp(
      'Microsoft PowerPoint',
      'https://www.office.com/launch/powerpoint',
      'https://res.cdn.office.net/assets/mail/file-icon/png/pptx_16x16.png',
      'Design and present slides directly from the browser.',
      ['Focus & Productivity']
    ),
    msApp(
      'Microsoft Copilot',
      'https://copilot.microsoft.com',
      'https://copilot.microsoft.com/favicon.ico',
      'AI assistant that accelerates writing, coding, and browsing tasks.',
      ['Artificial Intelligence', 'Focus & Productivity']
    ),
    msApp(
      'Outlook 365',
      'https://outlook.office365.com',
      'https://res.cdn.office.net/assets/mail/images/favicon_outlook_web.ico',
      'Enterprise Outlook experience for Microsoft 365 tenants.',
      ['Email', 'Calendar & Scheduling']
    ),
    msApp(
      'Microsoft Calendar',
      'https://outlook.live.com/calendar',
      'https://res.cdn.office.net/assets/mail/images/favicon_outlook_web.ico',
      'Stand-alone Outlook Calendar view for scheduling events.',
      ['Calendar & Scheduling']
    ),

    // Apple Suite
    appleApp(
      'iCloud Mail',
      'https://www.icloud.com/mail',
      'https://www.icloud.com/favicon.ico',
      'Email service by Apple',
      ['Email']
    ),
    appleApp(
      'iCloud Calendar',
      'https://www.icloud.com/calendar',
      'https://www.icloud.com/favicon.ico',
      'Calendar application by Apple',
      ['Calendar & Scheduling']
    ),
    appleApp(
      'iCloud Drive',
      'https://www.icloud.com/iclouddrive',
      'https://www.icloud.com/favicon.ico',
      'Cloud storage service by Apple',
      ['Cloud Storage']
    ),
    appleApp(
      'iCloud Notes',
      'https://www.icloud.com/notes',
      'https://www.icloud.com/favicon.ico',
      'Note-taking app by Apple',
      ['Notes & Whiteboards']
    ),
    appleApp(
      'iCloud Reminders',
      'https://www.icloud.com/reminders',
      'https://www.icloud.com/favicon.ico',
      'Task and reminder management by Apple',
      ['Task Management']
    ),

    // Zoho Suite
    zohoApp(
      'Zoho Mail',
      'https://mail.zoho.com',
      'https://www.zoho.com/favicon.ico',
      'Business email hosting service',
      ['Email']
    ),
    zohoApp(
      'Zoho CRM',
      'https://crm.zoho.com',
      'https://www.zoho.com/favicon.ico',
      'Customer relationship management software',
      ['Customer Support', 'Administration']
    ),
    zohoApp(
      'Zoho Projects',
      'https://projects.zoho.com',
      'https://www.zoho.com/favicon.ico',
      'Project management and collaboration',
      ['Product Management', 'Task Management']
    ),
    zohoApp(
      'Zoho Meeting',
      'https://meeting.zoho.com',
      'https://www.zoho.com/favicon.ico',
      'Online meeting and webinar platform',
      ['Voice & Video Calls']
    ),
    zohoApp(
      'Zoho Books',
      'https://books.zoho.com',
      'https://www.zoho.com/favicon.ico',
      'Accounting software for invoices, expenses, and tax-ready reports.',
      ['Accounting & Finance']
    ),
    zohoApp(
      'Zoho Cliq',
      'https://cliq.zoho.com',
      'https://www.zoho.com/favicon.ico',
      'Team messaging, channels, and calls within the Zoho suite.',
      ['Messaging & Social', 'Voice & Video Calls']
    ),
    zohoApp(
      'Zoho Notebook',
      'https://www.zoho.com/notebook/',
      'https://www.zoho.com/favicon.ico',
      'Beautiful note cards that sync across devices.',
      ['Notes & Whiteboards']
    ),
    zohoApp(
      'Zoho Sheet',
      'https://sheet.zoho.com',
      'https://www.zoho.com/favicon.ico',
      'Collaborative spreadsheets with automation and data cleanup.',
      ['Accounting & Finance', 'Focus & Productivity']
    ),
    zohoApp(
      'Zoho Show',
      'https://show.zoho.com',
      'https://www.zoho.com/favicon.ico',
      'Browser-based presentation tool for teams.',
      ['Focus & Productivity']
    ),
    zohoApp(
      'Zoho Writer',
      'https://writer.zoho.com',
      'https://www.zoho.com/favicon.ico',
      'Collaborative word processor with templates and review tools.',
      ['Blogging & Writing', 'Focus & Productivity']
    ),

    // Communication & Messaging
    popularApp(
      'Slack',
      'https://app.slack.com',
      'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
      'Team communication and collaboration platform',
      ['Messaging & Social'],
      [APP_COLLECTIONS.TEAM_PRODUCTIVITY]
    ),
    popularApp(
      'Discord',
      'https://discord.com/app',
      'https://discord.com/assets/favicon.ico',
      'Voice, video, and text chat for communities',
      ['Messaging & Social', 'Voice & Video Calls']
    ),
    popularApp(
      'Telegram',
      'https://web.telegram.org',
      'https://web.telegram.org/favicon.ico',
      'Cloud-based instant messaging service',
      ['Messaging & Social']
    ),
    popularApp(
      'WhatsApp',
      'https://web.whatsapp.com',
      'https://static.whatsapp.net/rsrc.php/v3/y7/r/DSxOAUB0raA.png',
      'Messaging and voice/video calling',
      ['Messaging & Social', 'Voice & Video Calls']
    ),
    popularApp(
      'Zoom',
      'https://zoom.us',
      'https://st1.zoom.us/static/6.3.11058/image/new/favicon/favicon-96x96.png',
      'Video conferencing and online meetings',
      ['Voice & Video Calls'],
      [APP_COLLECTIONS.TEAM_PRODUCTIVITY]
    ),
    msApp(
      'Skype',
      'https://web.skype.com',
      'https://secure.skypeassets.com/content/dam/scom/favicons/favicon-32x32.png',
      'Video chat and voice call service',
      ['Voice & Video Calls', 'Messaging & Social']
    ),

    // Productivity & Task Management
    popularApp(
      'Notion',
      'https://notion.so',
      'https://www.notion.so/images/favicon.ico',
      'All-in-one workspace for notes, tasks, wikis, and databases',
      ['Notes & Whiteboards', 'Task Management', 'Focus & Productivity'],
      [APP_COLLECTIONS.ARTICLE_PUBLISHING, APP_COLLECTIONS.TEAM_PRODUCTIVITY]
    ),
    popularApp(
      'Trello',
      'https://trello.com',
      'https://trello.com/favicon.ico',
      'Visual project management with boards and cards',
      ['Task Management', 'Product Management'],
      [APP_COLLECTIONS.TEAM_PRODUCTIVITY]
    ),
    popularApp(
      'Asana',
      'https://app.asana.com',
      'https://assets.asana.biz/m/1979cd4145cb5c8d/original/favicon.ico',
      'Work management platform for teams',
      ['Task Management', 'Product Management'],
      [APP_COLLECTIONS.TEAM_PRODUCTIVITY]
    ),
    popularApp(
      'Monday.com',
      'https://monday.com',
      'https://monday.com/static/img/favicons/favicon.ico',
      'Work operating system for team collaboration',
      ['Product Management', 'Task Management'],
      [APP_COLLECTIONS.TEAM_PRODUCTIVITY]
    ),
    popularApp(
      'ClickUp',
      'https://app.clickup.com',
      'https://clickup.com/favicon.ico',
      'All-in-one productivity platform',
      ['Task Management', 'Product Management', 'Focus & Productivity'],
      [APP_COLLECTIONS.TEAM_PRODUCTIVITY]
    ),
    popularApp(
      'Todoist',
      'https://todoist.com/app',
      'https://todoist.com/favicon.ico',
      'Task manager and to-do list app',
      ['Task Management']
    ),
    popularApp(
      'Airtable',
      'https://airtable.com',
      'https://airtable.com/images/favicon/favicon-32x32.png',
      'Cloud collaboration service with spreadsheet-database hybrid',
      ['Product Management', 'Focus & Productivity']
    ),
    popularApp(
      'Basecamp',
      'https://basecamp.com',
      'https://basecamp.com/favicon.ico',
      'Project management and team collaboration',
      ['Product Management', 'Task Management']
    ),

    // Note-Taking & Whiteboards
    popularApp(
      'Evernote',
      'https://www.evernote.com',
      'https://evernote.com/favicon.ico',
      'Note taking and organization application',
      ['Notes & Whiteboards']
    ),
    popularApp(
      'Obsidian Sync',
      'https://obsidian.md',
      'https://obsidian.md/favicon.ico',
      'Knowledge base and note-taking with markdown',
      ['Notes & Whiteboards']
    ),
    popularApp(
      'Miro',
      'https://miro.com',
      'https://miro.com/favicon.ico',
      'Online collaborative whiteboard platform',
      ['Notes & Whiteboards', 'Product Management']
    ),
    popularApp(
      'Mural',
      'https://www.mural.co',
      'https://cdn.prod.website-files.com/62e11362da2667ac3d0e6ed5/63f8b1b0585b45a64baf52da_Mural_Favicon_32x32.png',
      'Digital workspace for visual collaboration',
      ['Notes & Whiteboards']
    ),
    popularApp(
      'Excalidraw',
      'https://excalidraw.com',
      'https://excalidraw.com/favicon.ico',
      'Virtual whiteboard for sketching hand-drawn diagrams',
      ['Notes & Whiteboards']
    ),

    // Development & Coding
    popularApp(
      'GitHub',
      'https://github.com',
      'https://github.githubassets.com/favicons/favicon.svg',
      'Code hosting platform for version control and collaboration',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'GitLab',
      'https://gitlab.com',
      'https://gitlab.com/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png',
      'DevOps platform with Git repository management',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Bitbucket',
      'https://bitbucket.org',
      'https://bitbucket.org/favicon.ico',
      'Git-based source code repository hosting service',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Stack Overflow',
      'https://stackoverflow.com',
      'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
      'Q&A community for programmers',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'CodePen',
      'https://codepen.io',
      'https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico',
      'Online code editor and development environment',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Replit',
      'https://replit.com',
      'https://replit.com/public/images/favicon.ico',
      'Online IDE and collaborative coding platform',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'JSFiddle',
      'https://jsfiddle.net',
      'https://jsfiddle.net/favicon.ico',
      'Online JavaScript, CSS, and HTML playground',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Vercel',
      'https://vercel.com',
      'https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico',
      'Platform for frontend frameworks and static sites',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Netlify',
      'https://app.netlify.com',
      'https://www.netlify.com/favicon.ico',
      'Platform for web applications and static websites',
      ['IDE & Coding Resources']
    ),

    // Design Tools
    popularApp(
      'Figma',
      'https://www.figma.com',
      'https://static.figma.com/app/icon/1/favicon.png',
      'Collaborative interface design tool',
      ['Design Suites']
    ),
    popularApp(
      'Canva',
      'https://www.canva.com',
      'https://canva.com/favicon.ico',
      'Graphic design platform for creating visual content',
      ['Design Suites']
    ),
    popularApp(
      'Adobe Creative Cloud',
      'https://www.adobe.com/creativecloud.html',
      'https://www.adobe.com/favicon.ico',
      'Suite of creative applications and services',
      ['Design Suites']
    ),
    // {
    //   name: 'InVision',
    //   url: 'https://www.invisionapp.com',
    //   logo_url: 'https://www.invisionapp.com/favicon.ico',
    //   description: 'Digital product design platform',
    //   categories: ['Design Suites'],
    // },
    popularApp(
      'Sketch Cloud',
      'https://www.sketch.com',
      'https://www.sketch.com/favicon.ico',
      'Design toolkit and collaboration platform',
      ['Design Suites']
    ),

    // Social Media
    popularApp(
      'LinkedIn',
      'https://www.linkedin.com',
      'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
      'Professional networking platform',
      ['Messaging & Social'],
      [APP_COLLECTIONS.ARTICLE_PUBLISHING]
    ),
    popularApp(
      'Twitter / X',
      'https://twitter.com',
      'https://abs.twimg.com/favicons/twitter.3.ico',
      'Social media platform for microblogging',
      ['Messaging & Social']
    ),
    popularApp(
      'Facebook',
      'https://www.facebook.com',
      'https://web.facebook.com/favicon.ico',
      'Social networking service',
      ['Messaging & Social']
    ),
    popularApp(
      'Instagram',
      'https://www.instagram.com',
      'https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png',
      'Photo and video sharing social network',
      ['Messaging & Social']
    ),
    popularApp(
      'Reddit',
      'https://www.reddit.com',
      'https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png',
      'Social news aggregation and discussion',
      ['Messaging & Social']
    ),
    popularApp(
      'Mastodon',
      'https://joinmastodon.org',
      'https://joinmastodon.org/_next/static/media/favicon-32x32.3a702fe9.png',
      'Decentralized social network',
      ['Messaging & Social']
    ),

    // Customer Support
    popularApp(
      'Zendesk',
      'https://www.zendesk.com',
      'https://www.zendesk.com/favicon.ico',
      'Customer service software and support ticketing',
      ['Customer Support']
    ),
    popularApp(
      'Intercom',
      'https://www.intercom.com',
      'https://www.intercom.com/favicon.ico',
      'Customer messaging platform',
      ['Customer Support', 'Messaging & Social']
    ),
    popularApp(
      'Freshdesk',
      'https://freshdesk.com',
      'https://www.freshworks.com/favicons/favicon.ico',
      'Cloud-based customer support software',
      ['Customer Support']
    ),
    popularApp(
      'Help Scout',
      'https://www.helpscout.com',
      'https://www.helpscout.com/favicon.ico',
      'Help desk software for customer support teams',
      ['Customer Support']
    ),

    // Accounting & Finance
    popularApp(
      'QuickBooks Online',
      'https://quickbooks.intuit.com',
      'https://quickbooks.intuit.com/favicon.ico',
      'Accounting software for small businesses',
      ['Accounting & Finance']
    ),
    popularApp(
      'Xero',
      'https://www.xero.com',
      'https://www.xero.com/favicon.ico',
      'Online accounting software',
      ['Accounting & Finance']
    ),
    popularApp(
      'Wave',
      'https://www.waveapps.com',
      'https://www.waveapps.com/favicon.ico',
      'Free accounting and invoicing software',
      ['Accounting & Finance']
    ),
    popularApp(
      'FreshBooks',
      'https://www.freshbooks.com',
      'https://www.freshbooks.com/favicon.ico',
      'Cloud-based accounting software',
      ['Accounting & Finance']
    ),
    popularApp(
      'Stripe',
      'https://dashboard.stripe.com',
      'https://stripe.com/favicon.ico',
      'Online payment processing platform',
      ['Accounting & Finance', 'eCommerce']
    ),
    popularApp(
      'PayPal',
      'https://www.paypal.com',
      'https://www.paypalobjects.com/webstatic/icon/favicon.ico',
      'Online payment system',
      ['Accounting & Finance', 'eCommerce']
    ),

    // eCommerce
    popularApp(
      'Shopify',
      'https://www.shopify.com',
      'https://cdn.shopify.com/shopifycloud/brochure/assets/favicon-48d5e347d2e17e3b02b4e0e5c9bc8b1b.png',
      'E-commerce platform for online stores',
      ['eCommerce']
    ),
    popularApp(
      'WooCommerce',
      'https://woocommerce.com',
      'https://woocommerce.com/wp-content/themes/woo/images/favicon.ico',
      'E-commerce plugin for WordPress',
      ['eCommerce']
    ),
    popularApp(
      'BigCommerce',
      'https://www.bigcommerce.com',
      'https://dam.bigcommerce.com/m/569c5976323dd521/original/favicon-196x196.png',
      'E-commerce platform for growing businesses',
      ['eCommerce']
    ),
    popularApp(
      'Etsy',
      'https://www.etsy.com',
      'https://www.etsy.com/images/favicon.ico',
      'Marketplace for handmade and vintage items',
      ['eCommerce']
    ),

    // Marketing & Advertising
    popularApp(
      'HubSpot',
      'https://www.hubspot.com',
      'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
      'Inbound marketing, sales, and service software',
      ['Advertising & Marketing', 'Customer Support']
    ),
    popularApp(
      'Mailchimp',
      'https://mailchimp.com',
      'https://mailchimp.com/favicon.ico',
      'Email marketing and automation platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Buffer',
      'https://buffer.com',
      'https://buffer.com/static/icons/favicon.ico',
      'Social media management platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Hootsuite',
      'https://hootsuite.com',
      'https://hootsuite.com/favicon.ico',
      'Social media management dashboard',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Canva for Marketing',
      'https://www.canva.com',
      'https://canva.com/favicon.ico',
      'Design platform for marketing materials',
      ['Advertising & Marketing', 'Design Suites']
    ),

    // Blogging & Writing
    popularApp(
      'Medium',
      'https://medium.com',
      'https://cdn-static-1.medium.com/_/fp/icons/favicon-rebrand-medium.3Y6xpZ-0FSdWDnPM3hSBIA.ico',
      'Online publishing platform',
      ['Blogging & Writing'],
      [APP_COLLECTIONS.ARTICLE_PUBLISHING]
    ),
    popularApp(
      'WordPress.com',
      'https://wordpress.com',
      'https://s0.wp.com/i/favicon.ico',
      'Website and blog hosting platform',
      ['Blogging & Writing'],
      [APP_COLLECTIONS.ARTICLE_PUBLISHING]
    ),
    popularApp(
      'Substack',
      'https://substack.com',
      'https://substack.com/favicon.ico',
      'Newsletter publishing platform',
      ['Blogging & Writing'],
      [APP_COLLECTIONS.ARTICLE_PUBLISHING]
    ),
    popularApp(
      'Ghost',
      'https://ghost.org',
      'https://ghost.org/favicon.ico',
      'Professional publishing platform',
      ['Blogging & Writing']
    ),
    popularApp(
      'Grammarly',
      'https://app.grammarly.com',
      'https://static-web.grammarly.com/cms/master/public/favicon.ico',
      'Writing assistant for grammar and spelling',
      ['Blogging & Writing'],
      [APP_COLLECTIONS.ARTICLE_PUBLISHING]
    ),

    // Music & Audio
    popularApp(
      'Spotify',
      'https://open.spotify.com',
      'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png',
      'Music streaming service',
      ['Music', 'Streaming Platforms']
    ),
    appleApp(
      'Apple Music',
      'https://music.apple.com',
      'https://music.apple.com/favicon.ico',
      'Music streaming service by Apple',
      ['Music', 'Streaming Platforms']
    ),
    popularApp(
      'SoundCloud',
      'https://soundcloud.com',
      'https://soundcloud.com/favicon.ico',
      'Audio distribution platform and music sharing',
      ['Music', 'Streaming Platforms']
    ),
    popularApp(
      'Bandcamp',
      'https://bandcamp.com',
      'https://bandcamp.com/favicon.ico',
      'Music commerce platform for artists',
      ['Music', 'eCommerce']
    ),

    // Streaming Platforms
    popularApp(
      'Netflix',
      'https://www.netflix.com',
      'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
      'Streaming service for movies and TV shows',
      ['Streaming Platforms']
    ),
    popularApp(
      'Twitch',
      'https://www.twitch.tv',
      'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png',
      'Live streaming platform for gamers',
      ['Streaming Platforms']
    ),
    popularApp(
      'Disney+',
      'https://www.disneyplus.com',
      'https://www.disneyplus.com/favicon.ico',
      'Streaming service for Disney content',
      ['Streaming Platforms']
    ),
    popularApp(
      'Vimeo',
      'https://vimeo.com',
      'https://f.vimeocdn.com/images_v6/favicon.ico',
      'Video hosting and sharing platform',
      ['Streaming Platforms']
    ),

    // Educational
    popularApp(
      'Coursera',
      'https://www.coursera.org',
      'https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-v2-32x32.png',
      'Online learning platform with courses from universities',
      ['Educational']
    ),
    popularApp(
      'Udemy',
      'https://www.udemy.com',
      'https://www.udemy.com/staticx/udemy/images/v7/favicon-32x32.png',
      'Online learning and teaching marketplace',
      ['Educational']
    ),
    popularApp(
      'Khan Academy',
      'https://www.khanacademy.org',
      'https://www.khanacademy.org/favicon.ico',
      'Free online education platform',
      ['Educational']
    ),
    popularApp(
      'edX',
      'https://www.edx.org',
      'https://www.edx.org/favicon.ico',
      'Online courses from universities',
      ['Educational']
    ),
    popularApp(
      'Duolingo',
      'https://www.duolingo.com',
      'https://d35aaqx5ub95lt.cloudfront.net/favicon.ico',
      'Language learning platform',
      ['Educational']
    ),
    popularApp(
      'Codecademy',
      'https://www.codecademy.com',
      'https://www.codecademy.com/favicon.ico',
      'Interactive platform for learning coding',
      ['Educational', 'IDE & Coding Resources']
    ),

    // AI Tools
    popularApp(
      'ChatGPT',
      'https://chatgpt.com',
      'https://chatgpt.com/favicon.ico',
      'AI-powered conversational assistant',
      ['Artificial Intelligence'],
      [APP_COLLECTIONS.ARTICLE_PUBLISHING]
    ),
    popularApp(
      'Claude',
      'https://claude.ai',
      'https://claude.ai/favicon.ico',
      'AI assistant by Anthropic',
      ['Artificial Intelligence']
    ),
    popularApp(
      'Midjourney',
      'https://www.midjourney.com',
      'https://www.midjourney.com/favicon.ico',
      'AI-powered image generation',
      ['Artificial Intelligence', 'Design Suites']
    ),
    popularApp(
      'Perplexity',
      'https://www.perplexity.ai',
      'https://www.perplexity.ai/favicon.ico',
      'AI-powered search and answer engine',
      ['Artificial Intelligence']
    ),
    popularApp(
      'Notion AI',
      'https://www.notion.so/product/ai',
      'https://www.notion.so/images/favicon.ico',
      'AI-powered writing and productivity assistant',
      ['Artificial Intelligence', 'Focus & Productivity']
    ),
    popularApp(
      'Sora',
      'https://sora.chatgpt.com',
      'https://sora.chatgpt.com/favicon.ico',
      'AI assistant for creative generations',
      ['Artificial Intelligence', 'Design Suites']
    ),

    // Calendar & Scheduling
    popularApp(
      'Calendly',
      'https://calendly.com',
      'https://assets.calendly.com/packs/frontend/media/icon-32x32-9c3218e8faf0ae6e8e90.png',
      'Meeting scheduling automation',
      ['Calendar & Scheduling']
    ),
    popularApp(
      'Cal.com',
      'https://cal.com',
      'https://cal.com/favicon.ico',
      'Open-source scheduling infrastructure',
      ['Calendar & Scheduling']
    ),
    popularApp(
      'Doodle',
      'https://doodle.com',
      'https://marketing-cdn.doodle.com/branding/2022/favicon/favicon.ico',
      'Meeting scheduling and polling',
      ['Calendar & Scheduling']
    ),

    // Administration
    popularApp(
      'Dropbox',
      'https://www.dropbox.com',
      'https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico',
      'Cloud storage and file synchronization',
      ['Cloud Storage', 'Administration']
    ),
    popularApp(
      'Box',
      'https://www.box.com',
      'https://www.box.com/favicon.ico',
      'Cloud content management and file sharing',
      ['Cloud Storage', 'Administration']
    ),
    popularApp(
      'Notion Team',
      'https://www.notion.so',
      'https://www.notion.so/images/favicon.ico',
      'Team workspace and knowledge management',
      ['Administration', 'Focus & Productivity'],
      [APP_COLLECTIONS.TEAM_PRODUCTIVITY]
    ),

    // Miscellaneous
    popularApp(
      'Wikipedia',
      'https://www.wikipedia.org',
      'https://www.wikipedia.org/static/favicon/wikipedia.ico',
      'Free online encyclopedia',
      ['Misc'],
      [APP_COLLECTIONS.ARTICLE_PUBLISHING]
    ),
    googleApp(
      'Google Keep',
      'https://keep.google.com',
      'https://ssl.gstatic.com/keep/icon_2020q4v2_128.png',
      'Note-taking service by Google',
      ['Notes & Whiteboards']
    ),
    popularApp(
      'Pocket',
      'https://getpocket.com',
      'https://getpocket.com/favicon.ico',
      'Save articles and videos for later',
      ['Focus & Productivity', 'Misc']
    ),
    popularApp(
      'Feedly',
      'https://feedly.com',
      'https://feedly.com/favicon.ico',
      'RSS feed reader and news aggregator',
      ['Misc']
    ),

    // Marketing, Analytics & CRM Tools
    popularApp(
      'AB Tasty',
      'https://www.abtasty.com',
      'https://www.abtasty.com/favicon.ico',
      'A/B testing and personalization platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Acquire',
      'https://acquire.io',
      'https://acquire.io/favicon.ico',
      'Customer engagement and support platform',
      ['Customer Support']
    ),
    popularApp(
      'Active Campaign',
      'https://www.activecampaign.com',
      'https://www.activecampaign.com/favicon.ico',
      'Email marketing and automation platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Adobe Analytics',
      'https://experience.adobe.com',
      'https://www.adobe.com/favicon.ico',
      'Web analytics and marketing optimization',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Agile CRM',
      'https://www.agilecrm.com',
      'https://www.agilecrm.com/favicon.ico',
      'All-in-one CRM for small businesses',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'AHRefs',
      'https://ahrefs.com',
      'https://ahrefs.com/favicon.ico',
      'SEO tools and resources',
      ['Advertising & Marketing']
    ),
    popularApp(
      'AmoCRM',
      'https://www.amocrm.com',
      'https://www.amocrm.com/favicon.ico',
      'Sales management and CRM platform',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'Amplitude',
      'https://amplitude.com',
      'https://amplitude.com/favicon.ico',
      'Product analytics platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Anyleads',
      'https://anyleads.com',
      'https://anyleads.com/favicon.ico',
      'Lead generation and prospecting tool',
      ['Advertising & Marketing']
    ),
    popularApp(
      'AppNexus',
      'https://www.appnexus.com',
      'https://www.appnexus.com/favicon.ico',
      'Digital advertising technology platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Attribution',
      'https://attributionapp.com',
      'https://attributionapp.com/favicon.ico',
      'Marketing attribution and analytics',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Autopilot',
      'https://www.autopilothq.com',
      'https://www.autopilothq.com/favicon.ico',
      'Marketing automation platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Avora',
      'https://www.avora.com',
      'https://www.avora.com/favicon.ico',
      'AI-powered business intelligence platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Awario',
      'https://awario.com',
      'https://awario.com/favicon.ico',
      'Social media monitoring tool',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Bime',
      'https://www.bime.io',
      'https://www.bime.io/favicon.ico',
      'Business intelligence and data visualization',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Bitly',
      'https://bitly.com',
      'https://bitly.com/favicon.ico',
      'URL shortening and link management',
      ['Advertising & Marketing']
    ),
    popularApp(
      'BuzzStream',
      'https://www.buzzstream.com',
      'https://www.buzzstream.com/favicon.ico',
      'Digital PR and link building software',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Campaign Monitor',
      'https://www.campaignmonitor.com',
      'https://www.campaignmonitor.com/favicon.ico',
      'Email marketing platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Capsule CRM',
      'https://capsulecrm.com',
      'https://capsulecrm.com/favicon.ico',
      'Simple online CRM for small businesses',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'ChartBeat',
      'https://chartbeat.com',
      'https://chartbeat.com/favicon.ico',
      'Real-time web analytics',
      ['Advertising & Marketing']
    ),
    popularApp(
      'ChartIO',
      'https://chartio.com',
      'https://chartio.com/favicon.ico',
      'Cloud-based business intelligence tool',
      ['Advertising & Marketing']
    ),
    popularApp(
      'ChartMogul',
      'https://chartmogul.com',
      'https://chartmogul.com/favicon.ico',
      'Subscription analytics platform',
      ['Advertising & Marketing', 'Accounting & Finance']
    ),
    popularApp(
      'ChatFuel',
      'https://chatfuel.com',
      'https://chatfuel.com/favicon.ico',
      'Chatbot platform for social media',
      ['Advertising & Marketing', 'Customer Support']
    ),
    popularApp(
      'Close',
      'https://close.com',
      'https://close.com/favicon.ico',
      'CRM built for inside sales teams',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'Cluvio',
      'https://www.cluvio.com',
      'https://www.cluvio.com/favicon.ico',
      'Cloud-based analytics platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Communicator',
      'https://www.communicatorapp.com',
      'https://www.communicatorapp.com/favicon.ico',
      'Business communication platform',
      ['Messaging & Social']
    ),
    popularApp(
      'Constant Contact',
      'https://www.constantcontact.com',
      'https://www.constantcontact.com/favicon.ico',
      'Email marketing and automation',
      ['Advertising & Marketing']
    ),
    popularApp(
      'ConvertKit',
      'https://convertkit.com',
      'https://convertkit.com/favicon.ico',
      'Email marketing for creators',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Copper',
      'https://www.copper.com',
      'https://www.copper.com/favicon.ico',
      'CRM for Google Workspace',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'CoSchedule',
      'https://coschedule.com',
      'https://coschedule.com/favicon.ico',
      'Marketing calendar and project management',
      ['Advertising & Marketing', 'Product Management']
    ),
    popularApp(
      'Customer.io',
      'https://customer.io',
      'https://customer.io/favicon.ico',
      'Automated messaging platform',
      ['Advertising & Marketing', 'Customer Support']
    ),
    popularApp(
      'Cyfe',
      'https://www.cyfe.com',
      'https://www.cyfe.com/favicon.ico',
      'All-in-one business dashboard',
      ['Advertising & Marketing', 'Administration']
    ),
    popularApp(
      'Databox',
      'https://databox.com',
      'https://databox.com/favicon.ico',
      'Business analytics and KPI dashboard',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Databricks',
      'https://databricks.com',
      'https://databricks.com/favicon.ico',
      'Unified analytics platform',
      ['Advertising & Marketing', 'IDE & Coding Resources']
    ),
    popularApp(
      'Domo',
      'https://www.domo.com',
      'https://www.domo.com/favicon.ico',
      'Cloud-based business intelligence platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Easymailing',
      'https://www.easymailing.com',
      'https://www.easymailing.com/favicon.ico',
      'Email marketing solution',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Fanbooster',
      'https://www.fanbooster.com',
      'https://www.fanbooster.com/favicon.ico',
      'Social media marketing automation',
      ['Advertising & Marketing']
    ),
    popularApp(
      'FindThatLead',
      'https://findthatlead.com',
      'https://findthatlead.com/favicon.ico',
      'Lead generation and prospecting tool',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Foleon',
      'https://www.foleon.com',
      'https://www.foleon.com/favicon.ico',
      'Content creation platform',
      ['Advertising & Marketing', 'Blogging & Writing']
    ),
    popularApp(
      'Freshsales',
      'https://www.freshworks.com/crm',
      'https://www.freshworks.com/favicon.ico',
      'Sales CRM software',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'Fullstory',
      'https://www.fullstory.com',
      'https://www.fullstory.com/favicon.ico',
      'Digital experience analytics',
      ['Advertising & Marketing']
    ),
    popularApp(
      'GainSight',
      'https://www.gainsight.com',
      'https://www.gainsight.com/favicon.ico',
      'Customer success platform',
      ['Customer Support']
    ),
    popularApp(
      'Gist',
      'https://getgist.com',
      'https://getgist.com/favicon.ico',
      'All-in-one marketing automation',
      ['Advertising & Marketing', 'Customer Support']
    ),
    popularApp(
      'Gleam',
      'https://gleam.io',
      'https://gleam.io/favicon.ico',
      'Competitions and marketing apps',
      ['Advertising & Marketing']
    ),
    googleApp(
      'Google Ads',
      'https://ads.google.com',
      'https://www.gstatic.com/images/branding/product/2x/google_ads_32dp.png',
      'Online advertising platform',
      ['Advertising & Marketing']
    ),
    googleApp(
      'Google Adsense',
      'https://www.google.com/adsense',
      'https://www.gstatic.com/adsense/common/adsense_300x50.png',
      'Ad monetization platform',
      ['Advertising & Marketing']
    ),
    googleApp(
      'Google Analytics',
      'https://analytics.google.com',
      'https://www.google.com/analytics/static/3e3b88e/img/favicon.ico',
      'Web analytics service',
      ['Advertising & Marketing']
    ),
    googleApp(
      'Google Data Studio',
      'https://datastudio.google.com',
      'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_data_studio_32dp.png',
      'Data visualization and reporting',
      ['Advertising & Marketing']
    ),
    googleApp(
      'Google Optimize',
      'https://optimize.google.com',
      'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_optimize_32dp.png',
      'Website optimization and A/B testing',
      ['Advertising & Marketing']
    ),
    googleApp(
      'Google Tag Manager',
      'https://tagmanager.google.com',
      'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_tag_manager_32dp.png',
      'Tag management system',
      ['Advertising & Marketing']
    ),
    popularApp(
      'GoSquared',
      'https://www.gosquared.com',
      'https://www.gosquared.com/favicon.ico',
      'Analytics and live chat platform',
      ['Advertising & Marketing', 'Customer Support']
    ),
    popularApp(
      'Groove',
      'https://www.groovehq.com',
      'https://www.groovehq.com/favicon.ico',
      'Help desk and customer support software',
      ['Customer Support']
    ),
    popularApp(
      'Growbots',
      'https://www.growbots.com',
      'https://www.growbots.com/favicon.ico',
      'Sales automation platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Heap',
      'https://heap.io',
      'https://heap.io/favicon.ico',
      'Digital analytics platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Hotjar',
      'https://www.hotjar.com',
      'https://www.hotjar.com/favicon.ico',
      'Behavior analytics and user feedback',
      ['Advertising & Marketing']
    ),
    popularApp(
      'InfusionSoft',
      'https://keap.com',
      'https://keap.com/favicon.ico',
      'Sales and marketing automation',
      ['Advertising & Marketing', 'Customer Support']
    ),
    popularApp(
      'Instapage',
      'https://instapage.com',
      'https://instapage.com/favicon.ico',
      'Landing page platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'KissMetrics',
      'https://www.kissmetrics.io',
      'https://www.kissmetrics.io/favicon.ico',
      'Customer engagement automation',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Klipfolio',
      'https://www.klipfolio.com',
      'https://www.klipfolio.com/favicon.ico',
      'Business dashboard and reporting',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Later',
      'https://later.com',
      'https://later.com/favicon.ico',
      'Social media scheduling platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Leadberry',
      'https://www.leadberry.com',
      'https://www.leadberry.com/favicon.ico',
      'B2B lead generation software',
      ['Advertising & Marketing']
    ),
    popularApp(
      'LinkTree',
      'https://linktr.ee',
      'https://linktr.ee/favicon.ico',
      'Link-in-bio tool',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Litmus',
      'https://www.litmus.com',
      'https://www.litmus.com/favicon.ico',
      'Email testing and analytics',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Looker',
      'https://looker.com',
      'https://looker.com/favicon.ico',
      'Business intelligence and analytics',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Mailerlite',
      'https://www.mailerlite.com',
      'https://www.mailerlite.com/favicon.ico',
      'Email marketing automation',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Mailjet',
      'https://www.mailjet.com',
      'https://www.mailjet.com/favicon.ico',
      'Email delivery service',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Mailshake',
      'https://mailshake.com',
      'https://mailshake.com/favicon.ico',
      'Cold email outreach platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Mandrill',
      'https://mandrillapp.com',
      'https://mandrillapp.com/favicon.ico',
      'Transactional email API',
      ['Advertising & Marketing']
    ),
    popularApp(
      'ManyChat',
      'https://manychat.com',
      'https://manychat.com/favicon.ico',
      'Chatbot marketing platform',
      ['Advertising & Marketing', 'Customer Support']
    ),
    popularApp(
      'Marketo',
      'https://www.marketo.com',
      'https://www.marketo.com/favicon.ico',
      'Marketing automation software',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Mention',
      'https://mention.com',
      'https://mention.com/favicon.ico',
      'Social media monitoring tool',
      ['Advertising & Marketing']
    ),
    popularApp(
      'MixPanel',
      'https://mixpanel.com',
      'https://mixpanel.com/favicon.ico',
      'Product analytics platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Mode',
      'https://mode.com',
      'https://mode.com/favicon.ico',
      'Analytics platform for data teams',
      ['Advertising & Marketing']
    ),
    popularApp(
      'OnePageCRM',
      'https://www.onepagecrm.com',
      'https://www.onepagecrm.com/favicon.ico',
      'Simple action-focused CRM',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'Opteo',
      'https://opteo.com',
      'https://opteo.com/favicon.ico',
      'Google Ads optimization tool',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Optimizely',
      'https://www.optimizely.com',
      'https://www.optimizely.com/favicon.ico',
      'Experimentation and personalization platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Paddle',
      'https://www.paddle.com',
      'https://www.paddle.com/favicon.ico',
      'Payment infrastructure for SaaS',
      ['Accounting & Finance', 'eCommerce']
    ),
    popularApp(
      'PandaDoc',
      'https://www.pandadoc.com',
      'https://www.pandadoc.com/favicon.ico',
      'Document automation software',
      ['Administration']
    ),
    popularApp(
      'Pardo',
      'https://www.pardot.com',
      'https://www.pardot.com/favicon.ico',
      'B2B marketing automation',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Periscope Data',
      'https://www.periscopedata.com',
      'https://www.periscopedata.com/favicon.ico',
      'Data analysis platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Pipedrive',
      'https://www.pipedrive.com',
      'https://www.pipedrive.com/favicon.ico',
      'Sales CRM and pipeline management',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'Planoly',
      'https://www.planoly.com',
      'https://www.planoly.com/favicon.ico',
      'Instagram planning and scheduling',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Postmark',
      'https://postmarkapp.com',
      'https://postmarkapp.com/favicon.ico',
      'Transactional email delivery',
      ['Advertising & Marketing']
    ),
    msApp(
      'Power BI',
      'https://powerbi.microsoft.com',
      'https://powerbi.microsoft.com/favicon.ico',
      'Business analytics service',
      ['Advertising & Marketing']
    ),
    popularApp(
      'PromoRepublic',
      'https://promorepublic.com',
      'https://promorepublic.com/favicon.ico',
      'Social media management platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Prospect.io',
      'https://prospect.io',
      'https://prospect.io/favicon.ico',
      'Sales automation and prospecting',
      ['Advertising & Marketing']
    ),
    popularApp(
      'RocketLink',
      'https://rocketlink.io',
      'https://rocketlink.io/favicon.ico',
      'Link retargeting platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Salesflare',
      'https://salesflare.com',
      'https://salesflare.com/favicon.ico',
      'Intelligent CRM for small businesses',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'Salesforce',
      'https://www.salesforce.com',
      'https://www.salesforce.com/favicon.ico',
      'Customer relationship management platform',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'SalesMachine',
      'https://salesmachine.io',
      'https://salesmachine.io/favicon.ico',
      'Customer success automation',
      ['Customer Support']
    ),
    popularApp(
      'Satismeter',
      'https://www.satismeter.com',
      'https://www.satismeter.com/favicon.ico',
      'Customer satisfaction surveys',
      ['Customer Support']
    ),
    popularApp(
      'Segment',
      'https://segment.com',
      'https://segment.com/favicon.ico',
      'Customer data platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Seller Legend',
      'https://sellerlegend.com',
      'https://sellerlegend.com/favicon.ico',
      'Amazon seller analytics',
      ['eCommerce', 'Accounting & Finance']
    ),
    popularApp(
      'Sellsy',
      'https://www.sellsy.com',
      'https://www.sellsy.com/favicon.ico',
      'CRM and business management',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'SEMRush',
      'https://www.semrush.com',
      'https://www.semrush.com/favicon.ico',
      'SEO and marketing toolkit',
      ['Advertising & Marketing']
    ),
    popularApp(
      'SendGrid',
      'https://sendgrid.com',
      'https://sendgrid.com/favicon.ico',
      'Email delivery service',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Brevo',
      'https://www.brevo.com',
      'https://www.brevo.com/favicon.ico',
      'Email marketing and automation platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'SociallyMap',
      'https://sociallymap.com',
      'https://sociallymap.com/favicon.ico',
      'Social media management tool',
      ['Advertising & Marketing']
    ),
    popularApp(
      'SociallyUp',
      'https://sociallyup.com',
      'https://sociallyup.com/favicon.ico',
      'Social media growth platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'SparkPost',
      'https://www.sparkpost.com',
      'https://www.sparkpost.com/favicon.ico',
      'Email delivery service',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Sprout Social',
      'https://sproutsocial.com',
      'https://sproutsocial.com/favicon.ico',
      'Social media management platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Stripo',
      'https://stripo.email',
      'https://stripo.email/favicon.ico',
      'Email template builder',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Sumo',
      'https://sumo.com',
      'https://sumo.com/favicon.ico',
      'Marketing automation tools',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Tableau',
      'https://www.tableau.com',
      'https://www.tableau.com/favicon.ico',
      'Visual analytics platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Teamwork CRM',
      'https://www.teamwork.com/crm',
      'https://www.teamwork.com/favicon.ico',
      'Sales CRM software',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'Unbounce',
      'https://unbounce.com',
      'https://unbounce.com/favicon.ico',
      'Landing page builder',
      ['Advertising & Marketing']
    ),
    popularApp(
      'User.com',
      'https://user.com',
      'https://user.com/favicon.ico',
      'Marketing automation platform',
      ['Advertising & Marketing', 'Customer Support']
    ),
    popularApp(
      'Viral Loops',
      'https://viral-loops.com',
      'https://viral-loops.com/favicon.ico',
      'Viral marketing platform',
      ['Advertising & Marketing']
    ),
    popularApp(
      'Vtiger',
      'https://www.vtiger.com',
      'https://www.vtiger.com/favicon.ico',
      'Open source CRM',
      ['Customer Support', 'Administration']
    ),
    popularApp(
      'Wishpond',
      'https://www.wishpond.com',
      'https://www.wishpond.com/favicon.ico',
      'Marketing platform for small businesses',
      ['Advertising & Marketing']
    ),
    yandexApp(
      'Yandex Direct',
      'https://direct.yandex.com',
      'https://yastatic.net/s3/home/logos/favicon/favicon-16x16.png',
      'Advertising platform by Yandex',
      ['Advertising & Marketing']
    ),

    // Administration & Infrastructure
    popularApp(
      'Amazon Seller Central',
      'https://sellercentral.amazon.com',
      'https://www.amazon.com/favicon.ico',
      'Amazon marketplace management',
      ['eCommerce', 'Administration']
    ),
    msApp(
      'Azure Portal',
      'https://portal.azure.com',
      'https://portal.azure.com/favicon.ico',
      'Microsoft cloud platform',
      ['Administration', 'IDE & Coding Resources']
    ),
    popularApp(
      'Bitrix24',
      'https://www.bitrix24.com',
      'https://www.bitrix24.com/favicon.ico',
      'Business management platform',
      ['Administration', 'Customer Support']
    ),
    popularApp(
      'JivoChat',
      'https://www.jivochat.com',
      'https://www.jivochat.com/favicon.ico',
      'Live chat and customer messaging',
      ['Customer Support']
    ),
    popularApp(
      'ManageWP',
      'https://managewp.com',
      'https://managewp.com/favicon.ico',
      'WordPress management platform',
      ['Administration']
    ),
    popularApp(
      'New Relic',
      'https://newrelic.com',
      'https://newrelic.com/favicon.ico',
      'Application performance monitoring',
      ['Administration', 'IDE & Coding Resources']
    ),
    popularApp(
      'Pingdom',
      'https://www.pingdom.com',
      'https://www.pingdom.com/favicon.ico',
      'Website monitoring service',
      ['Administration']
    ),
    popularApp(
      'Status.io',
      'https://status.io',
      'https://status.io/favicon.ico',
      'Status page and incident management',
      ['Administration']
    ),
    popularApp(
      'StatusPage.io',
      'https://www.statuspage.io',
      'https://www.statuspage.io/favicon.ico',
      'Status and incident communication',
      ['Administration']
    ),
    yandexApp(
      'Yandex Metrika',
      'https://metrika.yandex.com',
      'https://yastatic.net/s3/home/logos/favicon/favicon-16x16.png',
      'Web analytics service by Yandex',
      ['Advertising & Marketing', 'Administration']
    ),
    yandexApp(
      'Yandex Webmaster',
      'https://webmaster.yandex.com',
      'https://yastatic.net/s3/home/logos/favicon/favicon-16x16.png',
      'Webmaster tools by Yandex',
      ['Administration']
    ),

    // AI Tools (Additional)
    googleApp(
      'Gemini',
      'https://gemini.google.com',
      'https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg',
      'AI assistant by Google',
      ['Artificial Intelligence']
    ),
    msApp(
      'Microsoft Copilot',
      'https://copilot.microsoft.com',
      'https://copilot.microsoft.com/favicon.ico',
      'AI companion by Microsoft',
      ['Artificial Intelligence']
    ),
    popularApp(
      'Deepseek',
      'https://www.deepseek.com',
      'https://www.deepseek.com/favicon.ico',
      'AI search and research assistant',
      ['Artificial Intelligence']
    ),
    popularApp(
      'Felo',
      'https://felo.ai',
      'https://felo.ai/favicon.ico',
      'AI-powered search engine',
      ['Artificial Intelligence']
    ),
    popularApp(
      'Le Chat',
      'https://chat.mistral.ai',
      'https://chat.mistral.ai/favicon.ico',
      'AI assistant by Mistral',
      ['Artificial Intelligence']
    ),
    popularApp(
      'Liner',
      'https://getliner.com',
      'https://getliner.com/favicon.ico',
      'AI-powered research assistant',
      ['Artificial Intelligence']
    ),
    popularApp(
      'Lumo',
      'https://lumo.ai',
      'https://lumo.ai/favicon.ico',
      'AI productivity assistant',
      ['Artificial Intelligence', 'Focus & Productivity']
    ),
    popularApp(
      'Merlin',
      'https://www.getmerlin.in',
      'https://www.getmerlin.in/favicon.ico',
      'AI assistant browser extension',
      ['Artificial Intelligence']
    ),
    googleApp(
      'NotebookLM',
      'https://notebooklm.google',
      'https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg',
      'AI-powered note-taking by Google',
      ['Artificial Intelligence', 'Notes & Whiteboards']
    ),
    popularApp(
      'Poe',
      'https://poe.com',
      'https://poe.com/favicon.ico',
      'Platform for AI chatbots',
      ['Artificial Intelligence']
    ),
    popularApp(
      'Soundraw',
      'https://soundraw.io',
      'https://soundraw.io/favicon.ico',
      'AI music generator',
      ['Artificial Intelligence', 'Music']
    ),
    popularApp(
      'Suno',
      'https://suno.ai',
      'https://suno.ai/favicon.ico',
      'AI music creation platform',
      ['Artificial Intelligence', 'Music']
    ),
    popularApp(
      'ThinkBuddy',
      'https://thinkbuddy.ai',
      'https://thinkbuddy.ai/favicon.ico',
      'AI thinking partner',
      ['Artificial Intelligence']
    ),

    // Educational & Reading
    popularApp(
      'Canvas',
      'https://www.instructure.com/canvas',
      'https://www.instructure.com/favicon.ico',
      'Learning management system',
      ['Educational']
    ),
    popularApp(
      'ClassDojo',
      'https://www.classdojo.com',
      'https://www.classdojo.com/favicon.ico',
      'Classroom communication app',
      ['Educational']
    ),
    popularApp(
      'Deepl',
      'https://www.deepl.com',
      'https://www.deepl.com/favicon.ico',
      'AI-powered translation service',
      ['Educational', 'Artificial Intelligence']
    ),
    popularApp(
      'Inoreader',
      'https://www.inoreader.com',
      'https://www.inoreader.com/favicon.ico',
      'RSS feed reader',
      ['Misc']
    ),
    popularApp(
      'Instapaper',
      'https://www.instapaper.com',
      'https://www.instapaper.com/favicon.ico',
      'Read-it-later service',
      ['Focus & Productivity', 'Misc']
    ),
    popularApp(
      'Kaggle',
      'https://www.kaggle.com',
      'https://www.kaggle.com/favicon.ico',
      'Data science and machine learning platform',
      ['Educational', 'IDE & Coding Resources']
    ),
    popularApp(
      'myHomework',
      'https://myhomeworkapp.com',
      'https://myhomeworkapp.com/favicon.ico',
      'Student planner and homework tracker',
      ['Educational', 'Task Management']
    ),
    popularApp(
      'Newsify',
      'https://newsify.co',
      'https://newsify.co/favicon.ico',
      'RSS news reader',
      ['Misc']
    ),
    popularApp(
      'Product Hunt',
      'https://www.producthunt.com',
      'https://www.producthunt.com/favicon.ico',
      'Discover new products and startups',
      ['Misc']
    ),
    popularApp(
      'Quora',
      'https://www.quora.com',
      'https://www.quora.com/favicon.ico',
      'Q&A community platform',
      ['Misc']
    ),
    popularApp(
      'Rfind',
      'https://rfind.io',
      'https://rfind.io/favicon.ico',
      'Research and discovery tool',
      ['Educational']
    ),
    popularApp(
      'Teachable',
      'https://teachable.com',
      'https://teachable.com/favicon.ico',
      'Online course creation platform',
      ['Educational']
    ),
    popularApp(
      'TeachBase',
      'https://teachbase.ru',
      'https://teachbase.ru/favicon.ico',
      'Learning management system',
      ['Educational']
    ),

    // Email Services (Additional)
    popularApp(
      'AOL',
      'https://mail.aol.com',
      'https://mail.aol.com/favicon.ico',
      'Email service by AOL',
      ['Email']
    ),
    popularApp(
      'CloudHQ',
      'https://www.cloudhq.net',
      'https://www.cloudhq.net/favicon.ico',
      'Cloud synchronization and productivity',
      ['Email', 'Cloud Storage']
    ),
    popularApp(
      'FastMail',
      'https://www.fastmail.com',
      'https://www.fastmail.com/favicon.ico',
      'Email hosting service',
      ['Email']
    ),
    popularApp(
      'Hushmail',
      'https://www.hushmail.com',
      'https://www.hushmail.com/favicon.ico',
      'Encrypted email service',
      ['Email']
    ),
    popularApp(
      'Mailbox.org',
      'https://mailbox.org',
      'https://mailbox.org/favicon.ico',
      'Secure email hosting',
      ['Email']
    ),
    popularApp(
      'Mailo',
      'https://www.mailo.com',
      'https://www.mailo.com/favicon.ico',
      'Privacy-focused email service',
      ['Email']
    ),
    popularApp(
      'Mailpile',
      'https://www.mailpile.is',
      'https://www.mailpile.is/favicon.ico',
      'Open-source email client',
      ['Email']
    ),
    popularApp(
      'Mail.ru',
      'https://mail.ru',
      'https://mail.ru/favicon.ico',
      'Email service by Mail.ru',
      ['Email']
    ),
    popularApp(
      'Mixmax',
      'https://www.mixmax.com',
      'https://www.mixmax.com/favicon.ico',
      'Email productivity platform',
      ['Email', 'Focus & Productivity']
    ),
    popularApp(
      'Polymail',
      'https://polymail.io',
      'https://polymail.io/favicon.ico',
      'Email platform for teams',
      ['Email']
    ),
    popularApp(
      'ProtonMail',
      'https://protonmail.com',
      'https://protonmail.com/favicon.ico',
      'Secure encrypted email',
      ['Email']
    ),
    popularApp(
      'RainLoop',
      'https://www.rainloop.net',
      'https://www.rainloop.net/favicon.ico',
      'Web-based email client',
      ['Email']
    ),
    popularApp(
      'RoundCube',
      'https://roundcube.net',
      'https://roundcube.net/favicon.ico',
      'Web-based IMAP email client',
      ['Email']
    ),
    popularApp(
      'SquirrelMail',
      'https://squirrelmail.org',
      'https://squirrelmail.org/favicon.ico',
      'Web-based email client',
      ['Email']
    ),
    popularApp(
      'TwoBird',
      'https://www.twobird.com',
      'https://www.twobird.com/favicon.ico',
      'Email and tasks in one app',
      ['Email', 'Task Management']
    ),
    popularApp(
      'Yahoo Mail',
      'https://mail.yahoo.com',
      'https://mail.yahoo.com/favicon.ico',
      'Email service by Yahoo',
      ['Email']
    ),
    yandexApp(
      'Yandex Mail',
      'https://mail.yandex.com',
      'https://yastatic.net/s3/home/logos/favicon/favicon-16x16.png',
      'Email service by Yandex',
      ['Email']
    ),
    popularApp(
      'Zimbra',
      'https://www.zimbra.com',
      'https://www.zimbra.com/favicon.ico',
      'Email and collaboration suite',
      ['Email']
    ),
    zohoApp(
      'Zoho Email',
      'https://www.zoho.com/mail',
      'https://www.zoho.com/favicon.ico',
      'Business email hosting',
      ['Email']
    ),

    // Developer Tools (Additional)
    appleApp(
      'Apple Developer',
      'https://developer.apple.com',
      'https://developer.apple.com/favicon.ico',
      'Apple development platform',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'BrowserStack',
      'https://www.browserstack.com',
      'https://www.browserstack.com/favicon.ico',
      'Cross-browser testing platform',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Bubble',
      'https://bubble.io',
      'https://bubble.io/favicon.ico',
      'No-code app development platform',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'CircleCI',
      'https://circleci.com',
      'https://circleci.com/favicon.ico',
      'Continuous integration and delivery',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'CodeAnywhere',
      'https://codeanywhere.com',
      'https://codeanywhere.com/favicon.ico',
      'Cloud-based IDE',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'CodeCov',
      'https://codecov.io',
      'https://codecov.io/favicon.ico',
      'Code coverage reporting',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'CodeGiant',
      'https://codegiant.io',
      'https://codegiant.io/favicon.ico',
      'Project management for developers',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'CodeEnvy',
      'https://codenvy.com',
      'https://codenvy.com/favicon.ico',
      'Cloud development workspace',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'CodeSandBox',
      'https://codesandbox.io',
      'https://codesandbox.io/favicon.ico',
      'Online code editor and sandbox',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'CodeShip',
      'https://codeship.com',
      'https://codeship.com/favicon.ico',
      'Continuous integration platform',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'DevDocs',
      'https://devdocs.io',
      'https://devdocs.io/favicon.ico',
      'API documentation browser',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'DigitalOcean',
      'https://www.digitalocean.com',
      'https://www.digitalocean.com/favicon.ico',
      'Cloud infrastructure provider',
      ['IDE & Coding Resources', 'Administration']
    ),
    popularApp(
      'Eclipse Che',
      'https://www.eclipse.org/che',
      'https://www.eclipse.org/favicon.ico',
      'Cloud-based IDE',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Fabric',
      'https://get.fabric.io',
      'https://get.fabric.io/favicon.ico',
      'Mobile app development platform',
      ['IDE & Coding Resources']
    ),
    googleApp(
      'Firebase',
      'https://firebase.google.com',
      'https://firebase.google.com/favicon.ico',
      'App development platform',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Gitscrum',
      'https://www.gitscrum.com',
      'https://www.gitscrum.com/favicon.ico',
      'Agile project management',
      ['IDE & Coding Resources', 'Product Management']
    ),
    popularApp(
      'GraphCool',
      'https://www.graph.cool',
      'https://www.graph.cool/favicon.ico',
      'GraphQL backend platform',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'HackerOne',
      'https://www.hackerone.com',
      'https://www.hackerone.com/favicon.ico',
      'Bug bounty and security platform',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Heroku',
      'https://www.heroku.com',
      'https://www.heroku.com/favicon.ico',
      'Cloud platform as a service',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Hostwinds',
      'https://www.hostwinds.com',
      'https://www.hostwinds.com/favicon.ico',
      'Web hosting services',
      ['IDE & Coding Resources', 'Administration']
    ),
    popularApp(
      'IT Tools',
      'https://it-tools.tech',
      'https://it-tools.tech/favicon.ico',
      'Collection of handy tools for developers',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Kamatera',
      'https://www.kamatera.com',
      'https://www.kamatera.com/favicon.ico',
      'Cloud infrastructure services',
      ['IDE & Coding Resources', 'Administration']
    ),
    popularApp(
      'Koding',
      'https://www.koding.com',
      'https://www.koding.com/favicon.ico',
      'Cloud-based development environment',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Linode',
      'https://www.linode.com',
      'https://www.linode.com/favicon.ico',
      'Cloud computing platform',
      ['IDE & Coding Resources', 'Administration']
    ),
    popularApp(
      'OneSignal',
      'https://onesignal.com',
      'https://onesignal.com/favicon.ico',
      'Push notification service',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'PagerDuty',
      'https://www.pagerduty.com',
      'https://www.pagerduty.com/favicon.ico',
      'Incident response platform',
      ['IDE & Coding Resources', 'Administration']
    ),
    popularApp(
      'PaperTrail',
      'https://www.papertrail.com',
      'https://www.papertrail.com/favicon.ico',
      'Cloud-hosted log management',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Sentry',
      'https://sentry.io',
      'https://sentry.io/favicon.ico',
      'Application monitoring and error tracking',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'travisCI',
      'https://travis-ci.com',
      'https://travis-ci.com/favicon.ico',
      'Continuous integration service',
      ['IDE & Coding Resources']
    ),
    popularApp(
      'Zenhub',
      'https://www.zenhub.com',
      'https://www.zenhub.com/favicon.ico',
      'Project management for GitHub',
      ['IDE & Coding Resources', 'Product Management']
    ),
  ])
);

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
  'Yandex',
  'Zoho',
];
