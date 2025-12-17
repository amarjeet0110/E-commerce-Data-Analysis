// Backend Logic - Data Processing & Analysis

class FlipkartAnalyticsBackend {
    constructor() {
        this.generateIndianEcommerceData();
    }

    generateIndianEcommerceData() {
        const categories = {
            'Electronics': [
                'Samsung 65" 4K Smart TV', 'LG Washing Machine 7kg', 'Sony Bluetooth Speaker',
                'Canon DSLR Camera', 'HP Laptop 15.6"', 'Dell Monitor 24"',
                'Logitech Wireless Mouse', 'JBL Headphones', 'Philips Air Fryer'
            ],
            'Mobiles': [
                'iPhone 15 Pro', 'Samsung Galaxy S24', 'OnePlus 12', 'Xiaomi Redmi Note 13',
                'Realme GT 5', 'Vivo V30', 'OPPO Reno 11', 'Nothing Phone 2',
                'Motorola Edge 40', 'Google Pixel 8'
            ],
            'Fashion': [
                'Levi\'s Men Jeans', 'Nike Running Shoes', 'Adidas T-Shirt',
                'Puma Sports Jacket', 'Raymond Formal Shirt', 'Allen Solly Trousers',
                'US Polo Casual Shirt', 'Roadster Denim Jacket', 'H&M Dress',
                'Zara Women Top', 'Manyavar Kurta', 'Biba Ethnic Wear'
            ],
            'Home & Furniture': [
                'Godrej Steel Almirah', 'Nilkamal Plastic Chair', 'Urban Ladder Sofa',
                'IKEA Study Table', 'Sleepwell Mattress', 'Prestige Cooker Set',
                'Bombay Dyeing Bedsheet', 'Cortina Curtains', 'Havells Table Lamp'
            ],
            'Appliances': [
                'Voltas 1.5 Ton AC', 'Blue Star Refrigerator', 'Bajaj Mixer Grinder',
                'Prestige Induction Cooktop', 'Crompton Ceiling Fan', 'Havells Geyser',
                'Philips Iron', 'Kent Water Purifier', 'Panasonic Microwave'
            ],
            'Books': [
                'Think Like a Monk', 'Atomic Habits', 'NCERT Class 12', 
                'The Psychology of Money', 'Rich Dad Poor Dad', 'Wings of Fire',
                'Half Girlfriend', 'The Alchemist', 'Ikigai'
            ],
            'Sports': [
                'Cosco Cricket Bat', 'Nivia Football', 'Yonex Badminton Racket',
                'Decathlon Yoga Mat', 'Strauss Dumbbells', 'Kalenji Running Shoes',
                'Vector X Gym Bag', 'Nivia Sports Bottle', 'Cockatoo Cycle'
            ],
            'Beauty': [
                'Lakme Face Cream', 'Maybelline Lipstick', 'Nivea Body Lotion',
                'Garnier Face Wash', 'L\'Oreal Shampoo', 'Biotique Hair Oil',
                'Mamaearth Sunscreen', 'Plum Face Serum', 'Himalaya Moisturizer'
            ]
        };

        const priceRanges = {
            'Electronics': [15000, 80000],
            'Mobiles': [8000, 120000],
            'Fashion': [500, 5000],
            'Home & Furniture': [2000, 45000],
            'Appliances': [3000, 55000],
            'Books': [200, 800],
            'Sports': [300, 8000],
            'Beauty': [150, 2000]
        };

        this.orders = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 365);

