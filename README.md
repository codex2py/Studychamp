# StudyChamp

**A study tracker I built after a conversation about distractions, study time, and staying consistent.**

[Try StudyChamp](https://study-champ.netlify.app/)

## Where the idea came from

StudyChamp started with a conversation I had with a friend who studies medicine.

She mentioned that she was getting distracted while studying and wanted a way to account for her time. That got me thinking about how difficult it can be to keep track of actual study hours, especially when you're dealing with several courses and a lot of material.

I started thinking about what a website for this could look like. I wanted somewhere a student could organise their courses, divide them into topics, track their study sessions, and see how consistently they were actually studying.

That's how I started StudyChamp.

## From Figma to a working website

I started with Figma before writing any code. I wanted to have an idea of how the application would look and how someone would move between its different sections.

After settling on the design, I moved into VS Code and started setting up the project with React and Vite. I used JavaScript, Tailwind CSS v4 and React Router.

I didn't build everything in one go. I worked on the application structure first, then the welcome screen, sidebar and navigation. From there, I started working on the actual pages and connecting them.


## What I built

Here are the main parts of StudyChamp:

- **Dashboard:** Shows daily focus time, study streaks, daily goals, weekly activity and a summary of courses.
- **My Courses:** Lets users add courses and organise what they're studying.
- **Course Details:** Each course can contain smaller topics, which users can mark as completed.
- **Study Sessions:** Keeps a history of completed focus sessions, including the time spent studying and distractions logged.
- **Progress:** Shows study activity and helps users keep track of their consistency.
- **Settings:** Contains personal preferences, study goals and timer settings.

The dashboard also has a focus timer with pause, resume and reset controls. There's a distraction counter too, so users can log when they lose focus instead of pretending every minute of a session was productive.

## Some screenshots

<img width="1918" alt="StudyChamp dashboard" src="https://github.com/user-attachments/assets/784c9e70-50b2-4e31-8adb-3b818d156022" />

<img width="947" alt="StudyChamp courses" src="https://github.com/user-attachments/assets/75278d41-133c-4d0b-af58-c41893d550b4" />

<img width="950" alt="StudyChamp course details" src="https://github.com/user-attachments/assets/a84cf848-298c-4861-8365-e200308ab53a" />

## A few things I had to figure out

One part that took some thought was getting topic completion and course progress to stay consistent across the application.

If a user completes a topic, that change should be reflected wherever course progress is displayed. I also had to work on saving completed study sessions and using that saved information to calculate the dashboard statistics.

I used browser localStorage for the first version instead of setting up a backend. It was a simpler way to make the application usable while I was still learning and building the frontend.

There were also smaller things along the way, like getting Tailwind CSS v4's custom colours working, handling navigation and making the layouts work on different screen sizes.

## Running it locally

You'll need Node.js and npm.

```bash
git clone https://github.com/codex2py/Studychamp.git

cd Studychamp

npm install

npm run dev
```

To create a production build:

```bash
npm run build
```

## Technologies

- React
- JavaScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide React

## Data storage

StudyChamp currently uses browser localStorage. Courses, topics, study sessions, user details and preferences are saved locally.

There is no account system or remote database in this version. Saved information is tied to the browser and device being used.

## What's next?

I'd like to explore better ways of helping students work through difficult academic material, particularly breaking large topics into smaller, more manageable sections.

I'd also like to look into offline support and more detailed study analytics.

For now, I'm happy to have taken an idea from a conversation, planned it in Figma, and turned it into a working website.

## AI assistance

I used AI tools during development to help explain concepts, troubleshoot errors and work through some implementation problems. I also used them as a learning aid while building features. The project was an opportunity for me to practise frontend development and understand how the different parts of a React application fit together.
