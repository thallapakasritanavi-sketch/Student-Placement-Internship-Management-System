const API = {
    baseUrl: '/api',

    getUser() {
        try {
            return JSON.parse(localStorage.getItem('placement_user')) || null;
        } catch (e) {
            return null;
        }
    },

    setUser(user) {
        localStorage.setItem('placement_user', JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem('placement_user');
        window.location.href = '/login.html';
    },

    requireRole(role) {
        const user = this.getUser();
        if (!user) {
            window.location.href = '/login.html';
            return null;
        }
        if (role && user.role !== role) {
            if (user.role === 'ADMIN') window.location.href = '/admin-dashboard.html';
            else if (user.role === 'STUDENT') window.location.href = '/student-dashboard.html';
            else if (user.role === 'RECRUITER') window.location.href = '/recruiter-dashboard.html';
            else window.location.href = '/login.html';
            return null;
        }
        return user;
    },

    async request(endpoint, options = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };

        try {
            const response = await fetch(this.baseUrl + endpoint, config);
            const data = await response.json().catch(() => ({ success: false, message: 'Invalid JSON response from server' }));

            if (!response.ok) {
                const msg = data.message || (data.data && typeof data.data === 'object' ? Object.values(data.data).join(', ') : 'Request failed with status ' + response.status);
                throw new Error(msg);
            }
            return data;
        } catch (err) {
            this.showToast(err.message || 'Network error occurred', 'danger');
            throw err;
        }
    },

    showToast(message, type = 'primary') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-bg-${type} border-0 show mb-2 shadow`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        container.appendChild(toastEl);
        setTimeout(() => {
            toastEl.remove();
        }, 4000);
    },

    // Auth
    async login(email, password) {
        const res = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (res.success && res.data) {
            this.setUser(res.data);
        }
        return res;
    },

    async register(data) {
        const res = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (res.success && res.data) {
            this.setUser(res.data);
        }
        return res;
    },

    // Student
    async getStudentProfile(studentId) {
        return await this.request(`/students/${studentId}`);
    },

    async updateStudentProfile(studentId, profileData) {
        return await this.request(`/students/${studentId}`, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },

    async getStudentStats(studentId) {
        return await this.request(`/students/${studentId}/stats`);
    },

    async getAllStudents() {
        return await this.request('/students');
    },

    // Jobs
    async getJobs(studentId) {
        const query = studentId ? `?studentId=${studentId}` : '';
        return await this.request(`/jobs${query}`);
    },

    async searchJobs(keyword, location, jobType, studentId) {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);
        if (jobType) params.append('jobType', jobType);
        if (studentId) params.append('studentId', studentId);
        return await this.request(`/jobs/search?${params.toString()}`);
    },

    async createJob(jobData) {
        return await this.request('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData)
        });
    },

    async updateJob(id, jobData) {
        return await this.request(`/jobs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(jobData)
        });
    },

    async deleteJob(id) {
        return await this.request(`/jobs/${id}`, {
            method: 'DELETE'
        });
    },

    // Internships
    async getInternships(studentId) {
        const query = studentId ? `?studentId=${studentId}` : '';
        return await this.request(`/internships${query}`);
    },

    async searchInternships(keyword, location, studentId) {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);
        if (studentId) params.append('studentId', studentId);
        return await this.request(`/internships/search?${params.toString()}`);
    },

    async createInternship(internshipData) {
        return await this.request('/internships', {
            method: 'POST',
            body: JSON.stringify(internshipData)
        });
    },

    async updateInternship(id, internshipData) {
        return await this.request(`/internships/${id}`, {
            method: 'PUT',
            body: JSON.stringify(internshipData)
        });
    },

    async deleteInternship(id) {
        return await this.request(`/internships/${id}`, {
            method: 'DELETE'
        });
    },

    // Applications
    async apply(studentId, jobId, internshipId, notes) {
        return await this.request('/applications', {
            method: 'POST',
            body: JSON.stringify({ studentId, jobId, internshipId, notes })
        });
    },

    async getStudentApplications(studentId) {
        return await this.request(`/applications/student/${studentId}`);
    },

    async getAllApplications() {
        return await this.request('/applications');
    },

    async updateApplicationStatus(id, status, notes) {
        return await this.request(`/applications/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, notes })
        });
    },

    // Placement Drives
    async getPlacementDrives() {
        return await this.request('/placement-drives');
    },

    async createPlacementDrive(driveData) {
        return await this.request('/placement-drives', {
            method: 'POST',
            body: JSON.stringify(driveData)
        });
    },

    async deletePlacementDrive(id) {
        return await this.request(`/placement-drives/${id}`, {
            method: 'DELETE'
        });
    },

    // Interviews
    async getStudentInterviews(studentId) {
        return await this.request(`/interviews/student/${studentId}`);
    },

    async getAllInterviews() {
        return await this.request('/interviews');
    },

    async scheduleInterview(interviewData) {
        return await this.request('/interviews', {
            method: 'POST',
            body: JSON.stringify(interviewData)
        });
    },

    async deleteInterview(id) {
        return await this.request(`/interviews/${id}`, {
            method: 'DELETE'
        });
    },

    // Notifications
    async getNotifications(userId) {
        return await this.request(`/notifications/user/${userId}`);
    },

    async markNotificationRead(id) {
        return await this.request(`/notifications/${id}/read`, { method: 'PUT' });
    },

    async markAllNotificationsRead(userId) {
        return await this.request(`/notifications/user/${userId}/read-all`, { method: 'PUT' });
    },

    // Admin
    async getAdminStats() {
        return await this.request('/admin/stats');
    }
};
