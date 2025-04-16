import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>LayerZero Token Bridge</title>
        <meta
          name="description"
          content="Cross-chain token transfer using LayerZero"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-primary py-6 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center text-white">
              LayerZero Token Bridge
            </h1>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-primary py-4 shadow-inner">
          <div className="container mx-auto px-4 text-center text-white">
            <p>LayerZero Omnichain OFT Demo</p>
          </div>
        </footer>
      </div>
    </>
  );
}
