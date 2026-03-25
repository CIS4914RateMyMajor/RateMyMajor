This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
first, install packages:
```bash
pnpm install
# or 
npm install
```

then, spin up the mysql db container:
```bash
docker-compose up -d
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

To populate the database with our shema or after modifying the drizzle schema, you can run:
```bash
npx drizzle-kit push
```
or
```bash
npm run db:push
```

to reflect changes. see [drizzle docs](https://orm.drizzle.team/docs/get-started/mysql-new) for more info

Open [http://localhost:3000](http://localhost:3000) with your browser to see the webpage.

Run ```npm run db:studio``` to see the Drizzle database studio in your browser.

To bring down the database and delete it's volumes, run:
```bash
docker-compose down -v
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
