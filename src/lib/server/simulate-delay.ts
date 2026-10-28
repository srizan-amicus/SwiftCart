import "server-only";

export async function simulateDelay(milliseconds = 1500): Promise<void> {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
