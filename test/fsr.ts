import { FileSystemRouter, bunsai } from "bunsai2/fsr";

const router = await FileSystemRouter.init({
  dir: "./dist",
  style: "nextjs",
  bunsai: await bunsai(),
});

Bun.serve({
  fetch(req) {
    const matched = router.match(req);

    if (matched) return new Response(Bun.file(matched.filePath));

    return new Response("NOT FOUND", { status: 404 });
  },
});
