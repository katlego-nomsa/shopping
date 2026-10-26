Shoplist: Shopping List App

A shopping list web app built with React, TypeScript, Redux Toolkit and json-server. Users can register, log in, create shopping lists, add items with categories, notes and images, search, sort and filter them, and share lists with other users.

This is Task 5 of the ReactTS course (Lesson 5: State Management).

Pages
Page	Who can see it
Login, Register, Forgot password	Logged-out users only
Home, Profile	Logged-in users only
Features

Accounts

Register with email, password, name, surname and cell number.
Log in, and stay logged in after a refresh.
Strong password rules (8+ characters, upper and lower case, a number and a special character) with a live strength meter.
Show or hide the password with the eye icon (it hides again after 3 seconds).
Forgot password: reset by confirming your email and cell number.
Profile page: view your details, then click Edit to update your personal details, email or password.

Shopping lists

Create a list and add items with name, quantity, category, optional notes and an image.
Add more items to an existing list, edit or delete items, rename a list, delete a list.
Search items by name (?search=milk).
Sort by name, category or date added (?sort=name).
Filter by category (?category=Dairy).
Search, sort and category are shown in the URL, and editing the URL updates the page.
Share a list with another registered user by email. They see it read-only under "Shared with you".

Experience

Notifications after every action, and "Saving..." states on buttons.
Buttons and links show a pointer cursor and change colour on hover.
Responsive layout, tested at 320px, 480px, 768px and 1024px.
Tech stack
React 18 with TypeScript (Vite)
Redux Toolkit and React Redux (state management)
React Router (navigation and protected routes)
json-server (database)
bcryptjs (password hashing)
react-hot-toast (notifications)
How to run

You need Node.js installed. Use two terminals.

bash
# install the packages
npm install

# terminal 1: start the database on http://localhost:3001
npm run server

# terminal 2: start the app on http://localhost:5173
npm run dev

Open http://localhost:5173 and register a new account.

State management
Kind of state	Where it lives
Logged-in user	Redux (userSlice), also saved in localStorage so a refresh keeps you logged in
Shopping lists and shared lists	Redux (listsSlice), loaded from json-server
Search, sort and category	The URL (useSearchParams)
Form drafts, open popups, saving flags	useState inside the component that uses them

Every change is saved to json-server first, then Redux is updated so the screen changes.

Project structure
src/
  components/   reusable pieces (FormInput, PasswordStrength, ListCard, ItemRow, ItemModal, ShareModal, ...)
  pages/        Login, Register, ForgotPassword, Home, Profile
  store/        Redux store, slices and typed hooks
  types/        TypeScript types
  utils/        API functions, constants, helpers and password rules
docs/           planning, pseudocode and algorithm
db.json         the json-server database
Planning documents

The step-by-step plan, pseudocode and algorithm are in docs/PLANNING.md.

Security and privacy
Passwords are hashed with bcrypt before they are saved. A hash cannot be reversed, so a password is never "decrypted". At login the typed password is hashed and compared with the saved hash using bcrypt.compare.
The password hash is never kept in Redux or localStorage. Only the safe user fields are stored in the browser.
Changing an email or password requires the current password.
Each user only sees their own lists and the lists shared with them.
The forgot-password page gives the same error whether the email or the cell number is wrong, so it cannot be used to find out who has an account.
Known limitations
json-server has no real access control, so the app hides other users' data in the browser only. A production app needs a backend that checks permissions.
Forgot password confirms the email and cell number instead of sending an email link, because the app has no email service. A production app would send a time-limited reset link.
Item images are stored in db.json as text (base64), so they are limited to 500 KB each.
Lists are shared by email. If a user changes their email, lists shared with the old address stop appearing for them.
Design

The design was made in Figma: [add your Figma link here]

Screenshots:

Login	Home
Login	Home
Profile	Mobile (320px)
Profile	Mobile
