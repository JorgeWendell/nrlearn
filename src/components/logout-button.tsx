import { logoutAction } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="btn btn-outline px-4 py-2 text-sm">Sair</button>
    </form>
  );
}
