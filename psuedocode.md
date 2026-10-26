 Pseudocode

Register
FUNCTION register(formData)
    IF any field is empty THEN show error and STOP
    IF password is not strong THEN show error and STOP
    IF cell number is not 10 digits THEN show error and STOP

    email = lowercase(trim(formData.email))
    IF a user with this email already exists THEN show error and STOP

    hashedPassword = bcrypt.hash(formData.password)
    SAVE new user (with hashedPassword) to json-server
    show success message
    go to the Login page
END FUNCTION
Login
FUNCTION login(email, password)
    user = FIND user by email on json-server
    IF user does not exist OR bcrypt.compare(password, user.password) is false THEN
        show "Incorrect email or password" and STOP
    END IF

    sessionUser = user WITHOUT the password
    STORE sessionUser in Redux (and localStorage)
    go to the Home page
END FUNCTION
Protected and public routes
FUNCTION ProtectedRoute
    IF no logged-in user THEN go to /login
    ELSE show the page
END FUNCTION

FUNCTION PublicRoute
    IF there is a logged-in user THEN go to /
    ELSE show the page
END FUNCTION
Load the Home page
ON Home page open
    lists  = GET lists where userId = current user's id
    shared = GET lists where sharedWith contains current user's email
    STORE lists and shared in Redux
    turn off the loading message
END
Add an item
FUNCTION addItem(values)
    IF list name or item name is empty THEN show error and STOP
    IF quantity is not a whole number of 1 or more THEN show error and STOP

    item = new item with a unique id and the current date
    list = FIND the list whose name matches (ignoring case)

    IF list exists THEN
        SAVE the list with the new item added to its items
    ELSE
        SAVE a new list containing only this item
    END IF

    UPDATE Redux with the saved list
    show success message and close the popup
END FUNCTION
Edit, delete and rename
FUNCTION editItem(listId, itemId, values)
    list = FIND the full list in Redux by listId
    list.items = MAP over items: replace the one with itemId, keep the rest
    SAVE list, UPDATE Redux, show success

FUNCTION deleteItem(listId, itemId)
    list = FIND the full list in Redux by listId
    list.items = FILTER out the item with itemId
    SAVE list, UPDATE Redux, show success

FUNCTION deleteList(list)
    IF the user does not confirm THEN STOP
    DELETE the list from json-server
    REMOVE the list from Redux

FUNCTION renameList(listId, newName)
    IF newName is empty THEN show error and STOP
    IF another list already has this name THEN show error and STOP
    list = FIND the full list in Redux by listId
    SAVE list with the new name, UPDATE Redux, show success

The full list is always taken from Redux, never from the list on screen, because the list on screen may be filtered and saving it would delete the hidden items.

Share a list
FUNCTION shareList(list, email)
    email = lowercase(trim(email))
    IF email is empty THEN error and STOP
    IF email is the current user's email THEN error and STOP
    IF list.sharedWith already contains email THEN error and STOP
    IF no registered user has this email THEN error and STOP

    SAVE list with email added to sharedWith
    UPDATE Redux, show success
END FUNCTION
Update the profile
FUNCTION saveLoginDetails(newEmail, newPassword, currentPassword)
    IF nothing changed THEN show "Nothing to change" and STOP
    IF currentPassword is empty THEN error and STOP
    IF newPassword is given AND is not strong THEN error and STOP

    stored = GET the user from json-server
    IF bcrypt.compare(currentPassword, stored.password) is false THEN error and STOP

    IF email changed AND another user already has it THEN error and STOP
    IF password changed THEN changes.password = bcrypt.hash(newPassword)

    SAVE changes, UPDATE Redux (without the password), show success
END FUNCTION
Forgot password
FUNCTION resetPassword(email, cellNumber, newPassword)
    IF any field is empty THEN error and STOP
    IF newPassword is not strong THEN error and STOP

    user = FIND user by email
    IF user does not exist OR user.cellNumber does not match THEN
        show one generic error and STOP      // so the page cannot be used to find out who has an account
    END IF

    SAVE bcrypt.hash(newPassword) as the user's password
    go to the Login page
END FUNCTION


Algorithm: search, sort and filter

The search keyword, the sort choice and the category are kept in the URL, for example /?search=milk&sort=name&category=Dairy. The URL is the single source of truth, so a refresh, a bookmark or a typed URL always gives the same view.

Input: all lists, search, sort, category Output: the lists to show

FUNCTION prepareLists(lists, search, sort, category)
    term = lowercase(trim(search))
    isFiltering = (term is not empty) OR (category is not empty)

    result = empty list
    FOR EACH list IN lists
        matching = items of the list WHERE
                       lowercase(item.name) contains term
                       AND (category is empty OR item.category equals category)

        sorted = COPY of matching, ordered by:
                     "name"     -> item name, A to Z
                     "category" -> category A to Z, then name A to Z
                     "date"     -> date added, newest first

        IF NOT isFiltering OR sorted is not empty THEN
            ADD a copy of the list with items = sorted TO result
        END IF
    END FOR

    RETURN result
END FUNCTION

Reading the URL safely

search   = URL "search" value, or "" if missing
sort     = URL "sort" value IF it is name, category or date, ELSE "date"
category = URL "category" value IF it is a real category, ELSE ""

An invalid value such as ?sort=banana falls back to the default, so a bad URL never breaks the page.

Why this design

The lists in Redux are never changed, because every list and its items are copied before sorting. The original data stays complete, so editing while a filter is on does not lose hidden items.
Running time: filtering is O(n) over all items and sorting is O(m log m) for the m items left in each list. This is fast for a personal shopping list.
The result is recalculated only when the lists, search, sort or category change (useMemo).
Password hashing
SIGN UP:  storedHash = bcrypt.hash(password, 10 rounds)      // random salt included
LOG IN:   isMatch    = bcrypt.compare(typedPassword, storedHash)

A hash cannot be reversed, so the password is never "decrypted". At login the typed password is hashed with the salt from the stored hash and the results are compared.
