import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { Container, Section, Input, Select, Button, Spinner } from '../../components/ui';
import ProductGrid from '../../components/product/ProductGrid';
import Hero from '../../components/common/Hero';
import { PRODUCT_CATEGORIES } from '@/config/constants';
import { productService } from '@/services';
import { useApi, usePagination, useDebounce } from '@/hooks';
import type { Product } from '@/types';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: allProducts = [], loading: productsLoading } = useApi<Product[]>(
    () =>
      productService.getAll({
        search: debouncedSearch,
        category: selectedCategory,
      }),
    true
  );

  const filteredProducts = useMemo(() => {
    let products = [...(allProducts ?? [])];

    // Sort products
    if (sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    return products;
  }, [allProducts, sortBy]);

  const pagination = usePagination({
    pageSize: 12,
    totalItems: filteredProducts.length,
  });

  const paginatedProducts = filteredProducts.slice(
    pagination.offset,
    pagination.offset + pagination.pageSize
  );

  return (
    <>
      <Hero
        title="Our Products"
        subtitle="Find everything you need for your office"
        backgroundImage="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
      />

      <Section spacing="lg">
        <Container>
          {/* Filters */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              placeholder="Search products..."
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: '', label: 'All Categories' },
                ...PRODUCT_CATEGORIES.map((cat) => ({
                  value: cat,
                  label: cat,
                })),
              ]}
            />

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Best Rated' },
              ]}
            />

            <Button variant="outline" fullWidth>
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </motion.div>

          {/* Results Info */}
          <motion.div
            className="mb-6 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Showing {pagination.offset + 1} to{' '}
            {Math.min(pagination.offset + pagination.pageSize, filteredProducts.length)} of{' '}
            {filteredProducts.length} products
          </motion.div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <ProductGrid products={paginatedProducts} />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  className="flex items-center justify-center gap-2 mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.prevPage()}
                    disabled={!pagination.hasPrevPage}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: pagination.totalPages }).map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={
                        pagination.currentPage === i + 1 ? 'primary' : 'outline'
                      }
                      size="sm"
                      onClick={() => pagination.goToPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.nextPage()}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  );
};

export default Products;
