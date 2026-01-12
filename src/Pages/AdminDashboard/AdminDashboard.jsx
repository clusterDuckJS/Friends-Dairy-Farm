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
import { LuCircleAlert, LuCircleCheckBig, LuSquareCheckBig, LuTrendingUp, LuTriangleAlert, LuTruck } from "react-icons/lu";

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
  const [orders, setOrders] = useState([]); // filtered
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirm, setConfirm] = useState({ open: false });
  const [allOrders, setAllOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");



  async function load() {
    setLoading(true);
    try {
      const data = await adminGetAllOrders();
      setAllOrders(data || []);
      setOrders(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed", "Could not load orders");
    } finally {
      setLoading(false);
    }
  }

  const stats = {
    total: allOrders.length,
    pending: allOrders.filter(o => o.status === "pending").length,
    confirmed: allOrders.filter(o => o.status === "confirmed").length,
    delivered: allOrders.filter(o => o.status === "delivered").length,
    cancelled: allOrders.filter(o => o.status === "cancelled").length,
  };



  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let filtered = [...allOrders];

    if (statusFilter !== "all") {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.created_at).toISOString().split("T")[0];
        return orderDate === dateFilter;
      });
    }

    setOrders(filtered);
  }, [statusFilter, dateFilter, allOrders]);


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
    <div className="dashboard orders">
      <h2 className="panel-title">Orders</h2>

      <div className="cards-container">
        <div className="card flex space-btw align-center gap-1">
          <div className="text-wrapper">
            <p className="text-light mb-1">Total</p>
            <h3 className="bold text-primary">{stats.total}</h3>
          </div>
          <div className="svg-wrapper square">
            <LuTrendingUp size={24} className="icon-primary" />
          </div>
        </div>

        <div className="card flex space-btw align-center gap-1">
          <div className="text-wrapper">
            <p className="text-light mb-1">Pending</p>
            <h3 className="bold text-success">{stats.pending}</h3>
          </div>
          <div className="svg-wrapper square bg-success">
            <LuTriangleAlert color="orange" size={24} className="text-success" />
          </div>
        </div>

        <div className="card flex space-btw align-center gap-1">
          <div className="text-wrapper">
            <p className="text-light mb-1">Confirmed</p>
            <h3 className="bold text-success">{stats.confirmed}</h3>
          </div>
          <div className="svg-wrapper square bg-success">
            <LuCircleCheckBig size={24} className="text-success" />
          </div>
        </div>

        <div className="card flex space-btw align-center gap-1">
          <div className="text-wrapper">
            <p className="text-light mb-1">Delivered</p>
            <h3 className="bold text-success">{stats.delivered}</h3>
          </div>
          <div className="svg-wrapper square bg-success">
            <LuTruck size={24} className="text-success" />
          </div>
        </div>

        <div className="card flex space-btw align-center gap-1">
          <div className="text-wrapper">
            <p className="text-light mb-1">Cancelled</p>
            <h3 className="bold text-error">{stats.cancelled}</h3>
          </div>
          <div className="svg-wrapper square bg-error">
            <LuCircleAlert size={24} className="text-error" />
          </div>
        </div>
      </div>
      <div className="filter-bar flex gap-1 mb-1">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />

        {(statusFilter !== "all" || dateFilter) && (
          <button
            className="secondary sm"
            onClick={() => {
              setStatusFilter("all");
              setDateFilter("");
            }}
          >
            Clear
          </button>
        )}
      </div>
      {loading ? (
        <div className="empty">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="empty flex-column">
          <h3 className="bold">No orders yet</h3>
          <p className="text-light">Orders will appear here once customers place them.</p>
        </div>
      ) : (<>


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

                <td className="no-wrap">
                  {Array.isArray(o.items)
                    ? o.items.map((it, i) => (
                      <div key={i}>
                        {it.name} ×{it.qty}
                      </div>
                    ))
                    : (
                      <pre style={{ margin: 0 }}>
                        {JSON.stringify(o.items)}
                      </pre>
                    )}
                </td>

                <td>₹{Number(o.total_amount || 0).toFixed(2)}</td>

                {/* ✅ FIXED USER COLUMN */}
                <td>
                  {o.user ? (
                    <div>
                      <div className="bold">{o.user.full_name || "—"}</div>
                      <div className="text-light">{o.user.phone || "—"}</div>
                    </div>
                  ) : (
                    <span className="text-light">No data</span>
                  )}
                </td>

                <td style={{ maxWidth: 240 }}>
                  {formatScheduleReadable(o)}
                </td>

                <td>
                  <StatusBadge status={o.status} />
                </td>

                <td className="mono">
                  {formatDateTime(o.created_at)}
                </td>

                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      disabled={updatingId === o.id}
                      onClick={() =>
                        setConfirm({
                          open: true,
                          id: o.id,
                          status: "confirmed",
                          cb: () => changeStatus(o.id, "confirmed"),
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
                          cb: () => changeStatus(o.id, "delivered"),
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
                          cb: () => changeStatus(o.id, "cancelled"),
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
      </>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Confirm status change"
        message={`Change order ${confirm.id?.slice(0, 8)} to "${confirm.status}"?`}
        onConfirm={() => {
          setConfirm({ open: false });
          confirm.cb && confirm.cb();
        }}
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
    <div className="dashboard subscription">
      <h2 className="panel-title">Subscriptions</h2>
      <div className="cards-container">
        <div className="card flex space-btw align-center gap-1">
          <div className="text-wrapper">
            <p className="text-light mb-1">Total</p>
            <h3 className="bold text-primary">{subs.length}</h3>
          </div>
          <div className="svg-wrapper square">
            <LuTrendingUp size={24} className="icon-primary" />
          </div>
        </div>
        <div className="card flex space-btw align-center gap-1">
          <div className="text-wrapper">
            <p className="text-light mb-1">Active</p>
            <h3 className="bold text-success">{subs.filter(s => s.is_active).length}</h3>
          </div>
          <div className="svg-wrapper square bg-success">
            <LuCircleCheckBig size={24} className="text-success" />
          </div>
        </div>
        <div className="card flex space-btw align-center gap-1">
          <div className="text-wrapper">
            <p className="text-light mb-1">Inactive</p>
            <h3 className="bold text-error">{subs.filter(s => !s.is_active).length}</h3>
          </div>
          <div className="svg-wrapper square bg-error">
            <LuCircleAlert size={24} className="text-error" />
          </div>
        </div>
      </div>

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
                  <td>
                    <div>
                      <strong>{s.profiles?.full_name || "Unknown user"}</strong>
                      <div className="muted">
                        {s.profiles?.phone || s.profiles?.email}
                      </div>
                    </div>
                  </td>


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
    <div className="dashboard users">
      <h2 className="panel-title">Users</h2>
      {loading ? <div className="empty">Loading users…</div> : (
        <>
          <div className="cards-container">
            <div className="card flex space-btw align-center gap-1">
              <div className="text-wrapper">
                <p className="text-light mb-1">Total</p>
                <h3 className="bold text-primary">{users.length}</h3>
              </div>
              <div className="svg-wrapper square">
                <LuTrendingUp size={24} className="icon-primary" />
              </div>
            </div>

            <div className="card flex space-btw align-center gap-1">
              <div className="text-wrapper">
                <p className="text-light mb-1">Active</p>
                <h3 className="bold text-primary">{users.length}</h3>
              </div>
              <div className="svg-wrapper square bg-error">
                <LuCircleAlert size={24} className="text-error" />
              </div>
            </div>
            <div className="card flex space-btw align-center gap-1">
              <div className="text-wrapper">
                <p className="text-light mb-1">Weekly Change</p>
                <h3 className="bold text-primary">+{users.length}</h3>
              </div>
              <div className="svg-wrapper square bg-error">
                <LuCircleAlert size={24} className="text-error" />
              </div>
            </div>
          </div>
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
        </>
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
