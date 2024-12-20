import {z} from 'zod'

const generalCategorySchema = z.object({
    name: z.string({required_error: 'Category name is required'}),
    description: z.string({required_error: 'Category description is required'}).min(20, {message: 'Description must be at least 20 characters long'}),
})

export default generalCategorySchema