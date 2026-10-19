package com.sritanavi.placement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping("/login")
    public String login() {
        return "forward:/login.html";
    }

    @GetMapping("/register")
    public String register() {
        return "forward:/register.html";
    }

    @GetMapping("/student/dashboard")
    public String studentDashboard() {
        return "forward:/student-dashboard.html";
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "forward:/admin-dashboard.html";
    }

    @GetMapping("/recruiter/dashboard")
    public String recruiterDashboard() {
        return "forward:/recruiter-dashboard.html";
    }
}
