import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import productSchema from "../validators/product-validator";
import QRCode from "qrcode";

const prisma = new PrismaClient();

const product_includes = {
  product_reviews: true,
  inventory: true,
  categories: true,
  attributes: true,
  shipping: true,
  branch: true,
}

export const getBranchProducts = async (req: Request, res: Response) => {
  try {
    const { branch_id } = req.params;
    if (!branch_id) {
      res.status(400).json({ error: "Branch is required" });
      return;
    }
    const products = await prisma.product.findMany({
      where: {
        branch_id: branch_id,
      },
      include: {
        product_reviews: true,
        inventory: true,
        shipping: true,
        categories: true,
        attributes: true,
      },
    });
    res.status(200).json(products);
    return;
  } catch (error) {
    productsErrorHandler(error, res);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const branch_id = req.body.branch_id;

    const { error } = productSchema.safeParse(req.body);

    if (error) {
      res.status(400).json(error.issues.map((issue) => issue.message));
      return;
    }
    const product = await prisma.product.create({
      data: {
        branch_id: req.body.branch_id,
        name: req.body.name,
        long_description: req.body.description,
        short_description: req.body.short_description,
        primary_image: req.body.primary_image,
        image_gallery: req.body.image_gallery,
        status: req.body.status,
        price: req.body.price,
        sale_price: req.body.sale_price,
        sku: req.body.sku,
        asin: req.body.asin,
        upc: req.body.upc,
        product_type: req.body.product_type,
        tags: req.body.tags,
        tax_class: req.body.tax_class,
        tax_status: req.body.tax_status,
        branch: {
          connect: {
            id: branch_id,
          },
        },
        inventory: {
          create: req.body.inventory,
        },
        shipping: {
          create: req.body.shipping,
        },
        attributes: {
          create: req.body.attributes,
        },
        categories: {
          connect: req.body.categories,
        },
      },
      include: product_includes,
    });
    res.status(201).json(product);
  } catch (error) {
    productsErrorHandler(error, res);
  }
};

export const createAttributes = async (req: Request, res: Response) => {
  try{
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      res.status(400).json({ error: "User is not authenticated" });
      return;
    }
    if(role !== "branch_admin"){
      res.status(403).json({error: "Unauthorized user"})
      return;
    }

    const attribute = await prisma.attribute.create({
      data: {
        ...req.body,
        connect:{
          user_id: userId
        }
      },
      
    })

    res.status(201).json(attribute)
  }catch(error){

  }
};

export const createProductCategory = async(req: Request, res: Response) => {
  try{
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      res.status(400).json({ error: "User is not authenticated" });
      return;
    }
    if(role !== "branch_admin"){
      res.status(403).json({error: "Unauthorized user"})
      return;
    }

    const category = await prisma.category.create({
      data: {
        ...req.body,
        connect:{
          user_id: userId
        }
      },
    })
    res.status(201).json(category)
  }catch(error){

  }
};

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Product is required" });
      return;
    }

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: product_includes,
    });
    if(!product){
      res.status(404).json({error: "Product not found"})
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    productsErrorHandler(error, res);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Product is required" });
      return;
    }


    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        ...req.body,
        // name: req.body.name,
        // long_description: req.body.description,
        // short_description: req.body.short_description,
        // primary_image: req.body.primary_image,
        // image_gallery: req.body.image_gallery,
        // status: req.body.status,
        // price: req.body.price,
        // sale_price: req.body.sale_price,
        // sku: req.body.sku,
        // asin: req.body.asin,
        // upc: req.body.upc,
        // product_type: req.body.product_type,
        // tags: req.body.tags,
        // tax_class: req.body.tax_class,
        // tax_status: req.body.tax_status,
        // inventory: {
        //   update: req.body.inventory,
        // },
        // shipping: {
        //   update: req.body.shipping,
        // },
        // attributes: {
        //   update: req.body.attributes,
        // },
        // categories: {
        //   set: req.body.categories,
        // },
      },
      include: product_includes,
    })
    res.status(201).json(product);
  } catch (error) {
    productsErrorHandler(error, res);
  }
};

export const updateProductInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Product is required" });
      return;
    }

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        inventory: {
          update: req.body,
        },
      },
      include: product_includes,
    })

    if(!product){
      res.status(404).json({error: "Product not found"})
      return;
    }
    res.status(201).json(product);
  } catch (error) {
    productsErrorHandler(error, res);
  }
}

export const updateProductShipping = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Product is required" });
      return;
    }

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        shipping: {
          update: req.body,
        },
      },
      include: product_includes,
    })

    if(!product){
      res.status(404).json({error: "Product not found"})
      return;
    }
    res.status(201).json(product);
  } catch (error) {
    productsErrorHandler(error, res);
  }
}

export const updateProductAttributes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Product is required" });
      return;
    }

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data:{
        attributes: {
          update: req.body,
        }
    },
    include: product_includes})

    if(!product){
      res.status(404).json({error: "Product not found"})
      return;
    }
    res.status(201).json(product);
  } catch (error) {
    productsErrorHandler(error, res);
  }
}

export const updateProductCategories = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Product is required" });
      return;
    }

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        categories: {
          update: req.body,
        },
      },
      include: product_includes,
    })

    if(!product){
      res.status(404).json({error: "Product not found"})
      return;
    }
    res.status(201).json(product);
  } catch (error) {
    productsErrorHandler(error, res);
  }
}
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Product is required" });
      return;
    }

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        status: "DELETED",
      },
    })
    res.status(204).json({ message: "Product Deleted" });
  } catch (error) {
    productsErrorHandler(error, res);
  }
};

export const deleteManyProducts = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!ids) {
      res.status(400).json({ error: "Products are required" });
      return;
    }

    const products = await prisma.product.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: "DELETED",
      },
    })
  } catch (error) {
    productsErrorHandler(error, res);
  }
}

export const getTopSellingProducts = async (req: Request, res: Response) => {
  try {
    /**@todo TO BE UPDATED BASED ON ORDERS */
    res.status(200).json([]);
  } catch (error) {
    productsErrorHandler(error, res);
  }
};

export const getProductsSummary = async (req: Request, res: Response) => {
  try {
    /**@todo TO BE UPDATED BASED ON ORDERS */
    res.status(200).json({
      message: "Summary",
    });
  } catch (error) {
    productsErrorHandler(error, res);
  }
};

const productsErrorHandler = (error: any, res: Response) => {
  console.log(error);
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2001") {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    if (error.code === "P2011") {
      res.json({ error: `${error.message}` });
      return;
    }
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// QR Code generation test
const sampleData = {
  name: "Product Name",
  description: "Product Description",
  short_description: "Product Short Description",
  primary_image: "Product Image",
  image_gallery: ["Image1", "Image2"],
  status: "PUBLISHED",
  price: 1000,
  sale_price: 900,
  sku: "SKU",
  asin: "ASIN",
  upc: "UPC",
  product_type: "SIMPLE",
}

let stringData = JSON.stringify(sampleData);

QRCode.toFile('qrcode.png', stringData, (err)=>{ 
  if(err) throw err
  console.log("DONE")
})


