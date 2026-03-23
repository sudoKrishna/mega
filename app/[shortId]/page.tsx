import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis"
import { redirect } from "next/navigation"

await redis.set("foo", "bar");


type PageProps = {
  params: {
    shortId: string;
  };
};

export default async function Page({ params }: PageProps) {

  const { shortId } = await params;

  const cachedUrl = await redis.get(shortId)

  if(cachedUrl) {
    return redirect(cachedUrl)
  }
  const url = await prisma.url.findUnique({
    where: { shortId },
  });

  if (!url) {
    return <div>Link not found</div>;
  }
    
  await redis.set(shortId, url.originalUrl ,"EX" , 60 * 60)
  
  return redirect(url.originalUrl);
}