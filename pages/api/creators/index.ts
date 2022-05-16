// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Creator, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Data = Creator | Creator[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  switch (method) {
    case "GET":
      const creators = await prisma.creator.findMany();
      res.status(200).json(creators);
      break;

    case "POST":
      const { address, name, tag } = req.body;
      const result = await prisma.creator.create({ data: { address, name, tag } });
      res.status(200).json(result);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
