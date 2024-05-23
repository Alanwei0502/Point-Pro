# Point Pro Backend

express api server with supabase and prisma schema


## Set up environment

```shell
npm i

# copy local settings
cp .env.example .env

```

## Set up local db

```shell
npx supabase start
npx prisma migrate deploy
npx prisma db seed # add seed data
```

## Set up api server

```shell
npm run dev
```

## Migrations

```shell
# create migration file
npx prisma migrate dev -n [migration_folder_name]

# update schema in db
npx prisma db push

# add seed data
npx prisma db seed

# generate prisma client
npx prisma generate
```
## Ref

[supabase](https://supabase.com/docs)
[prisma](https://www.prisma.io/docs/concepts/components/prisma-schema)

