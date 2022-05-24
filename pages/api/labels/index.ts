// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Label, PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../../ironConfig";

const prisma = new PrismaClient();

type Error = { error: string };
type Data = Label | Error;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { method } = req;
  switch (method) {
    case "GET":
      handleGET(req, res);
      break;

    case "POST":
      if (!req.session.siwe) {
        res.status(401).json({ error: "You have to first sign in" });
        break;
      }

      const user = req.session.siwe?.address;
      const { creator, content } = req.body;
      const result = await prisma.label.create({ data: { user, creator, content } });
      res.status(200).json(result);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const handleGET = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { user, creator } = req.query;
  const label = await prisma.label.findUnique({
    where: { user_creator: { user: String(user), creator: String(creator) } },
  });

  if (label) {
    res.status(200).json(label);
  } else {
    res.status(404).json({ error: "Label doesn't exist" });
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
