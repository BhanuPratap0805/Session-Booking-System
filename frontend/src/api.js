const API_URL = import.meta.env.VITE_API_URL || '';

// Expert APIs
export async function getExperts({ page = 1, limit = 6, search = '', category = '' } = {}) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const res = await fetch(`${API_URL}/api/experts?${params}`);
    if (!res.ok) throw new Error('Failed to fetch experts');
    const json = await res.json();
    // Backend returns { success, data: [...experts], pagination: { totalPages, ... } }
    // Normalize to { data: { experts, totalPages } }
    return {
        data: {
            experts: json.data || [],
            totalPages: json.pagination?.totalPages || 1,
        },
    };
}

export async function getExpertById(id) {
    const res = await fetch(`${API_URL}/api/experts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch expert');
    const json = await res.json();
    // Backend returns { success, data: { ...expert } }
    return { data: json.data || json };
}

export async function getCategories() {
    const res = await fetch(`${API_URL}/api/experts/categories/list`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    // Backend returns { success, data: [...categories] }
    return { data: json.data || json };
}

// Booking APIs
export async function createBooking(bookingData) {
    const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
    });
    const json = await res.json();
    if (!res.ok) {
        const err = new Error(json.message || 'Booking failed');
        err.response = { data: json };
        err.status = res.status;
        throw err;
    }
    return { data: json.data || json };
}

export async function getBookingsByEmail(email) {
    const res = await fetch(
        `${API_URL}/api/bookings?email=${encodeURIComponent(email)}`
    );
    if (!res.ok) throw new Error('Failed to fetch bookings');
    const json = await res.json();
    // Backend returns { success, data: [...bookings] }
    return { data: json.data || json };
}

export async function updateBookingStatus(id, status) {
    const res = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update booking status');
    const json = await res.json();
    return { data: json.data || json };
}
