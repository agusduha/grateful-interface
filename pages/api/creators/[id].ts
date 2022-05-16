import type { NextApiRequest, NextApiResponse } from "next";
import { Creator, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Error = { error: string };
type Data = Creator | Error;

const getCreator = async (key: string) => {
  if (key.startsWith("0x")) {
    return await prisma.creator.findUnique({
      where: { address: key },
    });
  } else if (!isNaN(parseInt(key))) {
    return await prisma.creator.findUnique({
      where: { id: Number(key) },
    });
  } else {
    return await prisma.creator.findUnique({
      where: { tag: key },
    });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const {
    method,
    query: { id },
  } = req;

  switch (method) {
    case "GET":
      const creator = await getCreator(String(id));

      if (creator) {
        res.status(200).json(creator);
      } else {
        res.status(404).json({ error: "Creator doesn't exist" });
      }

      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
