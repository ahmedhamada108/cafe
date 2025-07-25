import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Image as ImageIcon, ArrowUpDown, Move, Package, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest } from "@/lib/queryClient";
import { getImageUrl } from "@/lib/utils";
import AiImageGenerator from "./AiImageGenerator";
import { AdminLoading } from "@/components/ui/admin-loading";

interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: string;
  categoryId: number;
  image: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
}

interface ProductForm {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: string;
  categoryId: number;
  image: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
}

export function ProductsManagement() {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [movingProduct, setMovingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newCategoryId, setNewCategoryId] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<ProductForm>({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    price: "",
    categoryId: 0,
    image: "",
    stock: 0,
    isActive: true,
    isFeatured: false,
    isAvailable: true
  });

  // Fetch categories
  const { data: categoriesResponse } = useQuery<{ categories: Category[] }>({
    queryKey: ["/api/categories"],
  });
  const categories = categoriesResponse?.categories || [];

  // Fetch products (admin view - shows all products including inactive)
  const { data: productsData = [], isLoading } = useQuery({
    queryKey: ["/api/admin/products"],
  });

  const allProducts = Array.isArray(productsData) ? productsData : [];
  
  const filteredProducts = selectedCategory === "all" 
    ? allProducts
    : allProducts.filter((product: Product) => 
        (categories as any[]).find((cat: any) => cat.id === product.categoryId)?.slug === selectedCategory
      );

  const getCategoryName = (categoryId: number) => {
    const category = (categories as any[]).find((cat: any) => cat.id === categoryId);
    return category ? (isRTL ? category.nameAr : category.nameEn) : (isRTL ? "غير مصنف" : "Uncategorized");
  };

  const handleDelete = (product: Product) => {
    deleteMutation.mutate(product.id);
  };

  const handleReorder = (productId: number, direction: 'up' | 'down') => {
    reorderMutation.mutate({ id: productId, direction });
  };

  // Get products within the current category for proper sorting context
  const getCurrentCategoryProducts = (productId: number) => {
    const product = sortedProducts.find((p: Product) => p.id === productId);
    if (!product) return [];
    
    // Return all products in the same category, sorted by sortOrder
    return sortedProducts.filter((p: Product) => p.categoryId === product.categoryId)
      .sort((a: Product, b: Product) => (a.sortOrder || 0) - (b.sortOrder || 0));
  };

  // Helper function to check if reorder button should be disabled
  const isReorderDisabled = (product: Product, direction: 'up' | 'down') => {
    if (reorderMutation.isPending) return true;
    
    const categoryProducts = sortedProducts.filter(p => p.categoryId === product.categoryId);
    const categoryIndex = categoryProducts.findIndex(p => p.id === product.id);
    
    if (direction === 'up') {
      return categoryIndex === 0;
    } else {
      return categoryIndex === categoryProducts.length - 1;
    }
  };

  // Sort products by sortOrder for display
  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => (a.sortOrder || 0) - (b.sortOrder || 0));
  
  // Pagination calculations
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      return await apiRequest("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      // Force immediate refetch of all product-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: isRTL ? "تم إنشاء المنتج" : "Product Created",
        description: isRTL ? "تم إنشاء المنتج بنجاح" : "Product created successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في إنشاء المنتج" : "Failed to create product",
        variant: "destructive",
      });
    }
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProductForm }) => {
      return await apiRequest(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      // Force immediate refetch of all product-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      
      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      toast({
        title: isRTL ? "تم تحديث المنتج" : "Product Updated",
        description: isRTL ? "تم تحديث المنتج بنجاح" : "Product updated successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في تحديث المنتج" : "Failed to update product",
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: isRTL ? "تم حذف المنتج" : "Product Deleted",
        description: isRTL ? "تم حذف المنتج بنجاح" : "Product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في حذف المنتج" : "Failed to delete product",
        variant: "destructive",
      });
    }
  });

  // Reorder product mutation
  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: number; direction: 'up' | 'down' }) => {
      return await apiRequest(`/api/admin/products/${id}/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ direction }),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      // Force immediate refetch of all product-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      toast({
        title: isRTL ? "تم إعادة الترتيب" : "Reordered",
        description: isRTL ? "تم إعادة ترتيب المنتجات بنجاح" : "Products reordered successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في إعادة الترتيب" : "Failed to reorder products",
        variant: "destructive",
      });
    }
  });

  // Move product mutation
  const moveMutation = useMutation({
    mutationFn: async ({ id, categoryId }: { id: number; categoryId: number }) => {
      return await apiRequest(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({ categoryId }),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      // Force immediate refetch of all product-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      
      setIsMoveDialogOpen(false);
      setMovingProduct(null);
      setNewCategoryId(0);
      toast({
        title: isRTL ? "تم نقل المنتج" : "Product Moved",
        description: isRTL ? "تم نقل المنتج بنجاح" : "Product moved successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في نقل المنتج" : "Failed to move product",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      nameEn: "",
      nameAr: "",
      descriptionEn: "",
      descriptionAr: "",
      price: "",
      categoryId: 0,
      image: "",
      stock: 0,
      isActive: true,
      isFeatured: false,
      isAvailable: true
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      descriptionEn: product.descriptionEn,
      descriptionAr: product.descriptionAr,
      price: product.price,
      categoryId: product.categoryId,
      image: product.image,
      stock: product.stock,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isAvailable: product.isAvailable
    });
    setIsDialogOpen(true);
  };



  const handleMove = (product: Product) => {
    setMovingProduct(product);
    setNewCategoryId(product.categoryId);
    setIsMoveDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleMoveSubmit = () => {
    if (movingProduct && newCategoryId > 0) {
      moveMutation.mutate({ id: movingProduct.id, categoryId: newCategoryId });
    }
  };

  if (isLoading) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? "إدارة المنتجات" : "Products Management"}
          </h2>
          <p className={`text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? "إدارة جميع المنتجات والأسعار والمخزون" : "Manage all products, prices, and inventory"}
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Plus className="h-4 w-4" />
              {isRTL ? "إضافة منتج" : "Add Product"}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
                {editingProduct 
                  ? (isRTL ? "تعديل المنتج" : "Edit Product")
                  : (isRTL ? "إضافة منتج جديد" : "Add New Product")
                }
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nameEn" className={isRTL ? 'text-right' : 'text-left'}>{isRTL ? "الاسم بالإنجليزية" : "Name (English)"}</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="nameAr" className={isRTL ? 'text-right' : 'text-left'}>{isRTL ? "الاسم بالعربية" : "Name (Arabic)"}</Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    required
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="descEn" className={isRTL ? 'text-right' : 'text-left'}>{isRTL ? "الوصف بالإنجليزية" : "Description (English)"}</Label>
                  <Textarea
                    id="descEn"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="descAr" className={isRTL ? 'text-right' : 'text-left'}>{isRTL ? "الوصف بالعربية" : "Description (Arabic)"}</Label>
                  <Textarea
                    id="descAr"
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category" className={isRTL ? 'text-right' : 'text-left'}>{isRTL ? "الفئة" : "Category"}</Label>
                  <Select 
                    value={formData.categoryId.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: parseInt(value) }))}
                  >
                    <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                      <SelectValue placeholder={isRTL ? "اختر الفئة" : "Select category"} />
                    </SelectTrigger>
                    <SelectContent className={isRTL ? 'text-right' : 'text-left'}>
                      {categories.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {isRTL ? category.nameAr : category.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="price" className={isRTL ? 'text-right' : 'text-left'}>{isRTL ? "السعر (ريال)" : "Price (SAR)"}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="stock" className={isRTL ? 'text-right' : 'text-left'}>{isRTL ? "المخزون" : "Stock"}</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
              </div>
              
              <FileUpload
                label={isRTL ? "صورة المنتج" : "Product Image"}
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                isRTL={isRTL}
              />

              {/* AI Image Generator */}
              <div className="mt-4">
                <AiImageGenerator
                  onImageSelect={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                  disabled={editingProduct ? updateMutation.isPending : createMutation.isPending}
                />
              </div>
              
              <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isActive" className={isRTL ? 'text-right' : 'text-left'}>{isRTL ? "نشط" : "Active"}</Label>
                </div>
                
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isFeatured" className={isRTL ? 'text-right' : 'text-left'}>{isRTL ? "مميز" : "Featured"}</Label>
                </div>
                
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isAvailable" className={isRTL ? 'text-right' : 'text-left'}>{isRTL ? "متوفر" : "Available"}</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingProduct 
                    ? (isRTL ? "تحديث" : "Update")
                    : (isRTL ? "إضافة" : "Add")
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <Label htmlFor="categoryFilter" className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? "تصفية حسب الفئة" : "Filter by Category"}
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectItem value="all">{isRTL ? "جميع الفئات" : "All Categories"}</SelectItem>
                  {categories.map((category: Category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {isRTL ? category.nameAr : category.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <Package className="h-5 w-5" />
            {isRTL ? "قائمة المنتجات" : "Products List"}
            <Badge variant="secondary">{sortedProducts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={isRTL ? "text-right" : "text-left"} dir={isRTL ? "rtl" : "ltr"}>
                  {isRTL ? (
                    // RTL order: Actions, Status, Stock, Price, Category, Name, Image, Order
                    <>
                      <TableHead className="text-right">{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                      <TableHead className="text-right">{isRTL ? "الحالة" : "Status"}</TableHead>
                      <TableHead className="text-right">{isRTL ? "المخزون" : "Stock"}</TableHead>
                      <TableHead className="text-right">{isRTL ? "السعر" : "Price"}</TableHead>
                      <TableHead className="text-right">{isRTL ? "الفئة" : "Category"}</TableHead>
                      <TableHead className="text-right">{isRTL ? "الاسم" : "Name"}</TableHead>
                      <TableHead className="text-right">{isRTL ? "الصورة" : "Image"}</TableHead>
                      <TableHead className="text-right">{isRTL ? "الترتيب" : "Order"}</TableHead>
                    </>
                  ) : (
                    // LTR order: Order, Image, Name, Category, Price, Stock, Status, Actions
                    <>
                      <TableHead className="text-left">{isRTL ? "الترتيب" : "Order"}</TableHead>
                      <TableHead className="text-left">{isRTL ? "الصورة" : "Image"}</TableHead>
                      <TableHead className="text-left">{isRTL ? "الاسم" : "Name"}</TableHead>
                      <TableHead className="text-left">{isRTL ? "الفئة" : "Category"}</TableHead>
                      <TableHead className="text-left">{isRTL ? "السعر" : "Price"}</TableHead>
                      <TableHead className="text-left">{isRTL ? "المخزون" : "Stock"}</TableHead>
                      <TableHead className="text-left">{isRTL ? "الحالة" : "Status"}</TableHead>
                      <TableHead className="text-left">{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product: Product, index: number) => (
                  <TableRow key={product.id} className={isRTL ? "text-right" : "text-left"} dir={isRTL ? "rtl" : "ltr"}>
                    {isRTL ? (
                      // RTL order: Actions, Status, Stock, Price, Category, Name, Image, Order
                      <>
                        <TableCell className="text-right">
                          <div className={`flex items-center gap-2 justify-end`}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="text-right">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-right">
                                    {isRTL ? "تأكيد حذف المنتج" : "Confirm Delete Product"}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-right">
                                    {isRTL 
                                      ? `هل أنت متأكد من حذف منتج "${product.nameAr}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                                      : `Are you sure you want to delete product "${product.nameEn}"? This action cannot be undone.`
                                    }
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-row-reverse">
                                  <AlertDialogCancel>
                                    {isRTL ? "إلغاء" : "Cancel"}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(product)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deleteMutation.isPending}
                                  >
                                    {deleteMutation.isPending 
                                      ? (isRTL ? "جاري الحذف..." : "Deleting...")
                                      : (isRTL ? "حذف" : "Delete")
                                    }
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col gap-1">
                            <Badge variant={product.isActive ? "default" : "secondary"} className="w-fit">
                              {product.isActive ? (isRTL ? "نشط" : "Active") : (isRTL ? "غير نشط" : "Inactive")}
                            </Badge>
                            {product.isFeatured && (
                              <Badge variant="outline" className="w-fit text-xs">
                                {isRTL ? "مميز" : "Featured"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">{product.price} {isRTL ? "ريال" : "SAR"}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">
                            {getCategoryName(product.categoryId)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {isRTL ? product.nameAr : product.nameEn}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate text-right">
                              {isRTL ? product.descriptionAr : product.descriptionEn}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            {product.image ? (
                              <img 
                                src={getImageUrl(product.image)} 
                                alt={isRTL ? product.nameAr : product.nameEn}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReorder(product.id, 'up')}
                              disabled={isReorderDisabled(product, 'up')}
                              className="p-1 h-6 w-6"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReorder(product.id, 'down')}
                              disabled={isReorderDisabled(product, 'down')}
                              className="p-1 h-6 w-6"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      // LTR order: Order, Image, Name, Category, Price, Stock, Status, Actions
                      <>
                        <TableCell className="text-left">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReorder(product.id, 'up')}
                              disabled={isReorderDisabled(product, 'up')}
                              className="p-1 h-6 w-6"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReorder(product.id, 'down')}
                              disabled={isReorderDisabled(product, 'down')}
                              className="p-1 h-6 w-6"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            {product.image ? (
                              <img 
                                src={getImageUrl(product.image)} 
                                alt={isRTL ? product.nameAr : product.nameEn}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-left">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {isRTL ? product.nameAr : product.nameEn}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate text-left">
                              {isRTL ? product.descriptionAr : product.descriptionEn}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-left">
                          <Badge variant="outline">
                            {getCategoryName(product.categoryId)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left">
                          <span className="font-medium">{product.price} {isRTL ? "ريال" : "SAR"}</span>
                        </TableCell>
                        <TableCell className="text-left">
                          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="flex flex-col gap-1">
                            <Badge variant={product.isActive ? "default" : "secondary"} className="w-fit">
                              {product.isActive ? (isRTL ? "نشط" : "Active") : (isRTL ? "غير نشط" : "Inactive")}
                            </Badge>
                            {product.isFeatured && (
                              <Badge variant="outline" className="w-fit text-xs">
                                {isRTL ? "مميز" : "Featured"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="flex items-center gap-2 justify-start">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="text-left">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-left">
                                    {isRTL ? "تأكيد حذف المنتج" : "Confirm Delete Product"}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-left">
                                    {isRTL 
                                      ? `هل أنت متأكد من حذف منتج "${product.nameAr}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                                      : `Are you sure you want to delete product "${product.nameEn}"? This action cannot be undone.`
                                    }
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    {isRTL ? "إلغاء" : "Cancel"}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(product)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deleteMutation.isPending}
                                  >
                                    {deleteMutation.isPending 
                                      ? (isRTL ? "جاري الحذف..." : "Deleting...")
                                      : (isRTL ? "حذف" : "Delete")
                                    }
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-between px-6 py-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL 
                  ? `عرض ${startIndex + 1}-${Math.min(endIndex, totalItems)} من ${totalItems} منتج`
                  : `Showing ${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems} products`
                }
              </div>
              
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={isRTL ? 'text-right' : 'text-left'}
                >
                  {isRTL ? "السابق" : "Previous"}
                </Button>
                
                <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = currentPage <= 3 
                      ? i + 1 
                      : currentPage >= totalPages - 2 
                        ? totalPages - 4 + i 
                        : currentPage - 2 + i;
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={isRTL ? 'text-right' : 'text-left'}
                >
                  {isRTL ? "التالي" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}