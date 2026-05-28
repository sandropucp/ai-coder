# Gemini CLI

## Install and Setup

### Install

- npm install -g @google/gemini-cli

### Setup

- Update Settings.json to update context to add Agents.md

```json
 "context": {
    "fileName": ["AGENTS.md", "GEMINI.md"]
  }
```

## LogIn

- Use website

## Commands

- /init
- /auth
- /memory refresh
- /directory
- /model
- /settings

## Start

1. /init
2. /settings
3. /model
4. /theme

## GitHub Setup

git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:sandropucp/ai-coder.git
git push -u origin master

git checkout master
git pull
git checkout -b feature/step_01_initial
UPDATES
git push --set-upstream origin feature/step_01_initial
create PR to merge to master

## General Comments

### Step 1

1. cd 01_kanban
2. When open test in browser close broser, Ctrl + C to finish it and tell the agent continue
3. Sometimes when you ask the agent to fix something it tries many times and it think he did not fix but he did. Test it in your side and tell him he already fix it.

### Step 2

1. cd 02_pm
2. Please review Gemini.md and the plan and let me know if you have any question.Do not do any work yet.