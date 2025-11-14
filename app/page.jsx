import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {


  const routrer = useRouter()

  routrer.push("/")








  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     
    </div>
  );
}
