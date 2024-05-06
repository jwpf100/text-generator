# text-generator

## Info

An app integrated with ChatGPT to allow easy generation of cover letters, taking inputs such as resume and job description to create personalised letters. 

It is written using Typescript, React, Express/Node
Authenticated with Auth0

## Instructions

1. Sign up to a [chatgpt api account](https://platform.openai.com/)
2. Sign up to an [auth0 account](https://manage.auth0.com/)
3. Create `.env` files in `packages/text-generator-client` and `packages/text-generator-api`.  There are `.env.example` in each directory to show the variables that need to be added. 
4. From root directory run `npm i`
5. In `packages/text-generator-api` run `npm run build && npm run start:dev`
6. In `packages/text-generator-client` run `npm run start:dev`
7. The app should be running at [http://localhost:5173](http://localhost:5173)

### Notes

API hosted on https://dashboard.render.com/
Client hosted on https://vercel.com/

### TODOs
- [x] Test breaking down initial prompt into smaller chucks to make it easier for ChatGPT to understand
- [ ] Tokenize and reduce the size of resume/job descriptions pasted in
- [ ] Add in ability to enter name of person the letter is to
- [ ] Security - Add something to limit how many requests can be made per account
- [ ] Design - Style the app
- [ ] Add some info to the home page
- [ ] Remove redundant code
