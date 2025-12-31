# rpxd-next-prisma-rsc

rpxd project with next, prisma, and rsc.

## Development

```bash
npm install

# fill out .env values
cp .env.example .env

npx prisma migrate deploy
npx prisma generate

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## rpxd

rpxd is included in the project and allows for rapid scaffolding.

To generate a new resource:

```bash
npx rpxd generate <feature-singular> [...attribute:attribute-type]
npx rpxd generate todo name done:boolean

npx prisma format
npx prisma migrate dev --name adds-todo
```

See [github:olmesm/rpxd](https://github.com/olmesm/rpxd) and `./_rpxd` for more.
