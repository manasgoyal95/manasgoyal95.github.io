export type PersonalProject = {
  name: string;
  year: string;
  description: string;
  stack: string[];
  repo: string;
  demo?: string;
  /** Shown next to the demo link, e.g. free-tier cold-start warning. */
  demoNote?: string;
  /** Slug of a full case study under /work, if one exists. */
  caseStudy?: string;
};

export const personalProjects: PersonalProject[] = [
  {
    name: 'Pulse — realtime chat',
    year: '2026',
    description:
      'Link-is-access chat rooms with persistence, live presence, typing indicators and reconnect-with-replay. Go + raw WebSockets on the server, React + TypeScript client embedded into a single static binary.',
    stack: ['Go', 'WebSockets', 'React', 'TypeScript', 'SQLite'],
    repo: 'https://github.com/manasgoyal95/realtime-chat',
    demo: 'https://pulse-chat-7puv.onrender.com',
    demoNote: 'free tier — first load wakes the server, ~15s',
    caseStudy: 'pulse-realtime-chat',
  },
  {
    name: 'Code-Sync',
    year: '2023',
    description:
      'Real-time collaborative code editor. Room-based sessions over Socket.IO: every keystroke is broadcast to the room, late joiners receive the current buffer on connect, and join/leave presence is shown live. CodeMirror editor in React, Express server.',
    stack: ['React', 'Socket.IO', 'CodeMirror', 'Express'],
    repo: 'https://github.com/manasgoyal95/Code-Sync',
    demo: 'https://code-sync-puce.vercel.app',
  },
  {
    name: 'InShare',
    year: '2023',
    description:
      'File-sharing service: upload a file (up to 100 MB), receive a UUID download link, and optionally email it to a recipient with a 24-hour expiry. Multer for uploads, file metadata in MongoDB, Nodemailer for delivery, server-rendered EJS download pages.',
    stack: ['Node.js', 'Express', 'MongoDB', 'Multer', 'Nodemailer'],
    repo: 'https://github.com/manasgoyal95/InShare',
  },
  {
    name: 'Expense Tracker',
    year: '2023',
    description:
      'Personal finance tracker with categorised income and expense transactions, filtering by type and rolling date range, and full edit/delete. Express + MongoDB REST API with a React client.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    repo: 'https://github.com/manasgoyal95/Expense-Tracker',
  },
];
