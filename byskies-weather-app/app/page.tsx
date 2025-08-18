import Header from '@/components/shared/header';

export default function Home() {
  return (
    <div>
      <Header />
      <main className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to BySkies</h2>
        <p className="text-lg">Get your weather forecast and smart activity suggestions.</p>
      </main>
    </div>
  );
}
