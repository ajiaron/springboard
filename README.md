# Springboard

Springboard is a donation discovery platform I built as an undergraduate project (~3 years ago). The idea was to help donors find high-performing charities, compare them using Charity Navigator–sourced ratings, and contribute through a simple donation flow (catalog browsing, organization profiles, basket/checkout, and light social features like campaigns and donation feeds).

## What it was supposed to do

- Browse and filter a catalog of curated nonprofits
- View organization profiles with rating and financial-style metrics
- Donate via Stripe (and related basket / confirmation flows)
- Maintain a personal archive of saved charities
- Support user accounts (originally via AWS Cognito / Amplify)

## About this codebase

This is an early, independently built full-stack app (React + Express + MySQL). It reflects where I was as an engineer at the time. Recent work has focused on making it presentable again—responsive layout fixes and backend security hardening—without rewriting it into a new product.

## Current status / limitations

I no longer pay for the original production infrastructure or third-party subscriptions, so several pieces that worked in the live deployment are not available out of the box:

- **Custom domain** — no longer registered / pointed at this project
- **AWS hosting** — Amplify / Cognito and related cloud resources are not actively maintained or funded
- **Charity Navigator API key** — no longer subscribed; live pulls from [Charity Navigator’s developer API](https://developer.charitynavigator.org/) require your own key

Locally, the app can still run in demo mode with a seeded MySQL dataset. Charity Navigator sync (`npm run sync:charities` in `server/`) is wired up if you supply your own `CHARITY_NAVIGATOR_API_KEY`.

## Stack

- **Client:** React (Create React App), SCSS, React Router, Amplify (optional)
- **Server:** Express, MySQL, Stripe, JWT/Cognito auth (with demo-mode bypass)

See `server/.env.example` and `client/.env.development` for local configuration placeholders.
