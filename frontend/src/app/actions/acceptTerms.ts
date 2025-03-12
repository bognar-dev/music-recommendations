"use server";
import { shuffleModels } from "@/utils/shuffle";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function acceptTerms() {
  const cookieStore = await cookies();
  cookieStore.set("accepted-terms", "true");
  const models = ["model1", "model2", "model3"];

  // Use the Fisher-Yates shuffle algorithm for true randomness
  const shuffledModels = shuffleModels(models);
  cookieStore.set("model-order", JSON.stringify(shuffledModels));
  redirect("/survey");
}
