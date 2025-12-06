// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
// import AdminRoute from "../components/AdminRoute";
import {
  adminGetAllOrders, adminUpdateOrderStatus,
  adminGetAllSubscriptions, adminCancelSubscription,
  adminGetProducts, adminUpsertProduct, adminDeleteProduct
} from "../../utils/admin";
import AdminRoute from "../../Components/AdminRoute";

// replace your existing OrdersPanel with this version
function OrdersPanel({ onRefresh }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminGetAllOrders();
      setOrders(data || []);
    } catch (e) {
      console.error("Failed to load orders:", e);
      alert("Failed to load orders. Check console.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(id, status) {
    if (!window.confirm(`Mark order ${id.slice(0,8)} as ${status}?`)) return;

    // optimistic UI: update local list
    const prev = orders;
    setOrders(prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdatingId(id);

    try {
      // call admin helper
      const res = await adminUpdateOrderStatus(id, status);
      console.log("adminUpdateOrderStatus response:", res);

      // ensure server data is current
      await load();
      onRefresh && onRefresh();
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status. See console.");
      // rollback optimistic update
      setOrders(prev);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <div>Loading orders…</div>;

  return (
    <div>
      <h3>Orders</h3>
      {orders.length === 0 && <div className="empty">No orders yet</div>}
      {orders.map(o => (
        <div key={o.id} className="card mb-1">
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <div><strong>#{o.id.slice(0,8)}</strong> • {o.items?.length || 0} items</div>
              <div>₹{Number(o.total_amount||0).toFixed(2)} • {o.payment_method}</div>
              <div>Status: {o.status}</div>
            </div>

            <div style={{display:"flex",gap:8}}>
              <button
                onClick={() => changeStatus(o.id, "confirmed")}
                disabled={updatingId === o.id}
                className="btn"
              >
                {updatingId === o.id ? "Working…" : "Confirm"}
              </button>

              <button
                onClick={() => changeStatus(o.id, "delivered")}
                disabled={updatingId === o.id}
                className="btn"
              >
                {updatingId === o.id ? "Working…" : "Mark Delivered"}
              </button>

              <button
                onClick={() => changeStatus(o.id, "cancelled")}
                disabled={updatingId === o.id}
                className="btn"
              >
                {updatingId === o.id ? "Working…" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


function SubsPanel() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await adminGetAllSubscriptions();
      setSubs(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function cancelSub(id) {
    try {
      await adminCancelSubscription(id);
      load();
    } catch (e) { alert("Failed to cancel"); }
  }

  if (loading) return <div>Loading subscriptions…</div>;

  return (
    <div>
      <h3>Subscriptions</h3>
      {subs.map(s => (
        <div key={s.id} className="card mb-1">
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div>
              <div><strong>{s.product_name}</strong> • {s.schedule_type}</div>
              <div>Next: {s.next_delivery_date || "—"}</div>
            </div>
            <div>
              <button onClick={() => cancelSub(s.id)}>Cancel</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await adminGetProducts();
      setProducts(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div>Loading products…</div>;

  return (
    <div>
      <h3>Products</h3>
      {products.map(p => (
        <div key={p.id} className="card mb-1">
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div>
              <div><strong>{p.name}</strong></div>
              <div>{p.description}</div>
            </div>
            <div>
              {/* you can wire edit/delete UI to adminUpsertProduct/adminDeleteProduct */}
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminRoute>
      <div className="page-shell">
        <h2>Admin dashboard</h2>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:18}}>
          <div>
            <OrdersPanel />
            <SubsPanel />
          </div>
          <div>
            <ProductsPanel />
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
