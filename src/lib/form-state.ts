export type ActionState = {
  error?: string;
  success?: string;
  ok?: boolean;
  id?: string;
  score?: number;
} | null;

export async function toActionState(
  result: ActionState | undefined | void,
): Promise<ActionState> {
  return result ?? null;
}
