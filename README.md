# StudyChamp

StudyChamp is a study productivity and tracking website I built to make it easier to organise courses, break subjects into topics, and keep track of actual study time.

The idea came from conversations about how difficult it can be to manage bulky academic content, stay consistent with studying, and keep track of where your time goes. I wanted to build something that brings some of those everyday study needs together in one place.

## What it does

- **Dashboard:** See your daily focus time, study streak, daily goal, weekly activity, and courses at a glance.
- **My Courses:** Add courses, include course details, search and sort your course list.
- **Course Details:** Break each course into smaller topics, mark topics as completed, and track course progress.
- **Study Sessions:** Keep a record of completed focus sessions, search through past sessions, filter them, and review your study history.
- **Progress:** View your study activity and see how your focus time changes over time.
- **Settings:** Change your name, set daily study goals, adjust focus and break durations, and customise your preferences.

The dashboard also has a built-in focus timer with pause, resume, reset, and distraction logging.

## A look inside
<img width="1918" height="878" alt="Screenshot 2026-10-10 182205" src="https://github.com/user-attachments/assets/784c9e70-50b2-4e31-8adb-3b818d156022" />
<img width="947" height="437" alt="image" src="https://github.com/user-attachments/assets/75278d41-133c-4d0b-af58-c41893d550b4" />
<img width="950" height="440" alt="image" src="https://github.com/user-attachments/assets/a84cf848-298c-4861-8365-e200308ab53a" />



## Built with

- React
- JavaScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide React

I used React to build the interface and organise the different pages into reusable components. Tailwind handles the styling, while React Router takes care of navigation.

## Running it locally

You'll need Node.js and npm installed.

```bash
# Clone the repository
git clone https://github.com/codex2py/Studychamp.git

# Enter the project folder
cd Studychamp

# Install dependencies
npm install

# Start the development server
npm run dev
```

Vite will provide a local URL in your terminal, usually `http://localhost:5173`.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## How data is stored

StudyChamp currently uses the browser's `localStorage` to save information.

This includes:
- Your name
- Courses and topics
- Completed study sessions
- Study preferences and goals

There's no backend or database at the moment. This keeps the first version simple and means you can use the main features without creating an account.

Your information stays in the browser where you use the application, so clearing its stored site data will remove your saved StudyChamp information.

## A few things I learned while building it

One of the more interesting parts of this project was figuring out how to make different pages work with the same saved information.

For example, completing a topic shouldn't just change its appearance on the course details page. It should also affect the course progress shown elsewhere in the application.

I also spent time working on the focus timer, saving completed sessions, calculating study streaks, and making the dashboard statistics reflect actual saved activity rather than fixed numbers.

Getting Tailwind CSS v4's custom theme configuration working properly was another part of the process.

There's still room to expand StudyChamp, particularly around helping students work through difficult study materials. For now, I wanted to get the core organisation and tracking features working properly.

## What's next?

Some things I'd like to explore in future versions include:

- Better tools for breaking down difficult academic topics.
- More detailed study analytics.
- Progressive Web App support and offline access.
- A more advanced way to organise and review study materials.

## License

This project is open source. 
