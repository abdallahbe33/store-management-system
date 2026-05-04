import prisma from "../../db/prisma";
import AppError from "../../utils/AppError";

type SupplierInput = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export const createSupplier = async (data: SupplierInput) => {
  if (data.email) {
    const existingSupplier = await prisma.supplier.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingSupplier) {
      throw new AppError("Supplier email already exists", 409);
    }
  }

  return prisma.supplier.create({
    data: {
      name: data.name as string,
      email: data.email,
      phone: data.phone,
      address: data.address,
    },
  });
};

export const getAllSuppliers = async () => {
  return prisma.supplier.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getSupplierById = async (id: string) => {
  const supplier = await prisma.supplier.findUnique({
    where: {
      id,
    },
  });

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  return supplier;
};

export const updateSupplier = async (id: string, data: SupplierInput) => {
  await getSupplierById(id);

  if (data.email) {
    const existingSupplier = await prisma.supplier.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingSupplier && existingSupplier.id !== id) {
      throw new AppError("Supplier email already exists", 409);
    }
  }

  return prisma.supplier.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteSupplier = async (id: string) => {
  await getSupplierById(id);

  return prisma.supplier.delete({
    where: {
      id,
    },
  });
};