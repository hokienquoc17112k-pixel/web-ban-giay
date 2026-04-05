import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Heart, Star, ChevronRight, TrendingUp, Award, Zap, Shield, Percent, Phone, Mail, MapPin, Clock, Facebook, MessageCircle, Send } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  tag?: string;
}

interface CartItem extends Product {
  quantity: number;
  size: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Air Max Classic',
    price: 1890000,
    image: 'https://images.unsplash.com/photo-1631984564919-1f6b2313a71c?w=800',
    category: 'Giày thể thao',
    rating: 4.8,
    reviews: 124,
    tag: 'Bestseller'
  },
  {
    id: 2,
    name: 'Urban Sneaker White',
    price: 1590000,
    image: 'https://images.unsplash.com/photo-1622760808027-095ea611f657?w=800',
    category: 'Giày sneaker',
    rating: 4.6,
    reviews: 89,
    tag: 'New'
  },
  {
    id: 3,
    name: 'Converse Classic',
    price: 1290000,
    image: 'https://images.unsplash.com/photo-1622760807301-4d2351a5a942?w=800',
    category: 'Giày vải',
    rating: 4.9,
    reviews: 203
  },
  {
    id: 4,
    name: 'Adidas Original',
    price: 2190000,
    image: 'https://images.unsplash.com/photo-1622760807800-66cf1466fc08?w=800',
    category: 'Giày thể thao',
    rating: 4.7,
    reviews: 156,
    tag: 'Limited'
  },
  {
    id: 5,
    name: 'Premium White Leather',
    price: 2490000,
    image: 'https://images.unsplash.com/photo-1622760806530-3cb6301c087d?w=800',
    category: 'Giày da',
    rating: 4.8,
    reviews: 98
  },
  {
    id: 6,
    name: 'Adidas Black & White',
    price: 1990000,
    image: 'https://images.unsplash.com/photo-1676821666381-c0456feeeb07?w=800',
    category: 'Giày thể thao',
    rating: 4.5,
    reviews: 142
  },
  {
    id: 7,
    name: 'Adidas Box Edition',
    price: 2290000,
    image: 'https://images.unsplash.com/photo-1676821537459-f4de7b5ac18e?w=800',
    category: 'Giày thể thao',
    rating: 4.9,
    reviews: 187,
    tag: 'Premium'
  },
  {
    id: 8,
    name: 'Street Style Sneaker',
    price: 1790000,
    image: 'https://images.unsplash.com/photo-1676821638611-56214ade4d73?w=800',
    category: 'Giày sneaker',
    rating: 4.6,
    reviews: 112
  }
];

