package com.icareer.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class WebController implements ErrorController {

    /**
     * This method handles all requests that are not mapped to other controllers
     * (e.g., your API controllers). It forwards them to the root of the React app.
     * This is the key to making client-side routing work with Spring Boot.
     *
     * @param request The incoming HTTP request.
     * @return A forward instruction to the index.html page.
     */
    @RequestMapping(value = { "/", "/error" })
    public String index(HttpServletRequest request) {
        // Check if the request is for an API endpoint or a static file, if so, let it be handled by the error page
        String path = request.getRequestURI();
        if (path.startsWith("/api/") || path.startsWith("/static/") || path.contains(".")) {
             // Returning 'error' will let spring boot handle it (e.g., show a 404 page)
             // for API calls that don't exist.
             return "error"; 
        }
        // For all other paths, forward to the single page app's entry point
        return "forward:/index.html";
    }
}