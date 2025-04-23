import * as z from "zod";
export const SignInSchema = z.object({
    identifier:z.string(),
    password:z.string(),
})