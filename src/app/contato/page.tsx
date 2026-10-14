export default function ContatoPage() {
  return (
    <main className="page max-w-3xl">
      <p className="kicker">Secretaria</p>
      <h1 className="display mt-2 text-4xl md:text-5xl">Contato</h1>
      <p className="mt-4 text-muted">
        Para turmas in-company, reciclagem de brigada ou dúvidas sobre NRs, fale com a
        secretaria.
      </p>
      <div className="card mt-8 space-y-3 p-7 text-[0.98rem] leading-relaxed">
        <p>
          <span className="text-muted">Email</span>
          <br />
          contato@nrlearn.local
        </p>
        <p>
          <span className="text-muted">Telefone</span>
          <br />
          (11) 4000-0000
        </p>
        <p>
          <span className="text-muted">Atendimento</span>
          <br />
          Segunda a sexta, 8h às 18h
        </p>
      </div>
    </main>
  );
}
