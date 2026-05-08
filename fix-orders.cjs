const fs = require('fs');

let content = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

if (!content.includes('orderStatusFilter')) {
  content = content.replace(
    'const [orders, setOrders] = useState<Order[]>([]);',
    `const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderClientFilter, setOrderClientFilter] = useState("");
  const [orderDateFilter, setOrderDateFilter] = useState("");`
  );
}

if (!content.includes('const filteredOrders')) {
  content = content.replace(
    'const [users, setUsers] = useState<User[]>([]);',
    `const [users, setUsers] = useState<User[]>([]);

  const filteredOrders = orders.filter((order) => {
    let match = true;
    if (orderStatusFilter !== "all" && order.status !== orderStatusFilter) {
      match = false;
    }
    if (orderClientFilter) {
      const clientStr = ((order.userName || "") + " " + (order.userEmail || "")).toLowerCase();
      if (!clientStr.includes(orderClientFilter.toLowerCase())) {
        match = false;
      }
    }
    if (orderDateFilter) {
      if (!new Date(order.createdAt).toISOString().startsWith(orderDateFilter)) {
        match = false;
      }
    }
    return match;
  });`
  );
}

if (!content.includes('handleUpdateOrderStatus')) {
  content = content.replace(
    'const fetchOrders = async () => {',
    `const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(\`/api/admin/orders/\${id}/status\`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: \`Bearer \${token}\` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    setConfirmDialog({
      message: t("admin.common.deleteConfirm") || "Confirmer la suppression",
      onConfirm: async () => {
        try {
          const res = await fetch(\`/api/admin/orders/\${id}\`, {
            method: "DELETE",
            headers: { Authorization: \`Bearer \${token}\` },
          });
          if (res.ok) fetchOrders();
        } catch (error) {
          console.error("Error deleting order:", error);
        }
      }
    });
  };

  const fetchOrders = async () => {`
  );
}

content = content.replace(
  'className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"\n            >',
  `className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 flex-wrap">
                  <input
                    type="text"
                    placeholder="Filtrer par client..."
                    value={orderClientFilter}
                    onChange={(e) => setOrderClientFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none w-64 text-sm"
                  />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvé</option>
                    <option value="paid">Payé</option>
                    <option value="completed">Complété</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                  <input
                    type="date"
                    value={orderDateFilter}
                    onChange={(e) => setOrderDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none text-sm"
                  />
                </div>
                {(orderClientFilter || orderStatusFilter !== "all" || orderDateFilter) && (
                  <button 
                    onClick={() => { setOrderClientFilter(""); setOrderStatusFilter("all"); setOrderDateFilter(""); }} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-4 py-2 bg-blue-50 rounded-lg"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>`
);

content = content.replace(
  '<th className="p-4">{t("admin.common.statusLabel")}</th>',
  '<th className="p-4">{t("admin.common.statusLabel")}</th>\n                    <th className="p-4 text-right">Actions</th>'
);

content = content.replace(
  '{orders.map((order) => {',
  '{filteredOrders.map((order) => {'
);


const statusRegex = /<td className="p-4">\s*<span className=\{\`px-2 py-1 text-xs font-medium rounded-full \$\{order\.status === 'pending' \? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'\}\`\}>\s*\{order\.status === "pending"\s*\?\s*\(i18n\.language === 'fr' \? 'En attente' : 'Pending'\)\s*:\s*order\.status === "completed"\s*\?\s*t\("admin\.common\.completed"\)\s*:\s*order\.status\}\s*<\/span>\s*<\/td>\s*<td className="p-4 text-right">\s*\{billing && \(\s*<button\s*onClick=\{([^}]+)\}\s*className="text-xs text-blue-600 hover:underline"\s*>\s*\{expandedOrderId === order\.id \? "Masquer Adresse" : "Voir Adresse"\}\s*<\/button>\s*\)\}\s*<\/td>/gm;

content = content.replace(statusRegex, `<td className="p-4">
                          <select 
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={\`p-1.5 text-[11px] font-bold rounded-lg uppercase tracking-wider cursor-pointer border outline-none \${
                                order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                order.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                order.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                order.status === 'completed' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                                'bg-red-50 text-red-700 border-red-200'
                            }\`}
                           >
                            <option value="pending" className="bg-white text-gray-900">En attente</option>
                            <option value="approved" className="bg-white text-gray-900">Approuvé</option>
                            <option value="paid" className="bg-white text-gray-900">Payé</option>
                            <option value="completed" className="bg-white text-gray-900">Complété</option>
                            <option value="cancelled" className="bg-white text-gray-900">Annulé</option>
                           </select>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {billing && (
                              <button
                                onClick={$1}
                                className="text-xs px-2 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-medium transition-colors"
                              >
                                {expandedOrderId === order.id ? "Masquer Adresse" : "Voir Adresse"}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                              title="Supprimer la commande"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>`);


fs.writeFileSync('src/pages/Admin.tsx', content, 'utf-8');
console.log("Done");
