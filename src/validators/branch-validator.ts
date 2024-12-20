import {z} from 'zod'

export const branchReview = z.object({
    branch_id: z.string(),
    rating: z.number({required_error: 'Rating required'}),
    comment: z.string().optional(),
})
export const branchSchema = z.object({
    branch_name: z.string({required_error: 'Branch name is required'}),
    address: z.string({required_error: "Branch address is required"}),
    store_id: z.string({required_error: "Store is required"}),
    user_id: z.string({required_error: "Branch admin is required"}),
    county_or_province: z.string({required_error: "County or province required"})
}) 