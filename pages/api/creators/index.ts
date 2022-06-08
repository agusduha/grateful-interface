// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Creator, PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../../ironConfig";

const prisma = new PrismaClient();

type Error = { error: string };
type Data = Creator | Creator[] | Error;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { method } = req;
  switch (method) {
    case "GET":
      const creators = await prisma.creator.findMany();
      res.status(200).json(creators);
      break;

    case "POST":
      if (!req.session.siwe) {
        res.status(401).json({ error: "You have to first sign in" });
        break;
      }

      const address = req.session.siwe?.address;
      const { name, tag, description } = req.body;
      const result = await prisma.creator.create({ data: { address, name, tag, description } });
      res.status(200).json(result);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
