import { z } from "zod";

export const storeSchema = z.object({
    store_name:  z.string({required_error: 'Store name is required'}).min(3, {message: 'Store name too short'}),
    country: z.string({required_error: 'Store country is required'}),
    documents: z.string({required_error: 'Documents required'}).array().min(1, {message:'No documents updloaded'}),
    logo: z.string({message: 'Store logo is required'}),
    description: z.string({required_error: 'Store description is required'}).min(20, {message: 'Description too short'}),
})