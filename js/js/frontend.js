// Frontend Logic - UI Rendering & Interaction

function formatIndianCurrency(amount) {
    return '₹' + parseFloat(amount).toLocaleString('en-IN', {
        maximumFractionDigits: 0
    });
}

function updateDashboard() {
    const dateRange = parseInt(document.getElementById('dateRange').value);
    const category = document.getElementById('category').value;

    let filteredOrders = backend.filterByDateRange(dateRange);
    filteredOrders = backend.filterByCategory(filteredOrders, category);

    renderMetrics(filteredOrders);
    renderInsights(filteredOrders);
    renderCategoryChart(filteredOrders);
    renderTrendChart(filteredOrders, dateRange);
    renderTopProducts(filteredOrders);
    renderCategoryStats(filteredOrders);
    renderCustomerInsights(filteredOrders);
}

function renderMetrics(orders) {
    const metrics = backend.calculateMetrics(orders);
    const metricsHtml = `
        <div class="metric-card">
            <h3>💰 Total Revenue</h3>
            <div class="value">${formatIndianCurrency(metrics.totalRevenue)}</div>
            <div class="change">+18.5% from last period</div>
        </div>
        <div class="metric-card">
            <h3>📦 Total Orders</h3>
            <div class="value">${metrics.totalOrders.toLocaleString('en-IN')}</div>
            <div class="change">+12.3% from last period</div>
        </div>
        <div class="metric-card">
            <h3>💳 Avg Order Value</h3>
            <div class="value">${formatIndianCurrency(metrics.avgOrderValue)}</div>
            <div class="change">+5.7% from last period</div>
        </div>
        <div class="metric-card">
            <h3>👥 Unique Customers</h3>
            <div class="value">${metrics.uniqueCustomers.toLocaleString('en-IN')}</div>
            <div class="change">+22.1% from last period</div>
        </div>
    `;
    document.getElementById('metrics').innerHTML = metricsHtml;
}

function renderInsights(orders) {
    const insights = backend.generateInsights(orders);
    const insightsHtml = insights.map(insight => `
        <div class="insight-card">
            <h4>${insight.title}</h4>
            <p>${insight.text}</p>
        </div>
    `).join('');
    document.getElementById('insights').innerHTML = insightsHtml;
}

function renderCategoryChart(orders) {
    const categoryData = backend.getSalesByCategory(orders);
    const maxValue = Math.max(...Object.values(categoryData));

    const barsHtml = Object.entries(categoryData)
        .sort((a, b) => b[1] - a[1])
        .map(([category, value]) => {
            const height = (value / maxValue) * 100;
            return `
                <div class="bar" style="height: ${height}%">
                    <div class="bar-value">₹${(value / 100000).toFixed(1)}L</div>
                    <div class="bar-label">${category}</div>
                </div>
            `;
        }).join('');

    document.getElementById('categoryChart').innerHTML = `<div class="bar-chart">${barsHtml}</div>`;
}

function renderTrendChart(orders, days) {
    const dailyData = backend.getDailySales(orders, days);
    const sortedDates = Object.keys(dailyData).sort().slice(-14);
    const maxValue = Math.max(...sortedDates.map(date => dailyData[date]));

    const barsHtml = sortedDates.map(date => {
        const value = dailyData[date];
        const height = (value / maxValue) * 100;
        const displayDate = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        return `
            <div class="bar" style="height: ${height}%">
                <div class="bar-value">₹${(value / 100000).toFixed(1)}L</div>
                <div class="bar-label">${displayDate}</div>
            </div>
        `;
    }).join('');

    document.getElementById('trendChart').innerHTML = `<div class="bar-chart">${barsHtml}</div>`;
}

function renderTopProducts(orders) {
    const topProducts = backend.getTopProducts(orders, 10);
    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${topProducts.map((product, index) => `
                    <tr>
                        <td><strong>${index + 1}</strong></td>
                        <td>${product.product}</td>
                        <td>${product.category}</td>
                        <td>${product.quantity}</td>
                        <td class="price">${formatIndianCurrency(product.revenue)}</td>
                        <td><span class="badge ${index < 3 ? 'hot' : 'trending'}">${index < 3 ? '🔥 Hot' : '📈 Trending'}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('topProducts').innerHTML = tableHtml;
}

function renderCategoryStats(orders) {
    const stats = backend.getCategoryStats(orders);
    const statsHtml = stats.map(stat => `
        <div class="stat-box">
            <div class="stat-value">${stat.orders}</div>
            <div class="stat-label">${stat.category}</div>
            <div style="margin-top: 10px; font-size: 0.85em; color: #7b1fa2; font-weight: 600;">
                ${formatIndianCurrency(stat.revenue)}
            </div>
        </div>
    `).join('');
    document.getElementById('categoryStats').innerHTML = statsHtml;
}

function renderCustomerInsights(orders) {
    const customers = backend.getCustomerInsights(orders);
    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Customer ID</th>
                    <th>Total Orders</th>
                    <th>Total Revenue</th>
                    <th>Avg Order Value</th>
                    <th>Segment</th>
                </tr>
            </thead>
            <tbody>
                ${customers.map(customer => {
                    const avgOrder = parseFloat(customer.avgOrder);
                    const segment = avgOrder > 30000 ? '👑 VIP' : avgOrder > 15000 ? '⭐ Premium' : '💚 Regular';
                    return `
                    <tr>
                        <td><strong>${customer.customerId}</strong></td>
                        <td>${customer.orders}</td>
                        <td class="price">${formatIndianCurrency(customer.revenue)}</td>
                        <td>${formatIndianCurrency(customer.avgOrder)}</td>
                        <td><span class="badge trending">${segment}</span></td>
                    </tr>
                `}).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('customerInsights').innerHTML = tableHtml;
}

// Initialize dashboard on page load
updateDashboard();