const features = [
  { icon: TrendingUp, title: 'Chất lượng cao cấp', desc: 'Sản phẩm chính hãng 100%' },
  { icon: Award, title: 'Bảo hành trọn đời', desc: 'Cam kết chất lượng vĩnh viễn' },
  { icon: Zap, title: 'Giao hàng nhanh', desc: 'Miễn phí ship toàn quốc' }
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = ['Tất cả', 'Giày thể thao', 'Giày sneaker', 'Giày vải', 'Giày da'];

  const addToCart = (product: Product, size: string = '42') => {
    const existingItem = cart.find(item => item.id === product.id && item.size === size);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, size }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number, size: string) => {
    setCart(cart.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id, size);
    } else {
      setCart(cart.map(item =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      ));
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 blur-3xl"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 50 }}
        />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-600/10 to-orange-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-600/10 to-teal-600/10 blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-8"
            >
              <motion.h1
                className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                LUXE SHOES
              </motion.h1>
              <nav className="hidden md:flex gap-8">
                {['Trang chủ', 'Bộ sưu tập', 'Về chúng tôi', 'Liên hệ'].map((item, i) => (
                  <motion.a
                    key={item}
                    href="#"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="text-white/70 hover:text-white transition-colors relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                  </motion.a>
                ))}
              </nav>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4"
            >
              <motion.div
                className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10"
                whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <Search className="w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder:text-white/40 w-48"
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <ShoppingCart className="w-6 h-6" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-3 bg-white/5 rounded-full"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </motion.div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-6 pb-4 border-t border-white/10 pt-6"
              >
                <nav className="flex flex-col gap-4">
                  {['Trang chủ', 'Bộ sưu tập', 'Về chúng tôi', 'Liên hệ'].map((item) => (
                    <a key={item} href="#" className="text-white/70 hover:text-white transition-colors">
                      {item}
                    </a>
                  ))}
                </nav>
                <div className="mt-4 flex items-center gap-2 bg-white/5 rounded-full px-6 py-3">
                  <Search className="w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-white placeholder:text-white/40 w-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h2
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              ĐỊNH NGHĨA LẠI
              <br />
              PHONG CÁCH
            </motion.h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto"
          >
            Bộ sưu tập giày cao cấp 2026 - Nơi nghệ thuật gặp gỡ công nghệ
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full flex items-center gap-2 justify-center group"
            >
              Khám phá ngay
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 backdrop-blur-xl text-white px-10 py-5 rounded-full border border-white/20 hover:bg-white/10 transition-all"
            >
              Xem bộ sưu tập
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-2 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* About Us Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl" />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800"
                  alt="About Us"
                  className="relative rounded-3xl shadow-2xl border border-white/10"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6"
              >
                VỀ CHÚNG TÔI
              </motion.div>
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Định Hình Phong Cách<br />Của Riêng Bạn
              </h2>
              <p className="text-white/70 text-lg mb-6 leading-relaxed">
                LUXE SHOES được thành lập với sứ mệnh mang đến những đôi giày cao cấp nhất,
                kết hợp hoàn hảo giữa nghệ thuật thủ công truyền thống và công nghệ hiện đại.
              </p>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Mỗi đôi giày của chúng tôi là một tác phẩm nghệ thuật, được chế tác tỉ mỉ
                bởi những nghệ nhân hàng đầu với chất liệu cao cấp nhất từ khắp nơi trên thế giới.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { number: '10+', label: 'Năm kinh nghiệm' },
                  { number: '50K+', label: 'Khách hàng hài lòng' },
                  { number: '200+', label: 'Mẫu giày độc quyền' },
                  { number: '100%', label: 'Hàng chính hãng' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center"
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full flex items-center gap-2"
              >
                Tìm hiểu thêm
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center group hover:bg-white/10 transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4"
                >
                  <feature.icon className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide"
          >
            {categories.map((category, i) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-3 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Bộ Sưu Tập Đặc Biệt
            </h2>
            <p className="text-white/60 text-lg">Những đôi giày định hình xu hướng tương lai</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all">
                  <div className="relative overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="relative"
                    >
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-72 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>

                    {product.tag && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold"
                      >
                        {product.tag}
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-4 right-4 p-2.5 bg-black/40 backdrop-blur-xl rounded-full hover:bg-black/60 transition-all"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          favorites.includes(product.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-white'
                        }`}
                      />
                    </motion.button>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToCart(product)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Thêm vào giỏ
                      </motion.button>
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-white/40 mb-2">{product.category}</div>
                    <h3 className="text-xl font-bold mb-3 text-white">{product.name}</h3>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-white/60">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {product.price.toLocaleString('vi-VN')}₫
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product)}
                        className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg shadow-purple-500/50"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black border-l border-white/10 shadow-2xl overflow-y-auto z-50"
            >
              <div className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold">Giỏ hàng</h2>
                  <p className="text-white/60">{totalItems} sản phẩm</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="p-6">
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-white/20" />
                    </motion.div>
                    <p className="text-white/60 text-lg">Giỏ hàng trống</p>
                    <p className="text-white/40 mt-2">Hãy thêm sản phẩm yêu thích của bạn</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      <AnimatePresence>
                        {cart.map((item) => (
                          <motion.div
                            key={`${item.id}-${item.size}`}
                            layout
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all"
                          >
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-bold mb-1">{item.name}</h4>
                              <p className="text-sm text-white/60 mb-2">Size: {item.size}</p>
                              <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                                {item.price.toLocaleString('vi-VN')}₫
                              </p>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                    className="w-8 h-8 bg-white/10 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
                                  >
                                    -
                                  </motion.button>
                                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                    className="w-8 h-8 bg-white/10 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
                                  >
                                    +
                                  </motion.button>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => removeFromCart(item.id, item.size)}
                                  className="ml-auto text-red-400 hover:text-red-300 text-sm"
                                >
                                  Xóa
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4">
                      <div className="flex justify-between text-white/80">
                        <span>Tạm tính:</span>
                        <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>Phí vận chuyển:</span>
                        <span className="text-green-400">Miễn phí</span>
                      </div>
                      <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                        <span className="text-xl">Tổng cộng:</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {totalPrice.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50"
                    >
                      Thanh toán ngay
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Warranty & Promotions Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-pink-900/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Chính Sách & Ưu Đãi
            </h2>
            <p className="text-white/60 text-lg">Cam kết chất lượng và lợi ích tối đa cho khách hàng</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-purple-600/10 to-purple-900/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl" />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl mb-6 shadow-lg shadow-purple-500/50"
                >
                  <Shield className="w-10 h-10" />
                </motion.div>
                <h3 className="text-3xl font-bold mb-4">Bảo Hành Trọn Đời</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <span>Bảo hành trọn đời về chất lượng sản phẩm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <span>Đổi trả miễn phí trong 30 ngày đầu tiên</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <span>Bảo dưỡng và vệ sinh giày miễn phí trọn đời</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <span>Hỗ trợ kỹ thuật 24/7 qua hotline</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <span>Chính sách bảo hành mở rộng cho thành viên VIP</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors"
                >
                  Chi tiết bảo hành
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-pink-600/10 to-pink-900/10 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-600/20 to-transparent rounded-full blur-3xl" />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-600 to-pink-800 rounded-2xl mb-6 shadow-lg shadow-pink-500/50"
                >
                  <Percent className="w-10 h-10" />
                </motion.div>
                <h3 className="text-3xl font-bold mb-4">Khuyến Mãi Đặc Biệt</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2" />
                    <span>Giảm 30% cho đơn hàng đầu tiên</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2" />
                    <span>Miễn phí vận chuyển toàn quốc cho đơn trên 2 triệu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2" />
                    <span>Tích điểm đổi quà - 1 điểm cho mỗi 10.000đ</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2" />
                    <span>Ưu đãi sinh nhật - Voucher 500K</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2" />
                    <span>Flash sale cuối tuần - Giảm đến 50%</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full transition-colors"
                >
                  Xem ưu đãi
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Thông Tin Liên Hệ
            </h2>
            <p className="text-white/60 text-lg">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                {
                  icon: MapPin,
                  title: 'Địa chỉ cửa hàng',
                  content: ['123 Đường Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh, Việt Nam'],
                  color: 'from-blue-600 to-cyan-600'
                },
                {
                  icon: Phone,
                  title: 'Hotline',
                  content: ['1900-LUXE (5893)', '+84 28 3822 xxxx'],
                  color: 'from-green-600 to-emerald-600'
                },
                {
                  icon: Mail,
                  title: 'Email',
                  content: ['support@luxeshoes.vn', 'info@luxeshoes.vn'],
                  color: 'from-purple-600 to-pink-600'
                },
                {
                  icon: Clock,
                  title: 'Giờ làm việc',
                  content: ['Thứ 2 - Thứ 7: 9:00 - 21:00', 'Chủ nhật: 10:00 - 20:00'],
                  color: 'from-orange-600 to-red-600'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex gap-4 items-start bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className={`p-4 bg-gradient-to-br ${item.color} rounded-xl flex-shrink-0`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    {item.content.map((line, j) => (
                      <p key={j} className="text-white/70">{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Nội dung tin nhắn"
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gửi tin nhắn
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mt-16 border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                LUXE SHOES
              </h3>
              <p className="text-white/60 leading-relaxed">
                Nơi hội tụ những đôi giày đẳng cấp nhất, định hình phong cách sống hiện đại.
              </p>
            </motion.div>

            {[
              {
                title: 'Sản phẩm',
                links: ['Giày thể thao', 'Giày sneaker', 'Giày da', 'Bộ sưu tập mới']
              },
              {
                title: 'Công ty',
                links: ['Về chúng tôi', 'Câu chuyện thương hiệu', 'Tuyển dụng', 'Liên hệ']
              },
              {
                title: 'Hỗ trợ',
                links: ['Chính sách đổi trả', 'Hướng dẫn mua hàng', 'Bảo mật', 'Điều khoản']
              }
            ].map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className="font-bold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/60 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2026 LUXE SHOES. Crafted with passion.
            </p>
            <div className="flex gap-6">
              {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Bubble - Facebook & Messenger */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-80 bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl shadow-2xl overflow-hidden z-40"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Facebook className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold">LUXE SHOES</h4>
                  <p className="text-xs text-white/80">Online ngay</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                  <p className="text-sm text-white">Xin chào! Chúng tôi có thể giúp gì cho bạn?</p>
                  <p className="text-xs text-white/60 mt-1">Vừa xong</p>
                </div>
              </motion.div>

              <div className="space-y-2">
                <p className="text-xs text-white/60 text-center">Hoặc liên hệ qua:</p>
                <div className="grid grid-cols-2 gap-2">
                  <motion.a
                    href="https://m.me/luxeshoes"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Messenger
                  </motion.a>
                  <motion.a
                    href="https://facebook.com/luxeshoes"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </motion.a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && chatMessage.trim()) {
                      setChatMessage('');
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full"
                  onClick={() => {
                    if (chatMessage.trim()) {
                      setChatMessage('');
                    }
                  }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl shadow-blue-500/50 flex items-center justify-center z-50 group"
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="w-7 h-7" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-20 bg-black/90 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-lg whitespace-nowrap pointer-events-none"
        >
          <p className="text-sm font-bold">Hãy liên hệ với tôi</p>
          <p className="text-xs text-white/60">Phản hồi trong 1 phút</p>
        </motion.div>
      </motion.button>
    </div>
  );
}
