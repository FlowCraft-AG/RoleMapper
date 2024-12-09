import BookList from "./OrgList";
import Navigation from "@/src/components/Navigation";


export default function HomePage() {
  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main>
        <h3>Organisationseinheiten der Hochschule Karlsruhe</h3>
      </main>
    </div>
  );
}