        for (let i = 0; i < 5000; i++) {
            const categoryKeys = Object.keys(categories);
            const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
            const productList = categories[category];
            const product = productList[Math.floor(Math.random() * productList.length)];
            
            const orderDate = new Date(startDate.getTime() + Math.random() * (Date.now() - startDate.getTime()));
            const priceRange = priceRanges[category];
            const basePrice = Math.floor(Math.random() * (priceRange[1] - priceRange[0])) + priceRange[0];
            
            this.orders.push({
                orderId: `FKO-${10000 + i}`,
                date: orderDate,
                category: category,
                product: product,
                quantity: Math.floor(Math.random() * 3) + 1,
                price: basePrice,
                customerId: `CUST-${Math.floor(Math.random() * 500) + 1}`,
                status: ['Delivered', 'Shipped', 'Processing', 'Delivered'][Math.floor(Math.random() * 4)],
                state: ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Gujarat', 'West Bengal'][Math.floor(Math.random() * 6)]
            });
        }
    }

    filterByDateRange(days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return this.orders.filter(order => order.date >= cutoffDate);
    }

    filterByCategory(orders, category) {
        if (category === 'all') return orders;
        return orders.filter(order => order.category === category);
    }

    calculateMetrics(orders) {
        const totalRevenue = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const uniqueCustomers = new Set(orders.map(o => o.customerId)).size;

        return {
            totalRevenue: totalRevenue.toFixed(2),
            totalOrders: totalOrders,
            avgOrderValue: avgOrderValue.toFixed(2),
            uniqueCustomers: uniqueCustomers
        };
    }

    generateInsights(orders) {
        const metrics = this.calculateMetrics(orders);
        const categoryData = this.getSalesByCategory(orders);
        const topCategory = Object.entries(categoryData).sort((a, b) => b[1] - a[1])[0];
        const avgOrderValue = parseFloat(metrics.avgOrderValue);
        
        const insights = [
            {
                title: '🚀 Top Performing Category',
                text: `${topCategory[0]} is leading with ₹${(topCategory[1]/100000).toFixed(2)} Lakhs in revenue, contributing ${((topCategory[1]/parseFloat(metrics.totalRevenue))*100).toFixed(1)}% of total sales.`
            },
            {
                title: '💰 Average Order Value',
                text: `Customers are spending an average of ₹${avgOrderValue.toLocaleString('en-IN')} per order. This ${avgOrderValue > 15000 ? 'high' : 'moderate'} AOV indicates ${avgOrderValue > 15000 ? 'strong premium product adoption' : 'good mix of products'}.`
            },
            {
                title: '👥 Customer Base',
                text: `${metrics.uniqueCustomers} unique customers made purchases, with an average of ${(parseFloat(metrics.totalOrders)/metrics.uniqueCustomers).toFixed(1)} orders per customer.`
            },
            {
                title: '📦 Order Volume',
                text: `${metrics.totalOrders} orders processed generating ₹${(parseFloat(metrics.totalRevenue)/100000).toFixed(2)} Lakhs in total revenue. Strong order velocity indicates healthy business growth.`
            }
        ];

        return insights;
    }

    getSalesByCategory(orders) {
        const categoryData = {};
        orders.forEach(order => {
            if (!categoryData[order.category]) {
                categoryData[order.category] = 0;
            }
            categoryData[order.category] += order.price * order.quantity;
        });
        return categoryData;
    }

    getCategoryStats(orders) {
        const categoryData = {};
        orders.forEach(order => {
            if (!categoryData[order.category]) {
                categoryData[order.category] = { orders: 0, revenue: 0, products: new Set() };
            }
            categoryData[order.category].orders++;
            categoryData[order.category].revenue += order.price * order.quantity;
            categoryData[order.category].products.add(order.product);
        });

        return Object.entries(categoryData).map(([category, data]) => ({
            category,
            orders: data.orders,
            revenue: data.revenue.toFixed(2),
            avgOrder: (data.revenue / data.orders).toFixed(2),
            products: data.products.size
        })).sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue));
    }

    getDailySales(orders, days) {
        const dailyData = {};
        orders.forEach(order => {
            const dateKey = order.date.toISOString().split('T')[0];
            if (!dailyData[dateKey]) {
                dailyData[dateKey] = 0;
            }
            dailyData[dateKey] += order.price * order.quantity;
        });
        return dailyData;
    }

    getTopProducts(orders, limit = 10) {
        const productData = {};
        orders.forEach(order => {
            const key = order.product;
            if (!productData[key]) {
                productData[key] = { revenue: 0, quantity: 0, category: order.category };
            }
            productData[key].revenue += order.price * order.quantity;
            productData[key].quantity += order.quantity;
        });

        return Object.entries(productData)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, limit)
            .map(([product, data]) => ({
                product,
                category: data.category,
                revenue: data.revenue.toFixed(2),
                quantity: data.quantity
            }));
    }

    getCustomerInsights(orders) {
        const customerData = {};
        orders.forEach(order => {
            if (!customerData[order.customerId]) {
                customerData[order.customerId] = { orders: 0, revenue: 0 };
            }
            customerData[order.customerId].orders++;
            customerData[order.customerId].revenue += order.price * order.quantity;
        });

        return Object.entries(customerData)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, 10)
            .map(([customerId, data]) => ({
                customerId,
                orders: data.orders,
                revenue: data.revenue.toFixed(2),
                avgOrder: (data.revenue / data.orders).toFixed(2)
            }));
    }
}

// Initialize backend
const backend = new FlipkartAnalyticsBackend();
