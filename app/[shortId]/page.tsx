import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation"


type PageProps = {
  params: {
    shortId: string;
  };
};

export default async function Page({ params }: PageProps) {

  const { shortId } = await params;


  const url = await prisma.url.findUnique({
    where: { shortId },
  });

  if (!url) {
    return <div>Link not found</div>;
  }

  redirect(url.originalUrl);
}