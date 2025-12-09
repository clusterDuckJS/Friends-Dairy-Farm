// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import "./admin-dashboard.css";
import AdminRoute from "../../components/AdminRoute";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal.jsx";
import { useToast } from "../../Context/ToastContext";
import { supabase } from "../../utils/supabaseClient";
import {
  adminGetAllOrders,
  adminUpdateOrderStatus,
  adminGetAllSubscriptions,
  adminCancelSubscription,
  adminGetProducts,
  adminDeleteProduct,
  adminUpsertProduct
} from "../../utils/admin";
import { formatDateOnly, formatDateTime } from "../../utils/date.js";
import { formatScheduleReadable } from "../../utils/scheduleUtils.js";

export default function AdminDashboardPage() {
  return (
    <AdminRoute>
      <div className="admin-shell">
        <header className="admin-head">
          <h1>Admin dashboard</h1>
          <p className="muted">Manage orders, users and subscriptions</p>
        </header>
        <AdminTabs />
      </div>
    </AdminRoute>
  );
}

/* ---------- Tabs component ---------- */

function AdminTabs() {
  const [tab, setTab] = useState("orders"); // default
  return (
    <div>
      <div className="tabs">
        <button className={`tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>Orders</button>
        <button className={`tab ${tab === "subscriptions" ? "active" : ""}`} onClick={() => setTab("subscriptions")}>Subscriptions</button>
        <button className={`tab ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>Users</button>
        {/* <button className={`tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>Products</button> */}
      </div>

      <div className="tab-panel">
        {tab === "orders" && <OrdersPanel />}
        {tab === "subscriptions" && <SubscriptionsPanel />}
        {tab === "users" && <UsersPanel />}
        {/* {tab === "products" && <ProductsPanel />} */}
      </div>
    </div>
  );
}

/* ---------- Orders ---------- */


function OrdersPanel() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirm, setConfirm] = useState({ open: false });

  async function load() {
    setLoading(true);
    try {
      const data = await adminGetAllOrders();
      setOrders(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed", "Could not load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(id, status) {
    setUpdatingId(id);
    try {
      await adminUpdateOrderStatus(id, status);
      toast.success("Updated", `Order ${id.slice(0, 8)} → ${status}`);
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed", "Could not update order");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h2 className="panel-title">Orders</h2>
      {loading ? <div className="empty">Loading orders…</div> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Items</th>
              <th>Total</th>
              <th>User</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Placed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td className="mono">#{o.id.slice(0, 8)}</td>

                <td>
                  {Array.isArray(o.items)
                    ? o.items.map((it, i) => (
                      <div key={i}>{it.name} ×{it.qty}</div>
                    ))
                    : <pre style={{ margin: 0 }}>{JSON.stringify(o.items)}</pre>}
                </td>

                <td>₹{Number(o.total_amount || 0).toFixed(2)}</td>

                <td className="mono">{o.user_id?.slice(0, 8) || "—"}</td>

                {/* <-- CLEAN SCHEDULE DISPLAY --> */}
                <td style={{ maxWidth: 240 }}>
                  {formatScheduleReadable(o)}
                </td>

                <td>
                  <StatusBadge status={o.status} />
                </td>

                <td className="mono">{formatDateTime(o.created_at)}</td>

                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      disabled={updatingId === o.id}
                      onClick={() =>
                        setConfirm({
                          open: true,
                          id: o.id,
                          status: "confirmed",
                          cb: () => changeStatus(o.id, "confirmed")
                        })
                      }
                      className="primary sm"
                    >
                      Confirm
                    </button>

                    <button
                      disabled={updatingId === o.id}
                      onClick={() =>
                        setConfirm({
                          open: true,
                          id: o.id,
                          status: "delivered",
                          cb: () => changeStatus(o.id, "delivered")
                        })
                      }
                      className="primary sm"
                    >
                      Delivered
                    </button>

                    <button
                      disabled={updatingId === o.id}
                      onClick={() =>
                        setConfirm({
                          open: true,
                          id: o.id,
                          status: "cancelled",
                          cb: () => changeStatus(o.id, "cancelled")
                        })
                      }
                      className="secondary cancel sm"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Confirm status change"
        message={`Change order ${confirm.id?.slice(0, 8)} to "${confirm.status}"?`}
        onConfirm={() => { setConfirm({ open: false }); confirm.cb && confirm.cb(); }}
        onCancel={() => setConfirm({ open: false })}
      />
    </div>
  );
}



/* ---------- Subscriptions ---------- */

function SubscriptionsPanel() {
  const toast = useToast();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false });

  async function load() {
    setLoading(true);
    try {
      const data = await adminGetAllSubscriptions();
      setSubs(data || []);
    } catch (e) {
      console.error("subscriptions load:", e);
      toast.error("Failed", "Could not load subscriptions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function cancelSub(id) {
    try {
      await adminCancelSubscription(id);
      toast.success("Cancelled", `Subscription ${id.slice(0, 8)} cancelled`);
      await load();
    } catch (e) {
      console.error("cancel subscription:", e);
      toast.error("Failed", "Could not cancel subscription");
    }
  }

  return (
    <div>
      <h2 className="panel-title">Subscriptions</h2>

      {loading ? (
        <div className="empty">Loading…</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Schedule</th>
              <th>Next</th>
              <th>User</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {subs.map(s => {
              const scheduleText = formatScheduleReadable(s);
              const nextDate = s.next_delivery_date ? formatDateOnly(s.next_delivery_date) : "—";
              return (
                <tr key={s.id}>
                  <td className="mono">{s.id.slice(0, 8)}</td>
                  <td style={{ maxWidth: 320 }}>{s.product_name}</td>
                  <td style={{ maxWidth: 280 }}>{scheduleText}</td>
                  <td className="mono">{nextDate}</td>
                  <td className="mono">{s.user_id?.slice(0, 8) || "—"}</td>
                  <td>{s.is_active ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="secondary sm cancel"
                      onClick={() => setConfirm({ open: true, id: s.id, cb: () => cancelSub(s.id) })}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Confirm cancel"
        message={`Cancel subscription ${confirm.id?.slice(0, 8)}?`}
        onConfirm={() => { setConfirm({ open: false }); confirm.cb && confirm.cb(); }}
        onCancel={() => setConfirm({ open: false })}
      />
    </div>
  );
}


/* ---------- Users ---------- */

function UsersPanel() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  async function load() {
    setLoading(true);
    try {
      // fetch profiles (includes is_admin); also fetch email via auth.users view
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, delivery_address, is_admin, email, created_at")
        .order("created_at", { ascending: false });

      // fallback: if no user_email field, just return profile rows
      if (error) {
        console.warn("profiles fetch:", error);
        const { data: d } = await supabase.from("profiles").select("*");
        setUsers(d || []);
      } else {
        // supabase may not map email via alias; if user_email missing, keep as-is
        setUsers(data || []);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed", "Could not load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleAdmin(row) {
    setToggling(row.id);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ is_admin: !row.is_admin })
        .eq("id", row.id)
        .select()
        .single();

      if (error) throw error;
      toast.success("Updated", `${row.full_name || row.id.slice(0, 8)} is ${data.is_admin ? "admin" : "user"}`);
      await load();
    } catch (e) {
      console.error(e);
      toast.error("Failed", "Could not update user");
    } finally {
      setToggling(null);
    }
  }

  return (
    <div>
      <h2 className="panel-title">Users</h2>
      {loading ? <div className="empty">Loading users…</div> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Admin</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{u.full_name || <span className="mono">{u.id.slice(0, 8)}</span>}</div>
                  <div className="muted mono">{u.user_email || u.email || "—"}</div>
                </td>
                <td>{u.phone || "—"}</td>
                <td style={{ maxWidth: 280 }}>{u.delivery_address || "—"}</td>
                <td>{u.is_admin ? "Yes" : "No"}</td>
                <td className="mono">{u.created_at ? new Date(u.created_at).toLocaleString() : "—"}</td>
                <td>
                  <button className="primary sm" disabled={toggling === u.id} onClick={() => toggleAdmin(u)}>
                    {toggling === u.id ? "Working…" : (u.is_admin ? "Revoke" : "Make admin")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ---------- Products (simple) ---------- */

function ProductsPanel() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await adminGetProducts();
      setProducts(res || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed", "Could not load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function removeProduct(id) {
    if (!window.confirm("Delete product?")) return;
    try {
      await adminDeleteProduct(id);
      toast.success("Deleted", "Product removed");
      await load();
    } catch (e) {
      console.error(e);
      toast.error("Failed", "Could not delete product");
    }
  }

  return (
    <div>
      <h2 className="panel-title">Products</h2>
      {loading ? <div className="empty">Loading…</div> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Variants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 700 }}>{p.name}</td>
                <td style={{ maxWidth: 320 }}>{p.description}</td>
                <td>{Array.isArray(p.variants) ? p.variants.map(v => `${v.size} ₹${v.price}`).join(", ") : JSON.stringify(p.variants)}</td>
                <td>
                  <button className="btn ghost" onClick={() => alert("Edit product not wired yet")}>Edit</button>
                  <button className="btn" onClick={() => removeProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ---------- small helpers ---------- */

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const map = {
    pending: "badge-grey",
    confirmed: "badge-blue",
    delivered: "badge-green",
    cancelled: "badge-red"
  };
  return <span className={`badge-small ${map[s] || "badge-grey"}`}>{status}</span>;
}
