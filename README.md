# BuildWithInnovation

# Instructions for the API

## User Routes
For registering

```POST``` ```http:localhost:5000/api/auth/register```

For logging in

```POST``` ```http:localhost:5000/api/auth/register```

For viewing their own details

```GET``` ```http://localhost:5000/api/user/get```

For updating fields like name, password, profile_image. Email, Phone Number cannot be changed

```PATCH``` ```http://localhost:5000/api/user/update```


For deleting their own account.

```DELETE``` ```http://localhost:5000/api/user/update```

## Admin Routes
For registering as an admin

```POST``` ```http:localhost:5000/api/admin/become-admin```

For logging in as admin

```POST``` ```http:localhost:5000/api/admin/login```

For viewing details of all users, but not admins.

```GET``` ```http://localhost:5000/api/admin/users```

For deleting a specific user by their ID

```DELETE``` ```http://localhost:5000/api/admin/delete-user/:userID```

For deleting all users, but not admins

```DELETE``` ```http://localhost:5000/api/admin/delete-all-users```

For updating details of a user by their userID
Admin can modify any details of a user

```PATCH``` ```http://localhost:5000/api/admin/update-user/:userID```









