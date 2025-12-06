import React, { useEffect, useState } from 'react'
import './profile.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getProfile, getSubscriptionsForUser, upsertProfile } from '../../utils/profile';
import Modal from '../../Components/Modal/Modal';
import ScheduleModal from '../../Components/ScheduleModal/ScheduleModal';
import { cancelSubscription } from '../../utils/subscription';
import { getOrdersForUser } from '../../utils/orders';
import { supabase } from '../../utils/supabaseClient';

function Profile() {
    const user = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        full_name: "",
        phone: "",
        delivery_address: "",
    });
    const [subscriptions, setSubscriptions] = useState([]);
    const [showSchedule, setShowSchedule] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user === undefined) return; // still loading auth
        if (!user) {
            navigate("/login");
            return;
        }

        async function fetchData() {

            setLoading(true);
            try {
                const p = await getProfile(user.id);
                if (p) {
                    setProfile({
                        full_name: p.full_name || "",
                        phone: p.phone || "",
                        delivery_address: p.delivery_address || "",
                    });
                } else {
                    // profile absent: prefill with email and empty fields
                    setProfile({
                        full_name: "",
                        phone: "",
                        delivery_address: "",
                    });
                }
                const subs = await getSubscriptionsForUser(user.id);
                setSubscriptions(subs);

                const ords = await getOrdersForUser(user.id);
                setOrders(ords || []);
            } catch (err) {
                console.error("Profile load error:", err);
                alert("Failed to load profile. Check console.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [user, navigate]);


    async function handleCancel(id) {
        const confirmCancel = window.confirm("Are you sure you want to cancel this delivery?");
        if (!confirmCancel) return;

        try {
            await cancelSubscription(id);

            // refresh subscriptions
            const subs = await getSubscriptionsForUser(user.id);
            setSubscriptions(subs);

        } catch (err) {
            console.error("Cancel error:", err);
            alert("Failed to cancel subscription");
        }
    }

    async function handleSave(e) {
        e?.preventDefault();
        setSaving(true);
        try {
            await upsertProfile({
                userId: user.id,
                full_name: profile.full_name,
                phone: profile.phone,
                delivery_address: profile.delivery_address,
            });

            alert("Profile saved.");
        } catch (err) {
            console.error("Save profile error:", err);
            alert("Failed to save profile: " + (err?.message || err));
        } finally {
            setSaving(false);
        }
    }

    if (user === undefined || loading) {
        return <div className="page-shell"><p>Loading account…</p></div>;
    }
    return (
        <div className="page-shell">
            <h2 className="page-title">My Account</h2>

            <div className="card account-card">
                {/* left column */}
                <div className="account-grid">
                    <div>
                        <div className="muted-label">Name</div>
                        <div className="muted-value">{profile.full_name || <em>User Name</em>}</div>

                        <div className="muted-label">Delivery Address</div>
                        <div className="muted-value">{profile.delivery_address || <em>Not set</em>}</div>
                    </div>

                    <div>
                        <div className="muted-label">Phone</div>
                        <div className="muted-value">{profile.phone || <em>--</em>}</div>

                        <div className="muted-label">Email</div>
                        <div className="muted-value">{user.email}</div>
                    </div>
                </div>

                <hr style={{ margin: "18px 0" }} />

                <form className="profile-form" onSubmit={handleSave}>
                    <label className="label">Full name</label>
                    <input className="input" value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} />

                    <label className="label">Phone</label>
                    <input className="input" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />

                    <label className="label">Delivery address</label>
                    <textarea className="input input-area" value={profile.delivery_address} onChange={e => setProfile({ ...profile, delivery_address: e.target.value })} />

                    <div className="form-actions">
                        <button className="primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>
                        <button type="button" className="secondary" onClick={() => setShowSchedule(true)}>Schedule New Delivery</button>
                    </div>
                </form>
            </div>

            <h2 className="page-title" style={{ marginTop: 28 }}>Active Subscriptions</h2>

            <div>
                {subscriptions.filter(s => s.is_active).length === 0 ? (
                    <div className="empty">No active subscriptions.
                        <button className="primary" onClick={() => navigate("/products")}>Browse products</button>
                    </div>
                ) : subscriptions.filter(sub => sub.is_active).map(sub => (
                    <div className="card sub-card" key={sub.id}>
                        <div className="sub-grid">

                            <div>
                                <div className="muted-label">Name</div>
                                <div className="muted-value">{sub.product_name}</div>

                                <div className="muted-label">Delivery Address</div>
                                <div className="muted-value">{profile.delivery_address || <em>—</em>}</div>
                            </div>

                            <div>
                                <div className="muted-label">Phone</div>
                                <div className="muted-value">{profile.phone || <em>—</em>}</div>

                                <div className="muted-label">Email</div>
                                <div className="muted-value">{user.email}</div>
                            </div>

                            <div className="sub-meta">
                                <div className="muted-label">Schedule</div>
                                <div className="muted-value">
                                    {sub.schedule_type} {sub.schedule_meta ? JSON.stringify(sub.schedule_meta) : ""}
                                </div>

                                <div className="muted-label">Next Delivery</div>
                                <div className="muted-value">{sub.next_delivery_date || "—"}</div>

                                {/* CANCEL BUTTON */}
                                <button
                                    className="secondary"
                                    onClick={() => handleCancel(sub.id)}
                                    style={{ marginTop: "10px" }}
                                >
                                    Cancel Delivery
                                </button>
                            </div>

                        </div>
                    </div>

                ))}
            </div>

            <div>
                {orders.length === 0 ? (
                    <div className="empty">
                        No orders yet. <button className="primary-btn-sm" onClick={() => navigate("/products")}>Shop now</button>
                    </div>
                ) : (
                    orders.map(order => (
                        <div className="card order-card" key={order.id}>
                            <div className="order-grid">
                                <div>
                                    <div className="muted-label">Order</div>
                                    <div className="muted-value">#{order.id.slice(0, 8)}</div>

                                    <div className="muted-label">Items</div>
                                    <div className="muted-value">
                                        {Array.isArray(order.items) ? (
                                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                                                {order.items.map((it, i) => (
                                                    <li key={i}>{it.name} ×{it.qty} — ₹{(Number(it.price || 0) * Number(it.qty || 1)).toFixed(2)}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <pre style={{ margin: 0 }}>{JSON.stringify(order.items)}</pre>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="muted-label">Total</div>
                                    <div className="muted-value">₹{Number(order.total_amount || 0).toFixed(2)}</div>

                                    <div className="muted-label">Payment</div>
                                    <div className="muted-value">{order.payment_method || "cod"}</div>
                                </div>

                                <div className="order-meta">
                                    <div className="muted-label">Schedule</div>
                                    <div className="muted-value">{order.schedule_type} {order.schedule_meta ? JSON.stringify(order.schedule_meta) : ""}</div>

                                    <div className="muted-label">Status</div>
                                    <div className="muted-value">{order.status}</div>

                                    <div className="muted-label">Placed</div>
                                    <div className="muted-value">{new Date(order.created_at).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Modal open={showSchedule} onClose={() => setShowSchedule(false)}>
                <ScheduleModal
                    onClose={() => setShowSchedule(false)}
                    onCreated={async () => {
                        const subs = await getSubscriptionsForUser(user.id);
                        setSubscriptions(subs);
                    }}
                />
            </Modal>
        </div>
    )
}

export default Profile