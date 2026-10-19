package com.sritanavi.placement.dto;

import java.util.Map;

public class DashboardStatsDto {

    public static class AdminStats {
        private long totalStudents;
        private long totalCompanies;
        private long totalJobs;
        private long totalInternships;
        private long totalApplications;
        private long selectedStudents;
        private long upcomingInterviews;
        private Map<String, Long> applicationsByStatus;

        public AdminStats() {}

        public long getTotalStudents() { return totalStudents; }
        public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

        public long getTotalCompanies() { return totalCompanies; }
        public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }

        public long getTotalJobs() { return totalJobs; }
        public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

        public long getTotalInternships() { return totalInternships; }
        public void setTotalInternships(long totalInternships) { this.totalInternships = totalInternships; }

        public long getTotalApplications() { return totalApplications; }
        public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

        public long getSelectedStudents() { return selectedStudents; }
        public void setSelectedStudents(long selectedStudents) { this.selectedStudents = selectedStudents; }

        public long getUpcomingInterviews() { return upcomingInterviews; }
        public void setUpcomingInterviews(long upcomingInterviews) { this.upcomingInterviews = upcomingInterviews; }

        public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
        public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) { this.applicationsByStatus = applicationsByStatus; }
    }

    public static class StudentStats {
        private String studentName;
        private int profileCompletion;
        private long availableJobs;
        private long availableInternships;
        private long totalApplications;
        private long shortlistedApplications;
        private long selectedApplications;
        private long upcomingInterviews;
        private long unreadNotifications;

        public StudentStats() {}

        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }

        public int getProfileCompletion() { return profileCompletion; }
        public void setProfileCompletion(int profileCompletion) { this.profileCompletion = profileCompletion; }

        public long getAvailableJobs() { return availableJobs; }
        public void setAvailableJobs(long availableJobs) { this.availableJobs = availableJobs; }

        public long getAvailableInternships() { return availableInternships; }
        public void setAvailableInternships(long availableInternships) { this.availableInternships = availableInternships; }

        public long getTotalApplications() { return totalApplications; }
        public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

        public long getShortlistedApplications() { return shortlistedApplications; }
        public void setShortlistedApplications(long shortlistedApplications) { this.shortlistedApplications = shortlistedApplications; }

        public long getSelectedApplications() { return selectedApplications; }
        public void setSelectedApplications(long selectedApplications) { this.selectedApplications = selectedApplications; }

        public long getUpcomingInterviews() { return upcomingInterviews; }
        public void setUpcomingInterviews(long upcomingInterviews) { this.upcomingInterviews = upcomingInterviews; }

        public long getUnreadNotifications() { return unreadNotifications; }
        public void setUnreadNotifications(long unreadNotifications) { this.unreadNotifications = unreadNotifications; }
    }
}
