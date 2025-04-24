import { z } from "zod";

export const inventorySchema = z.object({
  manage_stock: z.boolean().optional(),
  stock_status: z.enum(["in_stock", "out_of_stock", "low_on_stock"]).optional(),
  minimum_inventory: z.number(),
  quantity: z.number(),
  sold_independently: z.boolean().optional(),
});

export const shippingSchema = z
  .object({
    weight: z.number(),
    shipping_class: z.string().optional(),
    dimensions: z.object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
    }),
  })
  .optional();

export const productCategorySchema = z.object({
  name: z.string(),
  parent_category_id: z.string().optional(),
});

export const attributeSchema = z.object({
  name: z.string({ required_error: "Attribute name required" }),
  values: z
    .array(z.string())
    .nonempty({ message: "At least one attribute value is needed" }),
});

export const productReviewSchema = z.object({
    product_id: z.string({required_error: 'Product is required'}),
    rating: z.number({required_error: 'Rating is required'}),
    comment: z.string().optional()
})
const productSchema = z.object({
  branch_id: z.string({ required_error: "Branch is required" }),
  name: z.string({ required_error: "Product name is required" }),
  price: z.number({ required_error: "Product price is required" }),
  primary_image: z.string({ required_error: "Product image is required" }),
  gallery_images: z.array(z.string()).optional(),
  status: z.enum(["DELETED", "ACTIVE", "SOLD", "DEACTIVATED"]).optional(),
  short_description: z.string(),
  long_description: z.string().optional(),
  sale_price: z.number().optional(),
  sku: z.string().optional(),
  asin: z.string().optional(),
  upc: z.string().optional(),
  inventory: inventorySchema,
  shipping: shippingSchema,
  categories: z.string().array()
    .min(1, { message: "At least one category is needed" }),
  atttributes: z.array(attributeSchema).optional(),
});

export default productSchema;
