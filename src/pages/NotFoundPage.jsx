import { Link } from "react-router-dom";
import { TubeGlyph } from "../components/Cap";
import Logo from "../components/Logo";

export default function NotFoundPage({ standalone = false }) {
  const content = (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <TubeGlyph status="inactive" className="h-16 w-8" />
      <h1 className="mt-6 text-2xl font-bold text-ink">Esta página no existe</h1>
      <p className="mt-2 text-ink-2">
        Puede que el enlace esté mal escrito o que el paciente se haya eliminado.
      </p>
      <Link to={standalone ? "/login" : "/dashboard"} className="btn btn-primary mt-8">
        {standalone ? "Ir a iniciar sesión" : "Volver a la gradilla"}
      </Link>
    </div>
  );

  if (!standalone) return content;
  return (
    <div className="min-h-dvh bg-tray px-4 py-8">
      <Logo className="mx-auto w-fit" />
      {content}
    </div>
  );
}
