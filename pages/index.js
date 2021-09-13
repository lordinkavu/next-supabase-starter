import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>next-app</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>hello world!</main>
      <Link href="/auth" passHref>
        <button>auth</button>
      </Link>
    </div>
  );
}
